# uyguLama Substack Template

This is a Next.js (App Router) based website template designed to integrate seamlessly with your Substack publication. It automatically fetches and displays your Substack posts while providing a modern, customizable landing page with built-in responsive design.

## Features

- **Substack Integration**: Automatically syncs and displays posts from your Substack newsletter using the Substack API (`src/lib/substack.ts`).
- **Modern UI**: Built with Tailwind CSS and `shadcn/ui` for beautiful, accessible components.
- **Type-Safe**: Developed with TypeScript for robust code quality and easy maintainability.
- **Performance Optimized**: Uses Next.js App Router, optimized Next.js images, and dynamic font loading.
- **Configurable**: Easily update site information, social links, and theme settings via a centralized `src/data/site.json` file.
- **MDX Support**: Create and manage content pages like "About Us" easily using MDX.

## Getting Started

1. Clone this repository.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Open `src/data/site.json` and set your `substackUrl` (e.g., `https://yourpublication.substack.com`), along with your other site details.
4. Run the development server:
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

All site-wide settings (Site name, address, contact info, social media links) are managed in `src/data/site.json`. Just update the values there, and the site will reflect the changes across the header, footer, and contact sections.

## Environment Variables

Copy `env.sample` to `.env` and configure the necessary variables:
- `SUBSTACK_SID`: If your Substack publication requires authentication or if you want to bypass strict rate limits, you can provide your Substack Session ID (SID) cookie value here.

## Scripts

This template includes helper scripts to automate common tasks:

- `bun run generate-assets`: Automatically processes and copies your branding assets (`favicon.png`, `lama.png`, `og-image.png`) from `src/assets` to the `public/` directory with the correct names (`favicon.ico`, `icon.png`, `apple-icon.png`, `opengraph-image.png`).
- `bun run get-tags`: Connects to your Substack and fetches the latest tags used in your posts.

## Technologies Used

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Custom Solutions and Applications

At uyguLama, we are happy to provide the right services tailored to your needs. For your solution requirements, you can get in touch with us via [uygulama.net](https://uygulama.net).
