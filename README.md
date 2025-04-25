# Vite + Rolldown Module Federation Reproduction

This repo tests two approaches to using Module Federation with Vite and Rolldown, to explore their current state and limitations.

## 🧪 Tested Setups

### 1. Module Federation via Rolldown-Vite PR

Using the rolldown-vite package from this pull request, which exports the experimental moduleFederationPlugin directly.

```JSON

"vite": "https://pkg.pr.new/rolldown/vite@83"
```

This version allows importing the plugin like so:

```JS
import { moduleFederationPlugin } from "rolldown/experimental";
```

### 2. Module Federation via rolldown directly (with latest rolldown-vite)

Alternatively, I tried using rolldown directly with a stable release of rolldown-vite:

```JSON
"vite": "npm:rolldown-vite@latest"
```

And importing the plugin like this:

```JS
import { moduleFederationPlugin } from "rolldown/experimental";
```

## ⚙️ Behavior Across Environments

### ➤ Development (pnpm dev)

In both setups:
• It’s unclear whether `mf-manifest.json` or `remoteEntry.js` are generated during dev.
• Vite does not serve remote assets, or they may not be generated at all.
• Attempting to import a remote module (e.g. webpack/button) results in a resolution error unless the remote import is commented out:

```bash
Failed to resolve import "webpack/button" from "src/App.tsx". Does the file exist?
```

### ➤ Build (pnpm build)

First test setup (Module Federation via Rolldown-Vite PR)
• Build fails without manually installing the runtime:

```bash
You have set `optimizeDeps.esbuildOptions` but this options is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rollupOptions` instead.
vite v6.1.0 building for production...
The built-in minifier is still under development. Setting "minify: true" is not recommended for production use.
✓ 15 modules transformed.
x Build failed in 46ms
error during build:
Build failed with 1 error:
Error: [UNHANDLEABLE_ERROR] Error: Something wrong inside the rolldown, please report this at https://github.com/rolldown/rolldown/issues.
Cannot find module '@module-federation/runtime'
...
ELIFECYCLE  Command failed with exit code 1.
```

To fix:

```bash
pnpm add @module-federation/runtime
```

After Installing Runtime
• With `@module-federation/runtime`, the build proceeds.
• Assets like `mf-manifest.json` and `remoteEntry.js` are now generated correctly.

The second test setup had no issues but did not generate any module federation assets.

### ➤ Preview (pnpm preview) - only tested with the first test setup which generated the related module federation assets

• The app fails with a runtime error if the init function hasn’t been called:

Uncaught Error: [ Federation Runtime ]: Please call init first
