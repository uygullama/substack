<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
<!-- BEGIN:template-agent-rules -->
# Architecture and Guidelines for this Template

When working on this codebase, adhere to the following rules:

1. **Type-Safety**: 
   - Always use TypeScript interfaces and types for all props, API responses, and state.
   - Avoid `any`. If a type is unknown, use `unknown` and properly narrow it down.
   - Ensure all API fetching (especially the Substack API integration) is strongly typed using interfaces.

2. **UI & Styling (shadcn/ui & Tailwind CSS)**:
   - Use `shadcn/ui` components for building blocks whenever possible. Do not invent custom UI components if a `shadcn/ui` component already exists.
   - Use Tailwind CSS for all custom styling. Do not use plain CSS or CSS modules unless absolutely necessary.
   - Keep class strings clean and readable, utilizing the `cn` utility function for conditional classes.

3. **General Architecture (BFF / Hybrid)**:
   - This template uses a BFF (Backend-For-Frontend) approach where possible, fetching data on the server in Server Components (e.g., Substack fetching in `lib/substack.ts`) to ensure SEO-friendly HTML delivery.
   - Use Client Components (`"use client"`) only for interactive elements.
   - Global configuration must be read from `src/data/config.ts`. Never hardcode site data, contact info, or social links inside individual components.

4. **Scripts**:

   - **`scripts/generate-assets.ts`**: Automatically copies and sets up the required favicon, apple-icon, and opengraph-image files from `src/assets` into the `public` directory. Can be run via `bun run generate-assets`.
   - **`scripts/get-tags.ts`**: A script to fetch tags. Can be run via `bun run get-tags`.
<!-- END:template-agent-rules -->