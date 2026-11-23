---
name: docs
description: >
  Style guide for writing Plakar documentation. Use this skill whenever writing
  or editing documentation for the website, including Community, Control Plane,
  integrations, guides, references, and explanations.
---

# Plakar documentation style

Write like an engineer explaining a system to another engineer. The reader
should leave with an accurate model of how the system behaves, not a list of
buttons to press.

## Tone

Calm, precise, direct and neutral. State known behaviour without hedging.

Avoid:

- marketing words such as _powerful_, _seamless_, _robust_, _simple_, _easily_
- conversational phrases such as _let's take a look_ or _keep in mind_
- rhetorical questions, filler introductions and reassurance
- benefits the system's behaviour does not support
- semicolons and em dashes in prose. Split compound clauses into sentences

Good:

> An edge executes tasks on behalf of Plakar Control Plane, from a network where
> the protected resources are reachable.

Avoid:

> Edges are a powerful and flexible way to bring backup execution closer to your
> data.

## Voice and sentences

- Use the active voice by default. Use the passive voice only when the actor is
  unknown or irrelevant, or when it clearly improves clarity. "Can be" is
  passive too: write "you can pick a store", not "a store can be picked".
- Use the present tense. Describe what the system does, not what it will do or
  what was done.
- One idea per sentence. Name the actor first, then what it does. Rewrite any
  sentence over about 25 words, or with more than one clause starting with
  _which_, _that_ or _among_.
- Address the reader as "you" in procedures and sign-in flows. Name the role,
  such as "a Superuser" or "members", when a permission depends on it. Do not
  switch between "a person", "people" and "users" for the same reader.
- Call the product "Plakar Control Plane" on its first mention in a page, then
  "PCP" or "Plakar Control Plane". Never "the Control Plane" alone.

Good:

> With hotadd, Plakar attaches the disks of the snapshot to the virtual machine
> it runs in, reads them as local block devices, then detaches them.

Avoid:

> At sign-in, the organization a person joins is the one that assigns their
> email domain to the provider, among the organization of the address they sign
> in at and the organizations below it.

## Explain the system, not the interface

- Introduce what a feature is and why it exists before how to configure it.
  Never open a section with a field or control name.
- Describe effects, not clicks. "When a resource is held, PCP refuses tasks that
  would use it", not "Select the resource and click Hold".
- Do not narrate what the reader can already see on screen. Explain what it
  means.
- Explain relationships between concepts when they affect behaviour, and
  distinguish concepts that are easily confused.
- State limitations as part of the feature, not as an afterthought.
- Headings name concepts (`## How edges work`), not screens
  (`## Edge Settings Page`).
- Use procedures only when the page's purpose is a task. Otherwise write
  paragraphs.

A paragraph carries one idea, in the order concept, purpose, behaviour,
consequence. Use lists only for discrete items such as options, requirements or
supported types.

## Keep it short

- Write less. When unsure whether a detail belongs, leave it out. Write "PCP
  refuses the task when no matching edge is available", not "In the event that
  no suitable edge executor can be identified, the Control Plane will be unable
  to proceed".
- Do not state what the reader already knows, such as the format of a URL.
- Every sentence adds information. Never state a fact twice on a page.
- Prefer one paragraph to several, and a paragraph to a table for settings.
  Mention only what the reader must supply and what is not obvious.
- Put short values such as a URI inline, not in their own code block.
- When a concept has its own page, mention it in one sentence and link to it.
- Reuse established terms. Do not invent new names for existing concepts.
- Use examples to show a rule, with realistic values, not to repeat the previous
  sentence.

## What to leave out

Unless the user asks for it:

- form and screen behaviour, button names, which card holds which action
- API endpoint tables, request bodies and curl examples. They belong in the API
  reference
- troubleshooting sections, log prefixes and debug steps
- error code tables. State the rule that causes the refusal instead
- flow internals such as callback routes, token exchanges, lifetimes and
  timeouts
- rare edge cases and quirks

Keep the rules that decide whether something works, who may do it, what the
reader must supply and where it comes from, and setup steps in third-party
consoles.

### Source code confirms, it does not supply content

Read the source to verify behaviour, not to find things to document. Include an
implementation detail only if the reader would notice it, configure it, or need
it to diagnose a failure. Name the identifier the reader supplies, not where the
system stores it.

> A backup starts by taking a temporary vSphere snapshot of the virtual machine.

The snapshot stays because it appears in vCenter. The OVF descriptor, VMX file
and temporary clone describe how the connector works, so they do not.

## Recurring wording

- In link text, say "integration", not "connector": "the
  [filesystem integration](../fs)".
- Built-in integrations carry this note instead of an Installation section:
  `> [!NOTE]` "The X integration is built into Plakar and requires no package
  installation."

## Permissions

Name the roles that can perform a restricted action, such as the Superuser and
Platform Admins, and link to them. When a reader would expect a permission and
does not have it, say so. Confirm permission rules against the plakman source.

## Page types

**Community** docs have five sections:

| Section         | Purpose                                       | Examples                             |
| --------------- | --------------------------------------------- | ------------------------------------ |
| Getting Started | Guided first steps for new users              | Install Plakar, first backup         |
| Guides          | Accomplish a specific task, basics assumed    | Back up PostgreSQL, automate backups |
| References      | Exact commands, options and configuration     | CLI commands, flags, environment     |
| Explanations    | Concepts, architecture and trade-offs         | How Plakar works, backup strategies  |
| Integrations    | Prerequisites, configuration, service caveats | S3, SFTP, Notion, Google Drive       |

**Control Plane** docs are reference documentation: features, behaviour,
configuration, limitations and how components interact. Control Plane guides are
goal-oriented and assume the concepts are known.

A feature page usually follows: what it is and why it exists, how it behaves,
how to configure it, requirements and limitations, links to related concepts.
Skip sections the feature does not need.

## Before handing back a page

Reread the page and fix:

- passive constructions, including "can be", that have a known actor
- sentences over about 25 words
- a fact stated twice
- details the reader already knows or can see on screen
- semicolons and em dashes
