---
'tw-easing-gradients': minor
---

Mix color stops in oklab by default and add Tailwind-style interpolation modifiers. `from-transparent` no longer tints dark gradients brown or orange, since `transparent` has no hue and the old oklch mix pulled it to 0. Gradients between two saturated colors (blue to yellow, red to blue) now pass through a softer middle, the same as Tailwind's `bg-linear-*`; add `/oklch` to get the previous vivid look, or any modifier Tailwind supports (`/longer`, `/srgb`, `/[in_hsl_longer_hue]`).
