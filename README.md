# TripSplit - SvelteKit Migration

This project has been migrated from React to **SvelteKit**.

## Architecture & How SvelteKit Works

### 1. Directory Structure

SvelteKit uses a file-system based routing and a unified structure for your code.

- **`src/app.html`**: The main HTML template.
- **`src/routes`**: This is the heart of the application.
    - **`+page.svelte`**: Defines the main page of your application.
    - **`+layout.svelte`**: Wraps the pages, useful for global styles and providers.
- **`src/lib`**: Contains internal library code. Code here can be imported via the `$lib` alias.
    - **`$lib/components`**: Reusable Svelte components (Header, SummaryCard, etc.).
    - **`$lib/utils`**: Helper functions and business logic (e.g., `billSplitter.ts`).
    - **`$lib/data`**: Static data or seed files.

### 2. How it works

#### Reactivity
Instead of `useState` and `useEffect`, Svelte uses standard Javascript variables and the `$:` label for derived state.
- **State**: `let count = 0;`
- **Derived**: `$: double = count * 2;` (Automatic updates when `count` changes)
- **Updates**: `count += 1;` (No setters needed)

#### Composition
Components are imported and used just like in React, but props are declared with `export let propName`.
`bind:value` allows for easy two-way data binding, which simplifies form handling (e.g., in `ExpenseForm` and `CurrencyConverter`).

#### Routing
The file system determines the URL. `src/routes/+page.svelte` maps to `/`. If we added `src/routes/about/+page.svelte`, it would map to `/about`.

### 3. Business Logic
The core bill splitting logic was moved from a React Hook (`useBillSplitter`) to a pure function in `src/lib/utils/billSplitter.ts`. This makes it easier to test and reuse, as it decouples the logic from the UI framework.

## Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
