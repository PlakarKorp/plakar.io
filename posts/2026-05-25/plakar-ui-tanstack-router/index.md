
In progress. Check back soon for the full article!

<!-- If you've only built backend services in Go, you've used routers — something like `net/http.ServeMux` or a third-party library like `chi` or `gin`. The concept is the same on the frontend, but the mechanics are different in ways that take some getting used to.

Let's start from the beginning.

## What Is a Router and Why Does a Frontend App Need One?

In a traditional server-rendered web application, the URL is a direct instruction to the server. When you visit `https://myapp.com/users/42`, the server receives a request for that path, runs the appropriate handler, fetches user 42 from the database, renders an HTML page, and sends it back. The browser displays the result. Simple.

In a Single Page Application (SPA), none of that happens. The entire application — all the JavaScript, all the routing logic — is delivered to the browser in a single bundle. The server returns one HTML file with a `<script>` tag, and after that, everything runs client-side. When you navigate from `/users` to `/users/42`, there's no server request. The JavaScript intercepts the URL change and renders a different component.

Without a router, this breaks in ways that feel subtle but are deeply annoying to users:

- The back button doesn't work — it would navigate *out* of the app, back to wherever the user came from
- Links are meaningless — you can't bookmark `/users/42` and come back to it, because the app doesn't know how to render it on initial load
- Sharing a URL is broken — if you paste `https://myapp.com/users/42` into a chat, the recipient will land on the app's blank state, not on user 42
- Refresh is broken — same problem as above

A router solves this by maintaining a mapping between URL patterns and the components that should render for each. It intercepts URL changes (from `<a>` clicks, browser history navigation, programmatic redirects) and renders the right components without a server round-trip. It also handles the initial load, so that if someone lands directly on `/users/42`, the correct component renders.

Every serious SPA has a router. The question is which one, and why.

## Why TanStack Router

There are several mature router options for React. The most widely used is React Router (now React Router v7 / Remix). It works fine. But we chose TanStack Router for one reason above all others: it is fully type-safe.

When you create a link to a route with TanStack Router, TypeScript knows whether that route exists. It knows what path parameters the route expects. It knows what search parameters are valid. If you rename a route's path, every link to it that uses the old path becomes a compile error.

This might sound like a minor convenience. It isn't. In a large application where routes get renamed, paths get restructured, and parameters get added or removed, having TypeScript enforce consistency across the entire routing tree catches bugs before they reach anyone. We've experienced the alternative — a rename that missed a few link destinations, discovered three days later by a user reporting a 404 — and we don't miss it.

## File-Based Routing

TanStack Router supports file-based routing, which is the pattern we use. Route files live in `src/routes/`, and the route tree is generated automatically from the file structure. You never write the route tree manually.

The naming conventions are:
- `src/routes/index.tsx` → `/`
- `src/routes/login.tsx` → `/login`
- `src/routes/_layout/users.index.tsx` → `/users`
- `src/routes/_layout/users.$id.tsx` → `/users/:id`
- `src/routes/_layout/users.$id.settings.tsx` → `/users/:id/settings`

The `_layout` prefix creates a layout route — a component that wraps a group of routes with shared UI (sidebar, navigation, breadcrumbs). The `$` prefix in filenames marks dynamic segments (URL parameters).

The generated `routeTree.gen.ts` file stitches everything together. You never edit it manually — the CLI regenerates it whenever route files change.

## Creating a Route

Here's a realistic route file — the login page from Plakar:

```tsx
// src/routes/login.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

export const Route = createFileRoute("/login")({
  validateSearch: zodValidator(
    z.object({
      redirect: z.string().catch("").default("/"),
    })
  ),
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const search = Route.useSearch(); // { redirect: string }

  return (
    <div>
      <h1>Sign in</h1>
      {/* form that calls router.history.push(search.redirect) on success */}
    </div>
  );
}
```

The `createFileRoute("/login")` call binds this file to the `/login` path and returns a typed route object. That string is validated at compile time — if the file's path and the route string disagree, you get an error.

`Route.useSearch()` returns the search params with the shape defined in `validateSearch`. If the URL is `/login?redirect=/dashboard`, then `search.redirect` is `"/dashboard"`. If the URL is `/login`, `search.redirect` defaults to `"/"` because we called `.default("/")` in the Zod schema.

## Type-Safe Links

Creating a link to this route looks like this:

```tsx
import { Link } from "@tanstack/react-router";

// TypeScript knows this route exists and that `redirect` is a valid search param
<Link to="/login" search={{ redirect: "/settings" }}>
  Sign in
</Link>
```

If you change the login route's path from `/login` to `/auth/login`, this link becomes a type error because `/login` no longer exists in the route tree. TypeScript will tell you every component that needs updating.

For routes with URL parameters:

```tsx
// Linking to /users/$id/settings
<Link
  to="/users/$id/settings"
  params={{ id: user.id }}
>
  Edit settings
</Link>
```

TypeScript knows that `/users/$id/settings` requires a `params` object with an `id` field. If you omit it, the code won't compile.

Here's a real example from Plakar — a link to a source connector's detail page:

```tsx
<Link
  to="/sources/$id"
  params={{ id: connector.id }}
  className="font-medium hover:underline"
>
  {connector.name}
</Link>
```

And a programmatic navigation with search params:

```tsx
const navigate = Route.useNavigate();

navigate({
  search: (prev) => ({
    ...prev,
    page: 0,
    per_page: 50,
  }),
});
```

## Data Loading with Loaders

One common pattern in SPAs is the "loading spinner inside the component" approach: the component renders, immediately sees it has no data, shows a spinner, fires a fetch, and re-renders when the data arrives. This works, but it leads to cascading loading states and a choppy experience.

TanStack Router's solution is route loaders — functions that run *before* the component renders. When you navigate to a route, the router calls the loader, waits for it to complete (or at least start prefetching), and only then renders the component. The component can assume data is available.

In practice, we integrate this with TanStack Query:

```tsx
// src/routes/_layout/users.$id.tsx
export const Route = createFileRoute("/_layout/users/$id")({
  loader: async ({ context: { queryClient }, params: { id } }) => {
    // Prefetch the user data. The component will use the cached result.
    await queryClient.ensureQueryData(getUserQueryOptions(id));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  // By the time this runs, the data is already in the query cache.
  const { data } = useSuspenseQuery(getUserQueryOptions(id));

  return (
    <div>
      <h1>{data.name}</h1>
    </div>
  );
}
```

The loader prefetches data into the TanStack Query cache. When the component mounts and calls `useSuspenseQuery`, the data is already there — no spinner. This is a much better user experience and it keeps the component clean.

## Search Params Validation

We mentioned this in the table article, but it's worth calling out explicitly. TanStack Router validates search params using Zod. This means:

- `?page=abc` won't silently become `NaN` — the Zod schema catches it and falls back to the default
- `?provider=unknown_type` won't pass validation if your schema restricts the values
- Every component that reads search params has the correct TypeScript types — no casting

Here's the search param schema from the inventories route:

```tsx
validateSearch: zodValidator(
  z.object({
    page: z.coerce.number().nonnegative().catch(0).default(0),
    per_page: z.coerce
      .number()
      .nonnegative()
      .catch(50)
      .default(50)
      .transform((n) => (n > 500 ? 500 : n)),
    search: z.string().catch("").default(""),
    provider: z.enum(InventoryTypes).optional().catch(undefined),
  })
),
```

`z.coerce.number()` converts the string `"42"` to the number `42`. `.catch(0)` means if the coercion fails (because the user typed `?page=abc`), fall back to `0` silently. `.transform((n) => (n > 500 ? 500 : n))` caps the page size at 500 to protect against absurd API requests.

`Route.useSearch()` returns an object typed according to this schema. The rest of the component just reads `page` as a number and `provider` as `InventoryTypes | undefined`.

## Error Handling

Routes can define an `errorComponent` — a component that renders if anything in the route's loader or component throws an error. This is the React equivalent of Go's `defer recover()`, but more structured.

Here's the pattern we use for authentication errors. In Plakar, if the API returns HTTP 401 Unauthorized, our API client throws an `APIResponseUnauthorizedError`. Rather than catching this in every component, we handle it once at the route level:

```tsx
// src/routes/__root.tsx
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async ({ context: { queryClient }, matches }) => {
    try {
      await queryClient.ensureQueryData(getApiInfoQueryOptions());
    } catch (error) {
      if (error instanceof APIResponseUnauthorizedError) {
        // Don't throw — let the route render normally.
        // The login redirect is handled by the error component.
        return;
      }
      throw error;
    }
  },
  component: Component,
});
```

And for a route that should redirect to login on unauthorized access:

```tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    try {
      await queryClient.ensureQueryData(getMeQueryOptions());
    } catch (error) {
      if (error instanceof APIResponseUnauthorizedError) {
        throw redirect({
          to: "/login",
          search: {
            redirect: location.pathname,
          },
        });
      }
      throw error;
    }
  },
  component: LayoutComponent,
});
```

When any API call under the `/_layout` route throws `APIResponseUnauthorizedError`, this `beforeLoad` catches it and redirects to `/login` with the current path as the `redirect` param. After a successful login, the user lands back where they were.

This is declared once. Every route nested under `/_layout` inherits this behavior automatically. You don't scatter `if (error instanceof APIResponseUnauthorizedError)` checks across every component.

For other types of errors — network failures, unexpected API shapes, server errors — you can define an `errorComponent` on specific routes:

```tsx
export const Route = createFileRoute("/_layout/users/$id")({
  loader: async ({ context: { queryClient }, params }) => {
    await queryClient.ensureQueryData(getUserQueryOptions(params.id));
  },
  errorComponent: ({ error }) => {
    if (error instanceof APIResponseNotFoundError) {
      return (
        <div className="flex flex-col items-center gap-4 py-16">
          <h2 className="text-lg font-medium">User not found</h2>
          <Link to="/users">Back to users</Link>
        </div>
      );
    }
    // Re-throw anything else to propagate up the error boundary chain
    throw error;
  },
  component: RouteComponent,
});
```

The error boundary pattern means your component code stays clean. It only handles the happy path. Errors are handled declaratively at the route level.

## Conclusion

A router is non-negotiable in an SPA — without one, the fundamental contract of the web (URLs identify pages, the back button works, links can be shared) breaks down.

We chose TanStack Router because it takes the same approach to routing that TanStack Query takes to data fetching and TanStack Form takes to forms: full type safety, with the compiler catching mistakes rather than users. Rename a route and you get a compile error. Reference a search param by the wrong name and you get a compile error. Pass the wrong type for a URL parameter and you get a compile error.

It might seem like a minor quality-of-life improvement, but over the lifecycle of a growing application, it's the difference between confidently refactoring the routing structure and nervously hoping you caught every reference. That confidence compounds. It makes us faster, and it makes our users see fewer broken experiences.

Every piece of the TanStack ecosystem we've covered in this series — Query, Form, Table, Router — is built on the same principle: make the invisible things safe, so you can focus on the visible ones. -->

