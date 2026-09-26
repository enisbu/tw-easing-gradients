---
title: Utilities
description: All available easing gradient utilities
section: Reference
---

<script>
	import EasingComparison from '$lib/components/docs/utilities/EasingComparison.svelte'
	import DirectionsShowcase from '$lib/components/docs/utilities/DirectionsShowcase.svelte'
	import ColorExamples from '$lib/components/docs/utilities/ColorExamples.svelte'
	import TransparencyExamples from '$lib/components/docs/utilities/TransparencyExamples.svelte'
	import { Tabs, TabItem, Card, CardGrid } from '@svecodocs/kit'
</script>

## Syntax

Combine an easing function with a direction: `bg-{easing}-to-{direction}`

For the default `ease` curve, the easing part is just `ease`: `bg-ease-to-r`. For all others, use the full name: `bg-ease-in-to-r`, `bg-ease-out-to-b`, `bg-ease-in-out-to-br`.

## Easing Functions

<EasingComparison />

| Utility                   | Easing Function | Description                     |
| ------------------------- | --------------- | ------------------------------- |
| `bg-ease-to-{dir}`        | ease            | Default easing (slow-fast-slow) |
| `bg-ease-in-to-{dir}`     | ease-in         | Slow start, fast end            |
| `bg-ease-out-to-{dir}`    | ease-out        | Fast start, slow end            |
| `bg-ease-in-out-to-{dir}` | ease-in-out     | Slow start and end              |

## Directions

<DirectionsShowcase />

| Short | Direction    | CSS Value         |
| ----- | ------------ | ----------------- |
| `t`   | Top          | `to top`          |
| `r`   | Right        | `to right`        |
| `b`   | Bottom       | `to bottom`       |
| `l`   | Left         | `to left`         |
| `tl`  | Top Left     | `to top left`     |
| `tr`  | Top Right    | `to top right`    |
| `bl`  | Bottom Left  | `to bottom left`  |
| `br`  | Bottom Right | `to bottom right` |

## Transparency Fades

Skip `to-*` and the plugin fades to transparent automatically.

<TransparencyExamples />

```html
<div class="bg-ease-to-t from-blue-500"></div>
```

## Using with Tailwind Colors

<ColorExamples />

```html
<div class="bg-ease-to-r from-indigo-500 to-cyan-500"></div>
<div class="bg-ease-out-to-b from-emerald-400 to-cyan-500"></div>
<div class="bg-ease-in-out-to-br from-amber-500 to-rose-600"></div>
```

## Full Class Reference

<Tabs items={["ease", "ease-in", "ease-out", "ease-in-out"]}>
<TabItem value="ease">

| Direction    | Class           |
| ------------ | --------------- |
| Top          | `bg-ease-to-t`  |
| Top Right    | `bg-ease-to-tr` |
| Right        | `bg-ease-to-r`  |
| Bottom Right | `bg-ease-to-br` |
| Bottom       | `bg-ease-to-b`  |
| Bottom Left  | `bg-ease-to-bl` |
| Left         | `bg-ease-to-l`  |
| Top Left     | `bg-ease-to-tl` |

</TabItem>
<TabItem value="ease-in">

| Direction    | Class              |
| ------------ | ------------------ |
| Top          | `bg-ease-in-to-t`  |
| Top Right    | `bg-ease-in-to-tr` |
| Right        | `bg-ease-in-to-r`  |
| Bottom Right | `bg-ease-in-to-br` |
| Bottom       | `bg-ease-in-to-b`  |
| Bottom Left  | `bg-ease-in-to-bl` |
| Left         | `bg-ease-in-to-l`  |
| Top Left     | `bg-ease-in-to-tl` |

</TabItem>
<TabItem value="ease-out">

| Direction    | Class               |
| ------------ | ------------------- |
| Top          | `bg-ease-out-to-t`  |
| Top Right    | `bg-ease-out-to-tr` |
| Right        | `bg-ease-out-to-r`  |
| Bottom Right | `bg-ease-out-to-br` |
| Bottom       | `bg-ease-out-to-b`  |
| Bottom Left  | `bg-ease-out-to-bl` |
| Left         | `bg-ease-out-to-l`  |
| Top Left     | `bg-ease-out-to-tl` |

</TabItem>
<TabItem value="ease-in-out">

| Direction    | Class                  |
| ------------ | ---------------------- |
| Top          | `bg-ease-in-out-to-t`  |
| Top Right    | `bg-ease-in-out-to-tr` |
| Right        | `bg-ease-in-out-to-r`  |
| Bottom Right | `bg-ease-in-out-to-br` |
| Bottom       | `bg-ease-in-out-to-b`  |
| Bottom Left  | `bg-ease-in-out-to-bl` |
| Left         | `bg-ease-in-out-to-l`  |
| Top Left     | `bg-ease-in-out-to-tl` |

</TabItem>
</Tabs>

## Custom Bezier

Use arbitrary values to define your own easing curve with four control points:

```html
<div class="bg-ease-to-r-[0.22,1,0.36,1] from-black"></div>
<div class="bg-ease-to-b-[0.68,0,0.27,1.55] from-indigo-500 to-cyan-500"></div>
```

The four values correspond to the control points of a cubic bezier curve: `x1, y1, x2, y2`.

## Color Interpolation

Colors mix in oklab by default, the same as Tailwind's `bg-linear-*`. Add a modifier to pick another color space, exactly like Tailwind's own gradients:

```html
<div class="bg-ease-in-out-to-r/oklch from-blue-500 to-yellow-400"></div>
<div class="bg-ease-to-r/longer from-rose-500 to-indigo-500"></div>
```

`/oklch` keeps saturated colors vivid through the middle. Skip it for fades to or from `transparent`, white, black or gray: those colors have no hue, and the gradient picks up a wrong tint.

## Next Steps

<CardGrid cols={2}>
	<Card title="Examples" href="/docs/examples">
		Practical use cases with live previews.
	</Card>
	<Card title="API Reference" href="/docs/api-reference">
		Configuration options and technical details.
	</Card>
</CardGrid>
