---
title: "Plakar UI #5: TanStack Query"
summary: "How TanStack Query handles all HTTP requests in Plakar UI — automatic caching, deduplication, background refetching, and cache invalidation after mutations."
slug: "plakar-ui-tanstack-query"
date: 2026-05-25T08:00:00+0000
authors:
  - "jcastets"
tags:
  - tanstack-query
  - react
  - plakar-ui
category: "technology"
series: ["Plakar UI Explained to My Backend Colleagues"]
series_order: 5
---

We need to talk about TanStack.

TanStack is a collection of open-source libraries built and maintained by the same team, all sharing the same philosophy: fully type-safe, framework-agnostic, and built for real production needs. We use TanStack Query, TanStack Router, TanStack Table, and TanStack Form throughout Plakar UI. If we had to score how much we enjoy working with TanStack on a scale of 0 to 100, the honest answer is over 9000.

In this article we'll focus on **TanStack Query**, the library that handles all our HTTP requests and server state. It's probably the most immediately impactful library in our stack, and the one whose value is easiest to explain.

## Plakar UI is fundamentally an API client

Before we dive in, it's worth stating the obvious: Plakar UI has no meaningful logic of its own. It doesn't store data, it doesn't process data, it doesn't make business decisions. It's a client for the Plakar API. Its entire purpose is to fetch data, display it, and send user actions back to the API.

This means HTTP requests are not an occasional concern — they're the core of what the application does. Every page loads some data. Every form submits it. Every table needs to be refreshed. How we manage these requests has a huge impact on the quality of the user experience and the reliability of the code.

## The naive approach: `fetch` directly

When a new frontend developer encounters this problem, the first instinct is to use `fetch` directly. The browser has `fetch` built in; it returns a promise; you `await` it. Simple.

```tsx
function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

This works for a demo. It falls apart in production. Let's walk through the failure modes one by one.

**No loading state.** The data isn't there instantly — there's a network round trip. During that time, your UI shows nothing, or shows stale data, or renders in a broken intermediate state. You need a `isLoading` boolean, but now you have to manage it manually: set it to `true` before the fetch, set it to `false` after. Don't forget the error case.

**No error handling.** What if the server returns a 500? What if the network is offline? The code above silently does nothing. You need a separate `error` state variable, and you need to remember to handle it everywhere.

**No caching.** Every time this component mounts — say, every time the user navigates to this page — it fires a new HTTP request. If the user clicks back and forth between pages, they're fetching the same data over and over again. For slow APIs or slow networks, this makes the UI feel sluggish.

**No automatic retry.** If a request fails due to a momentary network hiccup, `fetch` won't try again. The user sees an error and has to refresh the page. You could add retry logic yourself, but now you're writing infrastructure code instead of UI code.

**No refetch when the tab regains focus.** If a user leaves your app open in a background tab for 10 minutes and then comes back, the data they see might be 10 minutes stale. A good UI would automatically re-fetch in the background when the tab becomes active again. With raw `fetch`, you have to wire up `visibilitychange` event listeners yourself.

**Race conditions.** This one is subtle but nasty. Suppose the user types in a search box, triggering a fetch for each keystroke. Requests `A`, `B`, `C` go out in order. But `C` comes back before `B`. If you're not careful, `B`'s result will overwrite `C`'s, and the user sees results for their second-to-last keystroke instead of their most recent one. Handling this correctly with raw `fetch` requires abort controllers and careful state management.

**Duplicate requests.** If two components on the same page both need the same data — say, a header showing the current user and a sidebar also showing the current user — each will fire its own request. You've made two identical HTTP calls when one would do.

Each of these problems is solvable individually. But solving all of them, correctly, in every place in your application where you fetch data? That's what TanStack Query does for you, out of the box.

## How TanStack Query works

The core concept in TanStack Query is the **query key**. Every piece of server state is identified by a key, which is an array of values. The simplest example:

```tsx
import { useQuery } from "@tanstack/react-query";

function UsersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <ul>{data.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

`useQuery` takes a `queryKey` and a `queryFn`. The `queryFn` is the function that actually fetches the data. TanStack Query calls it when needed, caches the result under the key `["users"]`, and returns the current state of the query (`data`, `isLoading`, `error`).

**Deduplication is automatic.** If 10 components on the same page call `useQuery({ queryKey: ["users"], ... })`, TanStack Query fires exactly one HTTP request and distributes the result to all 10 components.

**Caching is automatic.** Once the data is fetched, it stays in the cache. If the user navigates away and comes back, TanStack Query serves the cached data immediately while re-fetching in the background to check for updates. The UI is responsive while still staying fresh.

Keys can be parameterized, which is how you handle dynamic data:

```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
  });
  // ...
}
```

The query for user `"abc123"` is cached separately from the query for user `"def456"`. If you navigate between two users' profiles, TanStack Query manages a separate cache entry for each.

## Mutations and cache invalidation

Fetching data is one half of the problem. The other half is sending changes back to the API — creating, updating, or deleting data. TanStack Query handles this with `useMutation`.

The interesting part isn't the mutation itself; it's what happens to the cache afterward. When you add a user, the cached list of users is now stale. You want TanStack Query to re-fetch the list so the UI reflects the new state. This is called **cache invalidation**.

Here's a complete example with a users list and an "add user" form:

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function UsersPage() {
  const queryClient = useQueryClient();

  // Fetch the list of users
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
  });

  // Mutation to add a new user
  const addUserMutation = useMutation({
    mutationFn: (newUser: { name: string; email: string }) =>
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      }).then((res) => res.json()),

    onSuccess: () => {
      // Invalidate the users list so it re-fetches
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>

      <button
        onClick={() =>
          addUserMutation.mutate({ name: "Alice", email: "alice@example.com" })
        }
        disabled={addUserMutation.isPending}
      >
        {addUserMutation.isPending ? "Adding..." : "Add User"}
      </button>
    </div>
  );
}
```

When `addUserMutation.mutate(...)` is called:

1. TanStack Query calls the `mutationFn`, which sends the POST request.
2. While the request is in flight, `addUserMutation.isPending` is `true`, so the button shows "Adding..." and is disabled (preventing double-submits).
3. When the request succeeds, `onSuccess` is called. We call `queryClient.invalidateQueries({ queryKey: ["users"] })`.
4. This marks the `["users"]` cache entry as stale.
5. TanStack Query immediately re-fetches the users list.
6. The users list component re-renders with the updated data, including the new user.

This pattern — mutate, then invalidate — is the backbone of how Plakar UI handles all write operations. It keeps the UI in sync with the server without you having to manually manage the relationship between mutations and the data they affect.

You can also invalidate multiple queries at once. `invalidateQueries({ queryKey: ["users"] })` will actually invalidate all queries whose key _starts with_ `["users"]` — so both `["users"]` (the list) and `["users", "abc123"]` (a specific user profile) would be invalidated.

## What you get for free

Beyond the basics, TanStack Query ships a lot of behaviors that would take serious effort to implement correctly yourself:

**Automatic retry.** If a request fails due to a network error, TanStack Query retries it automatically with exponential backoff. We configure it to not retry on 4xx errors (since a 404 or 403 is not a transient error), but network failures are handled without any code from us.

**Refetch on window focus.** When a user switches back to a tab after being away, TanStack Query checks if any cached data is stale and re-fetches it in the background. The user sees the current data without having to manually refresh.

**Background refetching.** When serving data from cache while re-fetching, TanStack Query doesn't show a loading spinner — it keeps displaying the old data while the new data loads, then updates the UI. No flash of blank content.

**Stale time.** You can configure how long data is considered "fresh" before TanStack Query considers it stale and eligible for re-fetching. We set a default `staleTime` of 5 seconds across our entire application. This means that if a component mounts and the data was already fetched less than 5 seconds ago, TanStack Query serves the cache without making a new request. This significantly reduces the number of requests on pages with multiple components fetching overlapping data.

```tsx
// In our main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000, // 5 seconds
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
```

**TanStack Query Devtools.** In development mode, you can enable the TanStack Query Devtools panel, which shows you every query in the cache, its current state (fresh, stale, fetching, error), and lets you manually invalidate queries. This is invaluable for debugging.

## What this means for us

Every HTTP request in Plakar UI goes through TanStack Query. The caching, the deduplication, the automatic retries, the background refetching — these are not nice-to-haves. They're the difference between an application that feels polished and one that feels flaky.

---

That's TanStack Query. In future articles in this series, we'll cover TanStack Form (handling forms and validation), TanStack Table (sortable, filterable, paginated data tables), and TanStack Router (type-safe routing that catches broken links at compile time). The theme is consistent: let the library solve the hard general problem so we can focus on what's specific to Plakar.
