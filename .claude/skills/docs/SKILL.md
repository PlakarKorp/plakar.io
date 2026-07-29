---
name: documentation
description: >
  Style guide for writing Plakar documentation. Use this skill whenever writing
  or editing documentation for the website, including Community, Control Plane,
  integrations, guides, references, and explanations.
---

# Plakar Documentation Style Guide

## Philosophy

Documentation exists to explain how Plakar works, not to describe the user
interface.

Every page should answer the reader's questions:

- What is this?
- Why does it exist?
- When would I use it?
- How does it behave?
- What should I know before using it?

The interface is simply one way users interact with the system.

---

# Writing Principles

## Explain before instructing

Introduce the concept before describing how it is configured or used.

Good:

> Debug logging temporarily increases the verbosity of Plakar Control Plane logs
> to assist with troubleshooting. Select a duration before enabling it. Once the
> duration expires, the previous log level is restored automatically.

Bad:

> Select a duration and click Enable.

Readers already know how to interact with a user interface.

Documentation should explain why they are performing an action and what happens
afterwards.

---

## Describe behaviour, not controls

Avoid making the interface the subject of the documentation.

Prefer:

> Changes take effect immediately after updating the configuration.

instead of:

> Click Update to save your changes.

Mention interface elements only when they help readers complete a task or avoid
confusion.

---

## Every feature has a purpose

Never introduce a feature or setting without explaining why someone would use
it.

Instead of:

> Configure the SMTP server.

write:

> Configure the SMTP server used by Plakar Control Plane to deliver
> notifications and other system-generated emails.

Readers should understand the purpose before learning the configuration.

---

## Do not describe what readers can already see

Avoid narrating the interface.

Instead of explaining what is visible on the screen, explain what the
information means and how it affects the system.

Bad:

> The page displays a list of organizations.

Better:

> Organizations define administrative boundaries that isolate users, resources,
> and operations.

Documentation should explain behaviour, not screenshots.

---

## Prefer concepts over procedures

Do not turn every page into a numbered list of steps.

Use procedures only when the reader is trying to accomplish a specific task.

---

## Link instead of repeating

Avoid duplicating explanations that already exist elsewhere in the
documentation.

Link to the authoritative page instead.

Each concept should have one primary explanation.

---

## Reuse established terminology

Use the same terminology throughout the documentation.

Avoid inventing alternative names for existing concepts.

Consistency improves clarity and makes documentation easier to search.

---

## Keep implementation details invisible

Avoid exposing internal implementation details unless they help readers
understand behaviour or solve a problem.

Readers generally care about what the system does rather than how the interface
is implemented.

---

## Write for understanding

Every paragraph should improve the reader's understanding of the system.

If readers only learn where a setting is located but not what it does or why it
exists then the documentation has failed.

---

# Tone

Write as an engineer explaining a system to a technically literate reader.

The writing should be:

- calm
- precise
- factual
- concise

Avoid:

- marketing language
- unnecessary adjectives
- filler
- conversational language
- speculation

Let the technical content speak for itself.

---

# Page Types

## Control Plane documentation

Control Plane documentation is primarily a reference documentation.

Its purpose is to explain:

- available features
- system behaviour
- configuration
- operational characteristics
- limitations
- interactions between components

It should not read like a UI walkthrough.

---

## Control Plane guides

Guides are goal-oriented.

They help readers accomplish a real operational task.

Assume readers already understand the underlying concepts.

Use procedures because the task requires them—not because every document needs
steps.

---

## Community Documentation

Community documentation is organised into five sections.

### Getting Started (Tutorials)

**Audience:** New users

**Purpose:** Introduce Plakar through guided, hands-on learning.

Getting Started guides should assume little or no prior knowledge and lead
readers to a successful outcome while building confidence with the product.

**Examples:**

- Installing Plakar
- Creating a first repository
- Running a first backup

---

### Guides (How-to)

**Audience:** Users completing a specific task

**Purpose:** Help readers accomplish a well-defined goal.

Guides assume readers already understand the basics of Plakar and focus on
practical, step-by-step instructions.

**Examples:**

- Back up PostgreSQL
- Create a Kloset store
- Automate backups

---

### References

**Audience:** Users looking up technical information

**Purpose:** Describe commands, configuration, APIs, and other technical
details.

Reference documentation should be factual, complete, and concise. It is intended
to be consulted rather than read from start to finish.

**Examples:**

- CLI commands
- Configuration files
- Command-line flags
- Environment variables

---

### Explanations

**Audience:** Users seeking a deeper understanding

**Purpose:** Explain concepts, architecture, rationale, and trade-offs.

Explanation documents help readers understand why Plakar behaves the way it does
rather than how to perform a task.

**Examples:**

- How Plakar works
- Backup strategies
- Repository architecture

---

### Integrations

**Audience:** Users connecting Plakar to external services

**Purpose:** Explain how to configure and use Plakar with supported services and
platforms.

Integration documentation should cover prerequisites, configuration, and any
service-specific considerations.

**Examples:**

- Amazon S3
- SFTP
- tar
- Notion
- Google Drive
- Proton Drive

---

# UI Writing

The user interface should rarely become the subject of the documentation.

Mention interface actions only when they are necessary to complete a task.

Prefer:

> Enable edge enrollment to allow new edge executors to register.

instead of:

> Click the Enable toggle.

The important information is the system behaviour, not the button.

---

# Procedures

Only write procedures when the document's purpose is procedural.

If the goal is to explain a feature, prefer paragraphs over numbered steps.

Readers should understand a feature before configuring it.

---

# Good Documentation

Good documentation explains things readers cannot discover by simply looking at
the interface.

Do not narrate what is visible.

Explain:

- what the system is doing
- why it behaves that way
- when a feature should be used
- how features interact
- what limitations or side effects exist

Every paragraph should leave the reader with greater understanding of the
system.
