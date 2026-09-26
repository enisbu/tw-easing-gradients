---
'tw-easing-gradients': patch
---

Fix `require('tw-easing-gradients')` returning a namespace object instead of the plugin, which broke tools that load Tailwind plugins through `createRequire`.
