---
'tw-easing-gradients': patch
---

Fix color tint with `from-transparent`: intermediate stops now mix in `oklab` instead of `oklch`. `transparent` has no hue, so an `oklch` mix pulled the hue to 0 and tinted dark gradients brown/orange. Matches Tailwind's native `bg-linear-*` interpolation.
