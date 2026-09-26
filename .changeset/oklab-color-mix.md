---
'tw-easing-gradients': minor
---

Colors now mix in oklab by default, like Tailwind's `bg-linear-*`. This fixes a brown tint on fades from `transparent`. Gradients between two saturated colors get a softer middle; add `/oklch` for the previous look. All of Tailwind's interpolation modifiers work: `/oklch`, `/longer`, `/[in_hsl]` and so on.
