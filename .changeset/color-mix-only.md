---
'tw-easing-gradients': patch
---

Simplify generated color stops to plain `color-mix(in oklab, …)` without the `oklch(from …)` wrappers. Output renders the same, CSS is shorter, and the eased gradient now works wherever `color-mix()` is supported (Chrome 111, Safari 16.2, Firefox 113) instead of requiring relative color syntax.
