---
title: "Plakar UI #2: React"
summary: "Why React exists and what problems it actually solves — explained to backend developers who know Go and are curious about how modern frontend UIs are built."
slug: "plakar-ui-react"
date: 2026-05-25T11:00:00+0000
authors:
  - "jcastets"
tags:
  - react
  - frontend
  - plakar-ui
category: "technology"
series: ["Plakar UI Explained to My Backend Colleagues"]
series_order: 2
---

The goal of this article is not to give you a complete React tutorial — there are thousands of those on the internet. The goal is to explain, to a developer who knows Go and has a basic understanding of HTML and CSS, _why_ React exists and what problems it actually solves. Because once you understand the problems, the solution feels obvious.

## In the beginning, there was HTML and CSS

When I started building my first websites in the early 2000s, the model was simple: the backend generates an HTML page, the browser renders it, done. If you needed interactivity, you sprinkled a bit of JavaScript on top.

The prevailing wisdom at the time was **separation of concerns**: put your HTML in one file, your CSS in another. The HTML is the structure and content, the CSS is the presentation. Change the look of your site? Just edit the CSS, and since it's shared across all pages, every page updates at once. Elegant in theory.

In practice, it was a mess.

## The separation of concerns myth

CSS and HTML are not actually separated, even when they're in different files. They're intimately coupled through selectors. Your CSS rule `.container .header h2 { font-size: 1.5rem; }` depends entirely on your HTML having a specific structure. Change `h2` to `h3`, move the heading outside of `.header`, rename `.container` to `.wrapper` — any of these breaks your CSS silently. You don't get an error; the styles just stop applying.

This is not separation of concerns. It's just the _illusion_ of separation.

## The naming problem

HTML is structured, but CSS is flat. You have one global namespace for all your class names, across your entire application. This leads to a very common failure mode: increasingly long, descriptive class names.

Say you have an alert box with a title and an icon in the title. You might start with:

```css
.alert { ... }
.alert-title { ... }
.alert-title-icon { ... }
```

Fine. But then you add a "small" variant of the icon. And then someone else adds a "secondary" alert. And then there's a "dismissible" alert. A few months later you're staring at class names like `.alert-secondary-title-icon-small-inline` and you have no idea what page they belong to, what they look like, or whether removing them would break anything. The only way to find out is to grep across your entire codebase.

## The shared CSS problem

Because CSS is global, every style rule you write potentially affects every page in your application. This makes even minor changes risky.

Suppose you have a `.button` class used on dozens of pages. You need to change the border radius on the checkout button. Do you add a more specific rule that only applies on checkout? Do you add a `.button-checkout` variant? Do you change the base `.button` and accept that every button everywhere will now look slightly different?

All of these options have downsides, and they all require you to hold the entire application in your head while making a two-line change. As a project grows, this becomes the main source of bugs and the main reason teams are afraid to touch the CSS.

## The component problem

The hardest problem with the HTML + CSS model is reusability. Let's say you've built a beautiful "user card" component: it's a div with a particular layout, a class, some font styles, and a hover effect. You want to reuse it in three different places in your application.

How do you do that? You copy the HTML. Now you have three copies of the same HTML structure. When you need to change the user card — say, add a verified badge — you have to remember to change all three copies. You might remember two and forget the third. The shared CSS helps a little: if you change `.user-card`, all three update. But the HTML structure still has to be manually kept in sync.

This is a "component" in name only. It doesn't truly exist as a unit you can work with independently. It's just a shared CSS class and a convention.

## What React does differently

React is built on a simple but radical idea: **the component is the unit of composition**. A component is a function that returns a description of what the UI should look like. It owns its own structure _and_ its own styles, bundled together.

Here's the Alert component from our `packages/ui` library:

```jsx
function Alert({ title, message }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <h4 className="font-bold">{title}</h4>
      <p className="text-red-700">{message}</p>
    </div>
  );
}
```

A few things to notice:

**The HTML and the styles live together.** We're using Tailwind CSS, which provides utility classes (`bg-red-100`, `font-bold`, `rounded`, etc.) that map directly to CSS properties. The styling is declared right where the element is, not in a separate file that might get out of sync.

**There are no class naming problems.** We don't need to invent class names at all. `bg-red-100` means "red background at shade 100". There's no ambiguity, no global namespace collision, no guessing.

**If we change the style of this component, we change it in exactly one place.** Change `text-red-700` to `text-red-500`? It only affects `Alert`. Every page that uses `Alert` gets the update, and no page that doesn't use `Alert` is affected. This is real isolation, not the illusion of it.

The syntax — HTML-ish tags mixed with JavaScript — is called **JSX**. It might look odd at first, but it's just JavaScript under the hood. React compiles JSX down to function calls.

## Props: making components configurable

Components would be useless if they were completely static. You need to pass data into them. In React, you do this with **props** — short for properties.

The `{ title, message }` in the function signature above are props. When you use the `Alert` component, you pass the values:

```jsx
function App() {
  return (
    <div>
      <Alert title="Error" message="Something went wrong" />
      <Alert title="Warning" message="Your session will expire soon" />
    </div>
  );
}
```

This is just a function call. `<Alert title="Error" message="Something went wrong" />` compiles to something like `Alert({ title: "Error", message: "Something went wrong" })`. If you're a Go developer, think of props like a struct being passed to a function.

You can pass any JavaScript value as a prop: strings, numbers, arrays, objects, other components, even functions. This last one is particularly powerful — passing a function as a prop is how you handle events like button clicks.

## Composition: components all the way down

Components can use other components. This is called composition, and it's how you build complex UIs from simple pieces.

```jsx
function AlertWithIcon({ title, message, icon }) {
  return (
    <Alert
      title={
        <span className="flex items-center gap-2">
          <Icon name={icon} />
          {title}
        </span>
      }
      message={message}
    />
  );
}
```

You can build an entire page this way. A `Page` component contains a `Layout` which contains a `Header` and a `Content`. The `Content` contains a `DataTable` which contains many `Row` components. Each component is responsible for only its own piece of the UI and is completely unaware of its ancestors.

In Go terms, this is like composing structs: a large struct might embed smaller structs, and each nested struct only knows about its own fields.

## State: when UIs need to react

So far the components we've seen are purely presentational — given the same props, they always produce the same output. But real UIs need to change over time in response to user interactions. A dropdown needs to open and close. A form field needs to track what the user has typed. A notification needs to disappear after a few seconds.

This is where **state** comes in. State is data that belongs to a component and can change over time. When state changes, React automatically re-renders the component with the new state.

Here's the classic counter example:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

`useState(0)` declares a piece of state initialized to `0`. It returns the current value (`count`) and a setter function (`setCount`). When `setCount` is called with a new value, React re-runs the component function with the new state and updates the DOM.

A slightly more realistic example: a toggle button that shows or hides a detail panel:

```jsx
function CollapsiblePanel({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide" : "Show"} {title}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}
```

`{isOpen && <div ...>}` is a JavaScript expression: if `isOpen` is `false`, nothing is rendered; if it's `true`, the div is rendered. React handles adding and removing the element from the DOM.

## The mental model shift: UI is a function of state

The deepest shift React asks you to make is in how you think about UIs.

In the traditional model, you think imperatively: "When the user clicks this button, add a class to this div. When the request completes, remove the spinner and show the data. When the user types in this input, update this other element." You're constantly manipulating the DOM step by step.

React asks you to think declaratively: "Given this state, what should the UI look like?" You describe the relationship between state and UI, and React handles all the DOM manipulation.

In code, this means your component is a pure function of its state and props:

```
UI = f(state, props)
```

When the user clicks a button, you don't say "add a spinner to the DOM". You say "set `isLoading` to `true`". Your component already knows that when `isLoading` is `true`, it should render a spinner. React sees the state change, re-runs the function, and updates the DOM accordingly.

For a backend developer, this is actually a familiar concept. Your HTTP handler is also a function: given a request (input), produce a response (output). State in a database is just state. The difference is that in React, the "database" is component state, the "request" is a user interaction, and the "response" is a DOM update — and everything happens in milliseconds.

## Why this matters for real projects

Let's bring this back to Plakar. Our `packages/ui` library has around 50+ components: buttons, inputs, selects, modals, data tables, date pickers, badges, tooltips, and more. Every single one is a React component that owns its structure and its styles.

When we need to tweak the padding on all our card components, we change it in one place. When we fix a keyboard navigation bug in our dropdown, both `apps/oss` and `apps/plakman` benefit without any extra work. When we add a new variant to our button component, every place that uses the button immediately has access to the new variant — and if they try to use it incorrectly, TypeScript (more on that in the next article) tells them before the code even runs.

This is the promise of React: not just "you can build UIs", but "you can build UIs that you can actually maintain, refactor, and improve without being afraid".

---

Next up: TypeScript. Because React components without types are just functions with a prayer — and we like certainty.
