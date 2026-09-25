---
'tw-easing-gradients': patch
---

Fix CJS build: `require('tw-easing-gradients')` now returns the plugin function instead of a namespace object, so Tailwind's `@plugin` loading via `createRequire` no longer fails with `y is not a function`.
