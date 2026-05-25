---
title: "Plakar UI #7: React Aria Components"
summary: "Why we use React Aria Components as the foundation for our UI library — and why building accessible, keyboard-navigable widgets from scratch is much harder than it looks."
slug: "plakar-ui-react-aria-components"
date: 2026-05-25T06:00:00+0000
authors:
  - "jcastets"
tags:
  - react-aria
  - accessibility
  - frontend
  - plakar-ui
category: "technology"
series: ["Plakar UI Explained to My Backend Colleagues"]
series_order: 7
---

When you think about a UI component library, you probably picture something visual: buttons, dropdowns, date pickers. What you might not immediately think about is everything that has to work *beneath* the visual surface for those components to be usable by everyone — keyboard navigation, screen reader announcements, focus management, ARIA attributes. This is a massive, thankless amount of work that most developers never think about until an accessibility audit lands on their desk.

Let me explain how we got to React Aria Components, and why it's one of the best decisions we made.

## Why Plain HTML Inputs Fall Short

A `<button>` and a `<select>` in plain HTML come with some accessibility baked in. But the moment you build anything slightly more complex — a combobox with filtering, a multi-select with tags, a date range picker — you're on your own.

Take a custom dropdown: it's usually a `<div>` with a click handler that toggles some list. Looks fine on screen. But:

- Keyboard users can't open it with `Enter` or `Space`
- There's no way to navigate the options with arrow keys
- Screen readers don't know it's a listbox — they'll just read out a bunch of divs
- The focus management is wrong: when the dropdown closes, focus doesn't return to the trigger
- On mobile, there's no native touch handling for the popup

Fixing all of this from scratch, correctly, for every component type, is a months-long project. And it's not glamorous work — there's no visible result, and you'll always miss edge cases.

## Styled Libraries: Accessible but Rigid

Libraries like Material UI (MUI) or Ant Design solve the accessibility problem. Their components are well-tested and handle all the keyboard and ARIA concerns. But they bring their own design system. You get MUI components that look and feel like MUI, and deviating from that requires fighting the library's opinionated CSS.

For a product that has its own visual identity, this is a non-starter. We don't want to ship an app that looks like every other MUI app on the internet.

## Unstyled Libraries: The Best of Both Worlds

The insight behind unstyled component libraries is simple: separate the accessibility logic from the visual design. You get all the keyboard navigation, focus management, ARIA attributes, and screen reader support — but you style everything yourself.

The first version of Plakar UI was built on [Headless UI](https://headlessui.com/), which was an early, popular option in this space. It worked well for what it provided, but the component set was limited. There was no date picker, no combobox with filtering, a fairly basic select, and a handful of other primitives. For anything beyond the basics, you were back to building from scratch.

## Enter React Aria Components

[React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html) is Adobe's take on unstyled accessible components. It's part of the React Spectrum family, which powers Adobe's own products. The library is extraordinarily thorough.

The component catalog covers everything you'd expect: Button, Checkbox, ComboBox, DatePicker, DateRangePicker, Dialog, ListBox, Menu, NumberField, Popover, RadioGroup, RangeCalendar, SearchField, Select, Slider, Switch, Table, Tabs, TagGroup, TextField, ToggleButton, Tooltip — and more. Every single one handles keyboard navigation, screen readers, and mobile touch correctly, across all major browsers and assistive technologies.

The learning curve is real. React Aria Components doesn't give you a single monolithic `<Select />` with twenty props. Instead, it gives you building blocks: `Select`, `SelectValue`, `ListBox`, `ListBoxItem`, `Popover`, `Button`. You compose them yourself. This feels verbose at first, but it's also what makes the library so flexible.

## A Concrete Example: Multi-Select with Search

Let's look at how we build a multi-select component — one that lets users pick multiple options from a searchable dropdown list. This is the kind of component that would take days to build correctly from scratch.

With React Aria, you compose it from primitives:

```tsx
import {
  Autocomplete,
  ListBox,
  Popover,
  Select,
  SelectValue,
  SearchField,
} from "react-aria-components";
import clsx from "clsx";

type Option = {
  id: string;
  name: string;
};

type MultiSelectProps = {
  label?: string;
  options: Option[];
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
};

export function MultiSelect({
  label,
  options,
  selectedKeys,
  onSelectionChange,
}: MultiSelectProps) {
  return (
    <Select
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      className="group flex flex-col gap-1"
    >
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* The trigger button */}
      <div className="flex items-center justify-between rounded-lg border border-gray-300 px-3 py-2 group-data-open:border-blue-500">
        <SelectValue<Option>>
          {({ selectedItems }) => (
            <div className="flex flex-wrap gap-1">
              {selectedItems.length === 0 ? (
                <span className="text-sm text-gray-400">Select options...</span>
              ) : (
                selectedItems.map((item) => (
                  <span
                    key={item.id}
                    className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
                  >
                    {item.name}
                  </span>
                ))
              )}
            </div>
          )}
        </SelectValue>
        <span aria-hidden="true" className="text-gray-400">▼</span>
      </div>

      {/* The dropdown */}
      <Popover
        offset={4}
        className="flex max-h-72 w-[var(--trigger-width)] flex-col rounded-lg border border-gray-200 bg-white shadow-lg"
      >
        <Autocomplete>
          <SearchField aria-label="Search options" autoFocus className="group">
            <input
              placeholder="Search..."
              className="w-full border-b border-gray-100 px-3 py-2 text-sm outline-none"
            />
          </SearchField>

          <ListBox
            items={options}
            className="flex flex-col gap-0.5 overflow-auto p-1 outline-none"
          >
            {(option) => (
              <ListBoxItem
                id={option.id}
                textValue={option.name}
                className={clsx(
                  "cursor-pointer rounded px-2 py-1.5 text-sm outline-none",
                  "data-focused:bg-gray-100",
                  "data-selected:bg-blue-50 data-selected:text-blue-700",
                  "data-focused:data-selected:bg-blue-100"
                )}
              >
                {option.name}
              </ListBoxItem>
            )}
          </ListBox>
        </Autocomplete>
      </Popover>
    </Select>
  );
}
```

There's quite a bit going on here, but each piece has a clear responsibility:

- `Select` — manages the overall selection state, keyboard interactions, and ARIA roles
- `SelectValue` — renders the current selection (we render tags here)
- `Popover` — handles the positioning, animation, and dismissal of the dropdown
- `Autocomplete` — wraps the search field and list box to connect filtering behavior
- `SearchField` — provides a keyboard-accessible search input
- `ListBox` — the actual list of options with proper ARIA roles
- `ListBoxItem` — each option, with keyboard focus and selection state management

You didn't write any of that interaction logic. You didn't manage focus, you didn't wire up arrow key navigation, you didn't add `role="listbox"` and `aria-selected` manually. React Aria did all of it.

### Tailwind State Variants

React Aria applies `data-*` attributes to elements based on their state — `data-focused`, `data-selected`, `data-disabled`, `data-hovered`, `data-pressed`, and so on. Tailwind's arbitrary variant syntax lets you target these directly:

```tsx
<ListBoxItem
  className={clsx(
    "rounded px-2 py-1.5 text-sm",
    // Applied when the item has keyboard focus
    "data-focused:bg-gray-100",
    // Applied when the item is selected
    "data-selected:bg-blue-50 data-selected:font-medium",
    // Applied when focused AND selected simultaneously
    "data-focused:data-selected:bg-blue-100",
    // Applied when the item is disabled
    "data-disabled:cursor-not-allowed data-disabled:opacity-50"
  )}
>
  {option.name}
</ListBoxItem>
```

This means your hover and focus styles are driven by React Aria's state machine rather than CSS pseudo-classes, which gives you more accurate behavior (especially important for keyboard navigation, where `:hover` wouldn't apply at all). The component knows whether it has keyboard focus; a CSS `:focus` pseudo-class often doesn't.

## What You Get for Free

Out of every React Aria component, you get this without writing a line of interaction code:

**Keyboard navigation:** Arrow keys move focus through options, `Enter` and `Space` select, `Escape` closes overlays, `Tab` moves between interactive elements in the correct order.

**Screen reader support:** Every component has the correct ARIA roles and live announcements. When you select an item in a multi-select, a screen reader announces it. When a dialog opens, focus moves to it and the page behind is marked as inert.

**Mobile/touch support:** Popovers and overlays work correctly on touch devices. Long press on mobile triggers the correct behavior.

**RTL layout:** Right-to-left text directions work correctly, including flipped arrow key directions.

**High contrast mode:** Components respond correctly to Windows high contrast mode and forced colors.

This is the kind of thing that Adobe, with teams of engineers dedicated to accessibility, has been refining for years across their own products. We get it for free.

## The Composability Payoff

The verbose composable API pays off when you need to deviate from a standard pattern. Want to add a "Select all" button at the top of your list? Add a `Button` above the `ListBox`. Want to group options under headers? Use `ListBoxSection` and `Header` inside `ListBox`. Want a loading spinner instead of options while fetching? Replace the `ListBox` children with a spinner. React Aria doesn't lock you into a specific structure — you assemble the pieces you need.

Compare this to a traditional component library where you'd be passing `showSelectAll={true}` as a prop and hoping the library supports exactly the variant you need. With React Aria, you compose it.

This is the same philosophy as TanStack Form's field components or TanStack Table's headless approach: the library handles the hard invisible stuff, and you retain full control over the rendering.
