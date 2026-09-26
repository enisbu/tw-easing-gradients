---
name: tw-easing-gradients
author: enisbu
description: Replace Tailwind CSS linear gradients with smooth eased gradients using tw-easing-gradients. Use when upgrading bg-gradient-to-*, creating fading backgrounds, or smooth color transitions.
---

# tw-easing-gradients

Tailwind CSS v4 plugin for smooth, naturally blending gradients using cubic bezier easing and oklab color interpolation, with Tailwind-style `/oklch` modifiers.

## Requirements

- Tailwind CSS v4+

## Installation

```bash
npm install tw-easing-gradients
# or: pnpm add tw-easing-gradients / bun add tw-easing-gradients
```

Add to global CSS (Tailwind v4):

```css
@import 'tailwindcss';
@plugin "tw-easing-gradients";
```

## Core Patterns

### Transparency Fade (Most Common)

Replace standard gradients with smooth fades:

```html
<!-- Fade to transparent -->
<div class="bg-ease-to-b from-black">
  <!-- Fades from black to transparent -->
</div>

<!-- With Tailwind color -->
<div class="bg-ease-to-t from-sidebar">
  <!-- Fades from sidebar color to transparent -->
</div>
```

### Color-to-Color Gradient

```html
<div class="bg-ease-in-out-to-br from-violet-600 to-pink-500">
  <!-- Smooth diagonal gradient -->
</div>

<div class="bg-ease-out-to-r from-[#6366F1] to-[#06B6D4]">
  <!-- Custom hex colors -->
</div>
```

## Replacing Standard Tailwind Gradients

| Standard Tailwind | tw-easing-gradients |
|-------------------|---------------------|
| `bg-gradient-to-t` | `bg-ease-to-t` |
| `bg-gradient-to-r` | `bg-ease-to-r` |
| `bg-gradient-to-b` | `bg-ease-to-b` |
| `bg-gradient-to-l` | `bg-ease-to-l` |
| `bg-gradient-to-tl` | `bg-ease-to-tl` |
| `bg-gradient-to-tr` | `bg-ease-to-tr` |
| `bg-gradient-to-bl` | `bg-ease-to-bl` |
| `bg-gradient-to-br` | `bg-ease-to-br` |

## When to Replace mask-* with bg-ease-*

**Replaceable:** Solid color backgrounds and overlays.

```diff
-<div class="bg-sidebar mask-b-from-25%">
+<div class="bg-ease-to-b from-sidebar">
```

**NOT replaceable:** Text fades (mask-* required for fading text content).

```html
<!-- Keep using mask-* for text -->
<p class="mask-r-from-70%">Long text that fades out...</p>
```

## Easing Options

Four easing functions available:

- `bg-ease-to-*` — Standard ease (default, most natural)
- `bg-ease-in-to-*` — Slow start, fast end
- `bg-ease-out-to-*` — Fast start, slow end
- `bg-ease-in-out-to-*` — Slow start and end

## Direction Reference

| Direction | CSS Value |
|-----------|-----------|
| `to-t` | to top |
| `to-r` | to right |
| `to-b` | to bottom |
| `to-l` | to left |
| `to-tl` | to top left |
| `to-tr` | to top right |
| `to-bl` | to bottom left |
| `to-br` | to bottom right |

## Custom Bezier

Arbitrary easing curves via bracket notation:

```html
<div class="bg-ease-to-r-[0.22,1,0.36,1] from-black"></div>
<div class="bg-ease-to-b-[0.42,0,0.58,1] from-violet-600 to-pink-500"></div>
```

## Color Interpolation

Colors mix in oklab by default, the same as Tailwind's `bg-linear-*`. Add a modifier to pick another color space, exactly like Tailwind's own gradients:

```html
<div class="bg-ease-in-out-to-r/oklch from-blue-500 to-yellow-400"></div>
<div class="bg-ease-to-r/longer from-rose-500 to-indigo-500"></div>
```

`/oklch` keeps saturated colors vivid through the middle. Skip it for fades to or from `transparent`, white, black or gray: those colors have no hue, and the gradient picks up a wrong tint.

## Configuration

Configure gradient stops in CSS (default: 15):

```css
@plugin "tw-easing-gradients" {
  stops: 20;
}
```

More stops = smoother gradients but larger CSS output.

## Common Upgrade Patterns

### Hero Section Overlay

```diff
-<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
+<div class="absolute inset-0 bg-ease-to-t from-black">
```

### Card Fade Effect

```diff
-<div class="bg-gradient-to-b from-white via-white/50 to-transparent">
+<div class="bg-ease-to-b from-white">
```

### Sidebar Fade

```diff
-<div class="mask-b-from-25% bg-sidebar">
+<div class="bg-ease-to-b from-sidebar">
```

### Text Fade Overlay

```diff
-<div class="absolute bottom-0 h-20 w-full bg-gradient-to-t from-background to-transparent">
+<div class="absolute bottom-0 h-20 w-full bg-ease-to-t from-background">
```

### Card Image Overlay (Pseudo-Element)

```diff
-<div class="relative after:absolute after:bottom-0 after:h-1/2 after:w-full after:bg-gradient-to-t after:from-black/80">
+<div class="relative after:absolute after:bottom-0 after:h-1/2 after:w-full after:bg-ease-to-t after:from-black">
```
