---
description: How to Add a New Feature
---

# How to Add a New Feature

This guide outlines the steps to add a new feature to the project, adhering to its modular architecture. Following these conventions is crucial for maintaining a clean and scalable codebase.

## Step 1: Create the Feature Module

All features are encapsulated within their own directories in the `modules` folder. Start by creating a new directory for your feature.

```bash
# Replace <feature-name> with a descriptive, kebab-case name
mkdir modules/<feature-name>
```

Inside this new directory, create the standard subdirectories:

- `components`: For feature-specific React components.
- `hooks`: For feature-specific React hooks.
- `utils`: For feature-specific utility functions.
- `api`: For all data-fetching logic (if needed).

## Step 2: Develop the Main Feature Component

Create the main component for your feature. While you can create multiple components in the `components` directory, it's good practice to have a primary entry point component, often named `index.tsx` directly within your feature module directory.

**File Path:** `modules/<feature-name>/index.tsx`

```tsx
// modules/<feature-name>/index.tsx
'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

const FeatureComponent = () => {
    return (
        <Box>
            <Typography variant='h4'>Welcome to the New Feature!</Typography>
            {/* Your feature's UI and logic go here */}
        </Box>
    )
}

export default FeatureComponent
```

## Step 3: Implement API Logic (If Required)

If your feature needs to communicate with a backend, organize your API files within the `api` directory.

1.  **API Types (`api/types.ts`):** Define all TypeScript types related to your API requests and responses.
2.  **Client-Side Fetching (`api/client.ts`):** Implement client-side data fetching logic here. **Crucially, all asynchronous operations must use TanStack Query (`useQuery`, `useMutation`)** to ensure consistent caching, state management, and error handling.
3.  **Server-Side Logic (`api/server.ts`):** Place server-side logic, such as Next.js API route handlers, in this file.

## Step 4: Create the Page Route

To make your feature accessible, create a corresponding route in the `app` directory.

1.  Create a new directory in `app` that matches your feature's name.

    ```bash
    mkdir app/<feature-name>
    ```

2.  Inside this directory, create a `page.tsx` file. This file should be a lightweight wrapper that does nothing more than import and render your main feature component.

    **File Path:** `app/<feature-name>/page.tsx`

    ```tsx
    // app/<feature-name>/page.tsx
    import FeatureComponent from '@/modules/<feature-name>'

    export default function FeaturePage() {
        return <FeatureComponent />
    }
    ```

## Step 5: Leverage the `universal` Module

For any code that can be shared across multiple features, use the `universal` module:

- **Global State:** Use the Zustand store from `modules/universal/store`.
- **Shared Hooks:** Add to and use hooks from `modules/universal/hooks`.
- **Shared Utilities:** Use helpers from `modules/universal/utils`.
- **Global Constants:** Define and use constants from `modules/universal/constants`.

## Step 6: Add Navigation

Finally, add a link to your new feature in the main application navigation (e.g., in the sidebar or header) to make it discoverable to users.

By following these steps, you will integrate your new feature cleanly and consistently with the existing project architecture.
