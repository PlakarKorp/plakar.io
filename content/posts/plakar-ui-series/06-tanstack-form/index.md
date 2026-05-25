---
title: "Plakar UI #6: TanStack Form"
summary: "How TanStack Form and the AppField pattern turn forms from a copy-paste nightmare into composable, declarative building blocks with type-safe validation."
slug: "plakar-ui-tanstack-form"
date: 2026-05-25T07:00:00+0000
authors:
  - "jcastets"
tags:
  - tanstack-form
  - react
  - plakar-ui
category: "technology"
series: ["Plakar UI Explained to My Backend Colleagues"]
series_order: 6
---

Forms are everywhere in application UIs. Login pages, signup flows, settings panels, data entry screens — if your app does anything interactive, it has forms. And forms are deceptively complex. You need to track field values, validate them (sometimes field by field, sometimes at the form level), display error messages in the right place, prevent double submission, handle server-side errors returned after submission, show loading states, and keep all of it in sync. Every. Single. Time.

The naive approach is to manage form state yourself with a bunch of `useState` calls, wire up `onChange` handlers, write validation logic inline, and hope you didn't forget anything. It works, until it doesn't — and then debugging it is a joy.

TanStack Form is yet another library from the TanStack family (you'll notice that name keeps coming up in this series, and for good reason). It gives you a structured, type-safe way to handle all of this. But what we love most about it is composability — it makes forms feel like assembling LEGO bricks instead of wrestling with a pile of wire.

Let's build up complexity step by step.

## Step 1: A Raw Form

Here's a login form written without any form library — just plain React with Tailwind classes:

```tsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    if (!email) {
      setEmailError("Email is required");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!valid) return;

    // submit...
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        {emailError && (
          <span className="text-sm text-red-600">{emailError}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        {passwordError && (
          <span className="text-sm text-red-600">{passwordError}</span>
        )}
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Sign in
      </button>
    </form>
  );
}
```

This is already about 50 lines for two fields. It's manageable. But now your product manager comes along and says: we also need to collect the user's first name.

## Step 2: Adding a Field — and the Problem

```tsx
function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // ...same validation logic as before, now extended for firstName

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">First name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        {firstNameError && (
          <span className="text-sm text-red-600">{firstNameError}</span>
        )}
      </div>

      {/* ...email and password fields again, copy-pasted */}
    </form>
  );
}
```

You see the problem: every new field means copy-pasting the same `div > label + input + error span` structure. If you decide to change the border radius, or the error color, or add a focus ring, you have to update every single field. In a real application with dozens of forms across hundreds of fields, this becomes a maintenance nightmare.

And we haven't even talked about validation composability, async validation, field dependencies, or server errors yet.

## Step 3: The AppField Pattern

TanStack Form introduces the concept of a form hook that you configure once, registering the field components you want to use:

```ts
// packages/common/hooks/use-app-form.ts
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import { TextField, SelectField, SubmitButton } from "../components/form";

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    SelectField,
    // ...more field types
  },
  formComponents: {
    SubmitButton,
  },
});
```

Each field component (like `TextField`) internally calls `useFieldContext()` to read the field's current value, handle changes, and access validation errors. You write it once, and it works for every field in every form.

Here's what the `TextField` component looks like under the hood:

```tsx
// packages/common/components/form/text-field.tsx
import { TextInput } from "@plakar-ui/ui/components";
import { useState } from "react";

import { useFieldContext } from "../../hooks/form-context";

export function TextField({ type, supportText, ...props }: TextFieldProps) {
  const field = useFieldContext<string>();
  const [hide, setHide] = useState(type === "password");

  return (
    <TextInput
      value={field.state.value ?? ""}
      type={hide ? "password" : "text"}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
      isInvalid={field.state.meta.errors.length > 0}
      supportText={field.state.meta.errors[0] || supportText}
      {...props}
    />
  );
}
```

It's defined once. The label, the input styling, the error display logic — all in one place.

Now your form becomes:

```tsx
function SignupForm() {
  const form = useAppForm({
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await api.createUser(value);
    },
  });

  return (
    <form.AppForm>
      <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
        <form.AppField
          name="firstName"
          validators={{ onChange: ({ value }) => !value ? "First name is required" : undefined }}
        >
          {(field) => (
            <field.TextField label="First name" type="text" />
          )}
        </form.AppField>

        <form.AppField
          name="email"
          validators={{ onChange: ({ value }) => !value ? "Email is required" : undefined }}
        >
          {(field) => (
            <field.TextField label="Email address" type="email" />
          )}
        </form.AppField>

        <form.AppField
          name="password"
          validators={{ onChange: ({ value }) => !value ? "Password is required" : undefined }}
        >
          {(field) => (
            <field.TextField label="Password" type="password" />
          )}
        </form.AppField>

        <form.SubmitButton>Create account</form.SubmitButton>
      </form>
    </form.AppForm>
  );
}
```

Adding a new field now means adding one `form.AppField` block. The label, input styling, error display? Already handled. You just declare *what* you need, not *how* to render it.

This is what a real form looks like in Plakar — here's the actual login form from the Control Plane:

```tsx
// apps/plakman/src/routes/login.tsx
function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const response = await mutation.mutateAsync(value);
      switch (response.status) {
        case "error": {
          formApi.setErrorMap({
            onSubmit: {
              fields: {
                email: response.errors.email?.message,
                password: response.errors.password?.message,
              },
            },
          });
          break;
        }
        case "success": {
          router.history.push(search.redirect);
          break;
        }
      }
    },
  });

  return (
    <form.AppForm>
      <FormElement
        handleSubmit={form.handleSubmit}
        className="flex w-full flex-col gap-4"
      >
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email address"
              type="email"
              autoComplete="username"
              className="w-full"
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              className="w-full"
            />
          )}
        </form.AppField>

        <form.SubmitButton className="mt-2 w-full">Sign in</form.SubmitButton>

        <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
          {(errs) => <Typography className="text-error">{errs}</Typography>}
        </form.Subscribe>
      </FormElement>
    </form.AppForm>
  );
}
```

The form body is now purely declarative. It reads like a spec: "this form has an email field, a password field, and a submit button." The rendering complexity — the styling, error display, loading state — lives entirely in the field components.

## Step 4: Field Groups

Now take this further. Suppose several different forms in your application all need the same combination of fields: first name, email, and password. Maybe a signup form, an "invite user" form, and an admin "create user" form all need these three fields with the same validation logic.

Without field groups, you'd copy those three `form.AppField` blocks into each form, or extract them into a component that somehow shares the form state. TanStack Form solves this cleanly with `withFieldGroup`:

```tsx
// components/form/user-fields-group.tsx
import { withFieldGroup } from "@plakar-ui/common/hooks";

export const UserFieldsGroup = withFieldGroup({
  defaultValues: {
    firstName: "",
    email: "",
    password: "",
  },

  render: function Render({ group }) {
    return (
      <>
        <group.AppField
          name="firstName"
          validators={{ onChange: ({ value }) => !value ? "First name is required" : undefined }}
        >
          {(field) => (
            <field.TextField label="First name" type="text" className="w-full" isRequired />
          )}
        </group.AppField>

        <group.AppField
          name="email"
          validators={{ onChange: ({ value }) => !value ? "Email is required" : undefined }}
        >
          {(field) => (
            <field.TextField
              label="Email address"
              type="email"
              autoComplete="email"
              className="w-full"
              isRequired
            />
          )}
        </group.AppField>

        <group.AppField
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Password is required";
              if (value.length < 8) return "Password must be at least 8 characters";
            },
          }}
        >
          {(field) => (
            <field.TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              className="w-full"
              isRequired
            />
          )}
        </group.AppField>
      </>
    );
  },
});
```

Now any form that needs these three fields just includes `<UserFieldsGroup />`:

```tsx
function SignupForm() {
  const form = useAppForm({
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      await api.signup(value);
    },
  });

  return (
    <form.AppForm>
      <FormElement handleSubmit={form.handleSubmit} className="flex flex-col gap-4">
        <UserFieldsGroup
          form={form}
          fields={{ firstName: "firstName", email: "email", password: "password" }}
        />

        <form.AppField name="acceptTerms">
          {(field) => (
            <field.CheckboxField label="I accept the terms of service" />
          )}
        </form.AppField>

        <form.SubmitButton className="w-full">Sign up</form.SubmitButton>
      </FormElement>
    </form.AppForm>
  );
}

function AdminCreateUserForm() {
  const form = useAppForm({
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
      role: "viewer" as "viewer" | "admin",
    },
    onSubmit: async ({ value }) => {
      await api.admin.createUser(value);
    },
  });

  return (
    <form.AppForm>
      <FormElement handleSubmit={form.handleSubmit} className="flex flex-col gap-4">
        <UserFieldsGroup
          form={form}
          fields={{ firstName: "firstName", email: "email", password: "password" }}
        />

        <form.AppField name="role">
          {(field) => (
            <field.SelectField
              label="Role"
              options={[
                { id: "viewer", name: "Viewer" },
                { id: "admin", name: "Admin" },
              ]}
            />
          )}
        </form.AppField>

        <form.SubmitButton className="w-full">Create user</form.SubmitButton>
      </FormElement>
    </form.AppForm>
  );
}
```

The entire UI complexity of those three user fields — validation rules, error display, styling — lives in one place: `UserFieldsGroup`. Change it once, every form using it benefits automatically.

## A Note on Type Safety

Notice that throughout the examples above, `name="firstName"` is not a magic string — it's typed against the form's `defaultValues`. If your form has no field named `firstName`, TypeScript will tell you at compile time. If you rename a field, every `AppField` using the old name becomes a type error immediately.

This is the same principle we talked about in the TypeScript article: catch mistakes at compile time, not at runtime in production with a confused user staring at a broken form.

## Conclusion

In this article, we focused on composability: individual field components (`AppField`) eliminate rendering boilerplate, and field groups (`withFieldGroup`) bundle related fields into reusable units. A form becomes a clean list of declarative field declarations, and the UI complexity is concentrated in exactly one place per field type.

But we only scratched the surface of what TanStack Form can do. There's also:

- **Field-level validation** — triggered on change, on blur, or on submit, with async validators too
- **Form-level validation** — rules that span multiple fields (e.g., "confirm password must match password")
- **Server-side error mapping** — the `setErrorMap` pattern we used in the login example, where API errors get routed to the exact field that caused them
- **Composable forms themselves** — `withForm` lets you inject a form instance into deeply nested components without prop drilling
- **Full type safety** — the form state type, field names, and validation return types are all inferred from your `defaultValues`, so the compiler catches mismatches before your users do

Like everything in the TanStack ecosystem, the library starts simple and scales gracefully with the complexity of your use case. We've found that we can handle some pretty gnarly multi-step forms with cross-field validation and server errors without ever feeling like we're fighting the framework.
