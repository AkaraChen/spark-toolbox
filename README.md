# Create Toolpad App

## Project Architecture Overview

This project is a modern web application built with **Next.js** and **TypeScript**, indicating a strong emphasis on type safety and server-side rendering for performance. The UI is crafted using **Material UI (MUI)**, a popular React component library that provides a robust set of pre-built components for a consistent and professional look.

### Core Technologies:
-   **Framework**: Next.js (React)
-   **Language**: TypeScript
-   **UI**: Material UI (MUI)
-   **State Management**: Zustand (via `useStore`)
-   **Data Fetching**: React Query (`@tanstack/react-query`)
-   **Package Manager**: pnpm

### Modular Architecture

The project follows a modular architecture, with distinct features encapsulated in their own directories under the `modules` directory. This approach promotes separation of concerns, making the codebase easier to manage, scale, and debug.

A key component of this architecture is the `universal` module, which contains shared code used across multiple features. This includes:
-   **`constants`**: For storing application-wide constants like API endpoints and storage keys.
-   **`store`**: For global state management using Zustand.
-   **`hooks`**: For reusable React hooks.
-   **`utils`**: For shared utility functions.

This modular design allows for a clean and organized codebase, where each module is responsible for a specific feature or functionality.

### App Directory and Routing

The `app` directory is structured according to the **Next.js App Router** convention. The pages and layouts within this directory serve as lightweight wrappers. Their primary responsibility is to import and render the main components from their corresponding feature modules located in the `modules` directory.

This architectural choice reinforces the project's modularity by:
-   **Separating Concerns**: Routing and page setup are handled in the `app` directory, while the core business logic, state management, and UI are encapsulated within the `modules`.
-   **Enhancing Reusability**: Feature components in `modules` are self-contained and can be easily used or moved without being tightly coupled to the routing structure.

For example, `app/password-generator/page.tsx` is a simple file that imports and displays the `PasswordGenerator` component from `modules/password-generator/`. All the functionality for the password generator tool resides within its module.

This makes the overall structure clean and easy to navigate.

### Feature Modules

The project includes several feature modules, each with a clear purpose:

-   **`ai`**: Integrates with OpenAI for AI-powered features.
-   **`bilibili`**: Provides functionality for interacting with Bilibili, including video fetching and processing.
-   **`changelog`**: A tool for finding package changelogs.
-   **`one-api`**: Manages API providers and quotas, likely for a multi-provider API service.
-   **`password-generator`**: A utility for generating secure passwords.
-   **`settings`**: Handles application settings and configurations.
-   **`translator`**: A feature for translating text.

This feature-oriented structure makes it easy to locate and work on specific parts of the application without affecting other areas.

### Data Management and API Interaction

The application uses **React Query** for efficient data fetching, caching, and state synchronization with the server. This is evident in the use of `useQuery` and `useMutation` hooks throughout the codebase.

The `api-client.ts` files in each module are responsible for making client-side API requests, while the `api.ts` files handle server-side logic. This clear separation of concerns simplifies API management and improves code readability.

### Tooling and Development

The project is configured with modern tooling to ensure code quality and a smooth development experience:
-   **`prettier`**: For consistent code formatting.
-   **`eslint`**: For identifying and fixing code quality issues.
-   **`pnpm`**: As the package manager, which is known for its performance and efficiency.

This setup helps maintain a high standard of code quality and makes it easier for developers to collaborate on the project.

In summary, this project is a well-structured and modern web application that leverages best practices in software development. Its modular architecture, combined with a powerful set of tools and libraries, makes it a scalable and maintainable solution.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-toolpad-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup

Run `npx auth secret` to generate a secret and replace the value in the .env.local file with it.

Add the CLIENT_ID and CLIENT_SECRET from your OAuth provider to the .env.local file.

## Getting Started

First, run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
