---
title: "Plakar UI #11: Testing Strategy"
summary: "Why we don't test UI components, what TypeScript and Zod already cover, and where we do write tests."
slug: "plakar-ui-testing-strategy"
date: 2026-05-25T02:00:00+0000
authors:
  - "jcastets"
tags:
  - testing
  - frontend
  - plakar-ui
category: "technology"
series: ["The Plakar Frontend, Explained"]
series_order: 11
---

If you come from a Go background, tests are a given. The `testing` package is in the standard library. You write tests alongside your code. Running `go test ./...` is part of the ritual. Coverage reports feel like a measure of professional responsibility.

So when you first look at the Plakar UI codebase and notice a test suite that is deliberately narrow, the instinct is to read it as neglect. It isn't. It's a considered choice, and the reasoning matters more than the conclusion.

The natural starting point when setting up a new UI codebase is to mirror what you'd do on the backend: test every component, simulate user interactions, aim for coverage metrics. Libraries like React Testing Library exist precisely to support this. You mount a component, you fire events, you assert that certain text appears or that certain buttons are clickable. We did not take that path.

This is part of an ongoing series. The [previous article](../plakar-ui-storybook) covered Storybook and how we develop components in isolation.

## What tests actually cost

Writing tests takes time. That's obvious and acceptable, and everyone knows this going in. The hidden cost is different: maintaining tests.

Every refactor in a UI codebase (rename a prop, restructure a component, extract logic into a shared hook, change an API type) potentially breaks tests that were passing perfectly well. Not because the behavior changed. Because the tests were coupled to implementation details.

Component tests tend to assert things like: this component renders a `<button>`, this text appears inside a `<div>`, this element has this CSS class. When you refactor the component without changing what it does, those tests break. The component still works correctly. The tests just reflect the old internal structure, and now someone has to rewrite them to match the new one. That someone is us, and it takes time, and it adds friction.

The real cost we care about is this: a large test suite limits your ability to refactor. It doesn't just slow down changes. It actively discourages them. When you know a refactor will require rewriting twenty tests, you start second-guessing improvements that you'd otherwise make confidently. You leave things messier than they should be because the cost of cleaning them up is too high.

We refactor constantly. Component APIs improve. Shared logic gets reorganized. Types get tightened. A heavy test suite would work against the pace and quality of that work.

## What TypeScript and Zod already give us

Here's the key observation: a large class of bugs that tests are commonly written to catch, TypeScript catches at compile time, for free, with no maintenance overhead.

Pass the wrong type to a function? Compile error. Access a field that doesn't exist on an object? Compile error. Add a new variant to a discriminated union but forget to handle it in a switch? Compile error. None of these require a test. The compiler is always running, it's always checking, and it never gets out of date.

Zod handles the runtime boundary. API responses enter the application through Zod schemas: if the shape is wrong (if the backend adds a field, removes one, or changes a type) the parse fails at the API call site, immediately, before the data goes anywhere near a component. You don't need a test to verify that your component handles a malformed API response, because a malformed response will never reach the component.

This shifts where we invest effort. Instead of writing tests to verify type correctness, we invest in getting the types right in the first place. Precise schemas. Narrow discriminated unions. No `any`. That last point is not aesthetic. It's a guarantee that TypeScript's analysis is meaningful throughout the entire codebase.

The compiler is our primary safety net. It runs on every keystroke, it catches whole categories of errors automatically, and refactoring doesn't break it.

## What we do test

There is a class of code where tests earn their keep cleanly: pure logic functions with non-obvious behavior.

By "pure" we mean: no UI, no React, no side effects, no network. Just input in, output out. These functions are cheap to test and stay cheap through refactors, because the tests are coupled to behavior, not to implementation details. If you restructure the internals, the tests still pass. If you accidentally change the behavior, the tests catch it.

Two examples from the codebase:

**`Version`** is a function that parses raw version strings from the backend and returns a structured object with three representations: `Value` (the raw string), `Pretty` (shortened for display, with commit hashes truncated to seven characters), and `Channel` (the release channel, without the commit hash).

```typescript
Version("v1.2.3-rc.1.abc1234567890")
// → { Value: "v1.2.3-rc.1.abc1234567890", Pretty: "v1.2.3-rc.1.abc1234", Channel: "v1.2.3-rc.1" }
```

The logic isn't obvious. There are edge cases: stable versions, release candidates with and without a numeric suffix, dev builds with commit hashes of varying lengths, versions with or without the `v` prefix. Getting the regex right is one thing; making sure it stays right under future changes is another. Tests pin down the expected behavior for each case precisely. If someone tweaks the regex and accidentally breaks how RC versions are parsed, the tests catch it instantly.

**`generateParameterErrorSchemaFromQuery`** takes a raw API 400 validation error response (the kind that includes an `errors` array with field paths and validation tags) and transforms it into a structured, field-mapped error object shaped like the original request type.

```typescript
// Input from the API
{
  title: "Validation Error",
  errors: [
    { more: { field: "email", tag: "email" } },
    { more: { field: "accounts[2].id", tag: "required" } }
  ]
}

// Output — an object shaped like the request type
{
  email: { tag: "email", message: "Invalid email address" },
  accounts: {
    "2": {
      id: { tag: "required", message: "This field is required" }
    }
  }
}
```

This is genuinely complex. Array bracket notation needs to be normalized to dot paths. Tags need to be mapped to human-readable messages, with a fallback for unknown tags. The whole thing is built dynamically from a generic type parameter so that the output type is inferred from the request type. The transformation is subtle enough, and the input shapes varied enough, that tests are the right tool for documenting and protecting the expected behavior.

These functions share two properties: their correctness matters, and TypeScript alone can't verify it. TypeScript ensures that the output type is consistent with what the function signature declares, but it cannot check whether the parsing logic is actually correct. That's where tests come in.

## Where we draw the line

We are not anti-testing. We are deliberate about when tests earn their keep.

The question we ask is: does this test protect against a class of bugs that TypeScript and Zod don't already cover? And: will this test survive refactoring without needing to be rewritten?

For pure logic functions, yes, on both counts. For UI components, usually no. Components change shape constantly. Their internal structure is an implementation detail. Testing that structure just creates drag.

We think deeply about types. We keep schemas strict. We rely on the compiler as the primary safety net, and we use tests to fill in where the compiler genuinely can't reach.

That's the line. It's not coverage metrics. It's: does this test do real work that nothing else is already doing?

Next up: [The Build Process](../plakar-ui-build-process), and how the compiled assets end up inside the Go binary.
