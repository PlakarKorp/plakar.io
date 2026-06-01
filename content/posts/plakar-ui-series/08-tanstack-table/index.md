---
title: "Plakar UI #8: TanStack Table"
summary: "How TanStack Table gives us a headless, fully type-safe data grid — with sorting, filtering, and pagination — without dictating how anything looks."
slug: "plakar-ui-tanstack-table"
date: 2026-05-25T05:00:00+0000
authors:
  - "jcastets"
tags:
  - tanstack-table
  - react
  - plakar-ui
category: "technology"
series: ["The Plakar Frontend, Explained"]
series_order: 8
---

In progress. Check back soon for the full article!

<!-- When a backend developer needs to display a list of things in a UI, the first instinct is reasonable: "I'll use an HTML `<table>`." And honestly? It works. For a read-only display of twenty rows, a plain `<table>` with a couple of `<tr>` and `<td>` elements is perfectly fine.

The problems start when the requirements grow. And in our experience, the requirements always grow.

First you need filtering. Then pagination, because there are ten thousand rows and you're not rendering all of them at once. Then sorting — the product manager wants to be able to click a column header. Then a search box. Then someone asks if columns can be reordered, or resized. Then the design calls for a sticky header that stays visible while scrolling. Then expandable rows for nested data. Then row selection with a "delete selected" bulk action. Then — and this is when most handmade table implementations collapse — virtual scrolling, because you need to render only the visible rows for performance with large datasets.

You could implement all of this yourself. It would take weeks, and the result would be a custom table library that only your team understands, with edge cases you discover in production.

Or you could use TanStack Table.

## What TanStack Table Is

TanStack Table is a headless table library. That second word matters: *headless* means it provides the logic, the state management, and the column/row model — but absolutely nothing about how the table looks. You write all the HTML and all the CSS yourself. This gives you complete control over the visual result, and it means TanStack Table integrates cleanly with any design system.

You own the `<table>`, the `<thead>`, the `<tr>`, the `<td>`. TanStack Table tells you what to put in them.

Like everything else in the TanStack family, it is fully type-safe. The column definitions know the shape of your data. The cell render functions get the correct row type inferred automatically.

## Building a Basic Table

Let's start with the simplest case: a table of users with three columns — ID, name, and email.

First, define your data type and create a column helper:

```tsx
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

type User = {
  id: string;
  name: string;
  email: string;
};

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <span className="font-mono text-xs text-gray-500">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => (
      <span className="font-medium text-gray-900">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => (
      <a href={`mailto:${info.getValue()}`} className="text-blue-600 hover:underline">
        {info.getValue()}
      </a>
    ),
  }),
];
```

Notice `columnHelper.accessor("name", ...)` — the `"name"` string is typed against the `User` type. If you try `columnHelper.accessor("username", ...)`, TypeScript will reject it because `User` has no `username` field.

Now create the table instance and render it:

```tsx
function UsersTable({ users }: { users: User[] }) {
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b border-gray-200">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-4 py-3 text-left font-medium text-gray-500"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-gray-100 hover:bg-gray-50"
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-4 py-3">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

The rendering loop iterates over `table.getHeaderGroups()` for the header, and `table.getRowModel().rows` for the body. You write the `<table>` structure; TanStack Table provides the data and metadata.

`flexRender` is a helper that calls either a JSX component or a plain function, depending on how you defined your columns. It's how TanStack Table bridges the column definition to actual rendered output.

This is about as much boilerplate as a hand-rolled table — but now you have a foundation that scales.

## Adding Pagination

The table above loads all data at once and renders everything. With a hundred rows that's fine; with ten thousand it's not. Pagination solves this, either on the client (TanStack Table slices the data) or on the server (you fetch the right page from the API).

In Plakar we use server-side pagination, because our data sets can be very large. Here's how it works:

```tsx
function UsersTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  // Fetch only the current page from the API
  const query = useQuery(
    listUsersQueryOptions({
      page: pagination.pageIndex,
      perPage: pagination.pageSize,
    })
  );

  const table = useReactTable({
    data: query.data?.items ?? [],
    rowCount: query.data?.total, // total number of rows across all pages
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,   // tell TanStack Table we handle pagination ourselves
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <table className="w-full border-collapse text-sm">
        {/* ...same header and body rendering as before */}
      </table>

      {/* Page controls */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
```

The key setting is `manualPagination: true`. This tells TanStack Table: "I'm fetching exactly the rows for the current page — don't try to slice the data array yourself." You pass `rowCount` (the total count from your API response) so TanStack Table can compute the total number of pages and tell you whether `getCanNextPage()` should return true.

When the user clicks "Next", `onPaginationChange` fires, the `pagination` state updates, the query re-runs with the new page parameters, and the table re-renders with the new rows. Clean, three-way binding between the URL/state, the query, and the table.

## Adding Column Filtering

Client-side filtering is almost embarrassingly easy:

```tsx
import { getFilteredRowModel } from "@tanstack/react-table";

const table = useReactTable({
  data: users,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // add this
});
```

Now each column can have a filter value. Add a filter input above or below the header:

```tsx
// In your table header rendering loop:
{headerGroup.headers.map((header) => (
  <th key={header.id} className="px-4 py-3">
    <div className="flex flex-col gap-1">
      <span className="text-left font-medium text-gray-500">
        {flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      {header.column.getCanFilter() && (
        <input
          value={(header.column.getFilterValue() as string) ?? ""}
          onChange={(e) => header.column.setFilterValue(e.target.value)}
          placeholder="Filter..."
          className="rounded border border-gray-200 px-2 py-0.5 text-xs font-normal"
        />
      )}
    </div>
  </th>
))}
```

`header.column.setFilterValue(value)` updates the filter for that column, `getFilteredRowModel` recomputes the visible rows, and the table re-renders. That's it. The filter input and the table are automatically in sync.

For server-side filtering (which is what we do in Plakar), you'd follow the same pattern as pagination: set `manualFiltering: true`, store the filter values in state, pass them to the API query, and let TanStack Query handle refetching when they change.

## Sorting

Sorting follows the exact same pattern. One line to enable it:

```tsx
import { getSortedRowModel } from "@tanstack/react-table";

const table = useReactTable({
  data: users,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});
```

Then make the column headers clickable:

```tsx
<th
  key={header.id}
  onClick={header.column.getToggleSortingHandler()}
  className={clsx(
    "cursor-pointer px-4 py-3 text-left",
    header.column.getCanSort() && "select-none"
  )}
>
  <span className="flex items-center gap-1">
    {flexRender(header.column.columnDef.header, header.getContext())}
    {{
      asc: " ↑",
      desc: " ↓",
    }[header.column.getIsSorted() as string] ?? null}
  </span>
</th>
```

Click a header: it sorts ascending. Click again: descending. Click again: unsorted. The visual indicator updates automatically through `header.column.getIsSorted()`. You wrote no sorting algorithm — TanStack Table handled it.

## A Real Example from Plakar

Here's a simplified version of the inventories table we use in the Plakar Control Plane, showing how everything comes together with server-side pagination:

```tsx
// apps/plakman/src/routes/_layout/inventories.index.tsx
export const Route = createFileRoute("/_layout/inventories/")({
  validateSearch: zodValidator(
    z.object({
      page: z.coerce.number().nonnegative().catch(0).default(0),
      per_page: z.coerce.number().nonnegative().catch(50).default(50),
      search: z.string().catch("").default(""),
    })
  ),
  loader: async ({ context, deps }) => {
    context.queryClient.prefetchQuery(
      listInventoriesQueryOptions({ page: deps.page, perPage: deps.per_page })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { page, per_page, search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const query = useQuery(
    listInventoriesQueryOptions({ page, perPage: per_page, search })
  );

  const columns = useMemo(() => getInventoryColumns(search), [search]);

  const table = useReactTable({
    data: query.data?.items ?? [],
    rowCount: query.data?.total,
    columns,
    state: {
      pagination: { pageIndex: page, pageSize: per_page },
    },
    getRowId: (row) => row.id,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const state =
        typeof updater === "function"
          ? updater({ pageIndex: page, pageSize: per_page })
          : updater;
      navigate({
        search: (prev) => ({
          ...prev,
          page: prev.per_page !== state.pageSize ? 0 : state.pageIndex,
          per_page: state.pageSize,
        }),
      });
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return <PaginatedTable table={table} query={query} ariaLabel="Inventories" />;
}
```

Note how the pagination state is stored in the URL search params (via TanStack Router, which we'll cover in the next article). This means that if you share the URL with someone, they land on the same page with the same filters. Refreshing the page preserves your position. The browser back button works. This is the correct behavior, and it falls naturally out of combining TanStack Router, TanStack Query, and TanStack Table.

## What Else Is There

We've covered the basics — pagination, filtering, sorting. TanStack Table supports much more without requiring a different approach:

**Row selection** — pass `enableRowSelection: true` and a `rowSelection` state, and each row gets a checkbox. `table.getSelectedRowModel()` gives you the selected rows for bulk operations.

**Expandable rows** — define a `getSubRows` function, and nested data becomes automatically hierarchical with expand/collapse controls.

**Column resizing** — `enableColumnResizing: true` and a few event handlers let users drag column borders.

**Column visibility** — toggle columns on or off dynamically. Useful for letting users customize their view.

**Virtual scrolling** — combine TanStack Table with TanStack Virtual (another library from the same team) to render only the visible rows for datasets with hundreds of thousands of entries.

**Pinned columns** — columns that stay in place when scrolling horizontally.

The point isn't to use all of these features on every table. It's that when the requirement arrives — and it will — you don't need to swap libraries or rebuild from scratch. You enable one flag and add a few lines of rendering code.

## Conclusion

A plain `<table>` is a perfectly valid starting point. But the moment your table needs to do more than display static data, you're building infrastructure. TanStack Table is that infrastructure: thoughtfully designed, headless, type-safe, and composable with the rest of the TanStack ecosystem.

The headless design means our tables look exactly like the rest of the Plakar UI — same typography, same border radius, same hover states — because we write the HTML. TanStack Table gives us the logic, and we bring the design.

We've never hit a table requirement that made us wish we'd used a different library. -->
