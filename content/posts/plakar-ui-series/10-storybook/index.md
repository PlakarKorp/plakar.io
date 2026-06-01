---
title: "Plakar UI #10: Storybook"
summary: "How we use Storybook to develop, document, and visually test our UI component library in isolation, independent of application logic."
slug: "plakar-ui-storybook"
date: 2026-05-25T03:00:00+0000
authors:
  - "jcastets"
tags:
  - storybook
  - frontend
  - plakar-ui
category: "technology"
series: ["The Plakar Frontend, Explained"]
series_order: 10
---

In progress. Check back soon for the full article!

<!-- So far in this series we've talked about React, TypeScript, TanStack Query, forms, routing, and tables. The through-line in all of those articles was: here's how we build things. This article is about something slightly different — it's about how we work while building things.

Specifically, it's about how you develop a UI component without losing your mind.

## The problem: developing components inside routes

When you're working on a component that lives inside a route, you're never really working on _just_ that component.

Take a concrete example. Say I need to update the styling of a select dropdown that appears in a settings form. To see my changes, I need to:

1. Start the dev server
2. Log in
3. Navigate to the settings page
4. Make sure there's data in the right shape for the form to render
5. Open the form
6. Look at my dropdown

Six steps before I can see the thing I'm actually working on. And if I want to check the _disabled_ state of that dropdown, I now need to set up some condition that triggers the disabled state, which might mean tweaking the data, intercepting a prop, or adding a temporary `isDisabled={true}` somewhere I'll inevitably forget to remove.

It gets worse. When something looks wrong, the question is always: is it the component, or is it something else? Is this a styling bug in the dropdown itself, or is a parent component passing the wrong props? Is the loading state broken, or is the query just slow? When you're debugging a component that's nested inside a page that fetches data from a real API, you're dealing with too many moving parts to easily answer those questions.

And there's the state problem. A component typically has many states: normal, disabled, invalid, loading, empty, with a very long label, with a very short label. In the real application, you might only ever see the component in two or three of those states during normal navigation. The edge cases are theoretically possible but practically hard to reach without carefully constructed data or specific sequences of user interactions.

Before we used Storybook, the coping strategy was... not great. We'd sometimes write throw-away test files — a quick route or page whose only purpose was to render one component in isolation, with hardcoded props. You'd add it locally, poke at the component, delete the file when you were done. It was never committed because it was junk. It was never reused because the next person doing the same thing didn't know it had existed. It was annoying, and it scaled terribly.

## What Storybook is

Storybook is a development environment for UI components. You run it as a separate process alongside your main dev server, and it gives you a browser-based workbench where every component lives in its own isolated sandbox.

Each component has **stories** — discrete, named examples of the component in a specific state. A story says: "here is this component, with these exact props, showing this particular configuration." The Storybook UI shows a sidebar with all your components and their stories. You click through them. You see the component rendered cleanly, with no routing, no data fetching, no parent components, no application state. Just the component, exactly as you defined it.

There's also an interactive controls panel: for every prop, Storybook generates a UI control that lets you modify the value live. Change a string prop, toggle a boolean, pick from an enum — the component updates in real time. It's like having a live scratchpad for your props.

Storybook lives in `packages/ui/` — our pure presentational component library. Every component in that library has stories. It's how we develop new components, how we verify existing ones, and how new developers learn what's available and how to use each piece.

## How we write stories

A story file exports a default `meta` object and then one named export per story. The `meta` object describes the component and its default args. Each named export is a specific state.

Here is the story file for `Button`:

```tsx
// packages/ui/components/button/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, ButtonSizes } from "./button";

const meta = {
  title: "design-system/Button",
  tags: ["autodocs"],
  component: Button,
  argTypes: {
    variant: {
      control: false, // Hide "variant" (since we create one story for each variant)
      table: { disable: true }, // Remove from the args table
    },
    isDisabled: {
      control: { type: "boolean" },
      table: {
        type: { summary: "boolean" },
      },
    },
    size: {
      control: { type: "radio" },
      options: ButtonSizes,
    },
  },
  args: {
    onPress: fn(),
    isDisabled: false,
    size: "md",
    leftIcon: "bars",
    children: "Label",
    rightIcon: "bars",
    tooltip: "This is a button",
    isPending: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Tertiary: Story = { args: { variant: "tertiary" } };
export const Error: Story = { args: { variant: "error" } };
export const AccentTertiary: Story = { args: { variant: "accent-tertiary" } };
```

Each named export is a story. `Primary`, `Secondary`, `Tertiary`, `Error`, `AccentTertiary` — each shows the button in a specific variant with a single line of code. The `args` in `meta` are the shared default props (the things that don't change between variants), and each story overrides just the prop that makes it distinct.

`argTypes` is where you tell Storybook how to render the controls for each prop — whether to show a toggle, a radio button, a text input, a select. You can also hide props from the controls if they're covered by stories instead (that's what `control: false` on `variant` does: since there's a dedicated story for each variant, an interactive toggle for it would be redundant).

`fn()` from `storybook/test` is a spy function. When you click the button in Storybook, the `onPress` handler fires, and you can see the call logged in the actions panel.

The TypeScript types (`Meta<typeof Button>` and `StoryObj<typeof meta>`) mean that if the `Button` component's props change — a prop renamed, a type changed — the story file will fail to compile. The stories and the component stay in sync automatically.

## A more complex example: Select

Simple components can get away with passing different `args`. More complex components sometimes need a custom `render` function to set up the JSX structure that the component actually requires. The `Select` component is a good example of this:

```tsx
// packages/ui/components/select/select.stories.tsx
type StoryArgs = ComponentProps<typeof Select> & {
  selectOptions: string[];
};

const meta: Meta<StoryArgs> = {
  title: "design-system/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "Label",
    placeholder: "Select an animal",
    selectOptions: ["Chipmunk", "Kitten", "Puppy", "Rabbit", "Squirrel"],
    supportText: "Support text",
    className: "w-[200px]",
    isPending: false,
    isRequired: false,
  },
  render: ({ selectOptions, icon, variant, ...rest }) => (
    <div className="flex w-full items-center justify-center">
      <Select {...rest} variant={variant}>
        <Select.ListBox>
          {selectOptions.map((name) => (
            <Select.Item key={name} id={name} name={name} icon={icon} />
          ))}
        </Select.ListBox>
      </Select>
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {};
export const Disabled: Story = { args: { value: "Kitten", isDisabled: true } };
export const Invalid: Story = { args: { isInvalid: true } };
export const ReadOnly: Story = { args: { value: "Kitten", isReadOnly: true } };
export const Searchable: Story = { render: SearchablesSelect };
export const Pending: Story = { args: { isPending: true, selectOptions: [] } };
export const Terminal: Story = {
  args: { label: undefined, supportText: undefined, variant: "terminal" },
};
```

A couple of things worth noting here.

`StoryArgs` extends the component's actual props with a `selectOptions: string[]` field that doesn't exist on the real component — it's a convenience for the stories only, letting the Storybook controls panel manage the list of items without hard-coding them inside `render`. The `render` function then takes those `selectOptions` and builds the correct JSX.

The `Searchable` story uses a completely custom `render` function (`SearchablesSelect`) instead of overriding args. That function sets up the filter hook required by `Select.SearchableListBox`. There's no way to express that as a set of static props — it requires logic — so it gets its own render function.

Now think about what would be required to test these states in the real application. To see the `Disabled` state, you'd need a page that renders a pre-populated, disabled select. To see `Invalid`, you'd need to trigger a validation error. To see `Searchable`, you'd need to find a place in the app that actually uses the searchable variant. To see `Pending`, you'd need to catch the component mid-request, or mock the API. With Storybook, each of these is a single click in the sidebar.

## Storybook as documentation

The `tags: ["autodocs"]` field on the `meta` object tells Storybook to generate a documentation page automatically. That page is built from the TypeScript prop types of the component: it lists every prop, shows its type, shows a description (if you've written JSDoc on the prop), and renders a live interactive example.

When someone joins the team and needs to use the `Select` component, the workflow is:

1. Open Storybook
2. Find `Select` in the sidebar
3. See all variants rendered side by side
4. Read the props table
5. Copy the usage pattern from the story that matches their use case

Before Storybook, step 3 through 5 meant opening the component source file and reading the TypeScript types directly. That works, but it requires knowing which file to open, understanding the component internals well enough to interpret the types, and constructing a mental image of what each prop combination actually looks like. The docs page collapses all of that into a visual reference.

The critical advantage of Storybook as documentation is that it can't go stale. It's not a separate README or a wiki page that has to be manually updated every time a prop changes. The stories use the real component, so they always reflect what the component actually does. If a prop is removed, the story stops compiling. If a prop's type changes, the story is updated along with the component. The documentation and the implementation are in the same file.

## The cost

I won't pretend this is free. Stories take time to write. When you add a prop, you consider whether it needs a new story. When you rename a prop, you update the story file too. When you substantially redesign a component, the stories need rethinking.

The rule of thumb we've landed on: write at least one story per meaningful state. Not one story per prop permutation — that would be thousands of stories and pure noise. But one story per state that users or developers might care about: the happy path, the disabled state, the error state, the empty/loading/pending state, any unusual variant.

We've found the cost worth it for two reasons.

The first is the development workflow. Being able to develop a component in complete isolation, with full control over every prop, is genuinely faster than navigating the real app to find the right page, setting up the right data, and hoping the component renders in the state you need. The time saved during development more than compensates for the time spent writing stories.

The second is catching regressions. TypeScript catches type errors. Tests catch logic errors. But neither of them tells you that a button now looks wrong in its disabled state because you accidentally removed a CSS class, or that a select's dropdown is cut off because a parent container got `overflow: hidden` added. Storybook is visual. When you open it after making a change, you see every state of every component. Visual regressions are obvious in a way that they're not when you're only looking at the specific page you happen to be working on.

---

Next up: if you've made it this far in the series, you know what our components look like, how they're built, and how they're developed. The last piece of the puzzle is where these components come from — the design system and the decisions behind it. -->
