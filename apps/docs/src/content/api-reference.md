---
title: API Reference
description: Technical details and configuration options
section: Reference
---

<script>
	import { Callout, Collapsible, Card, CardGrid } from '@svecodocs/kit'
</script>

## Plugin Options

The plugin accepts an optional configuration object:

```ts
import plugin from 'tw-easing-gradients';

// Default options
plugin({ stops: 15 });
```

### Options

| Option  | Type     | Default | Description                           |
| ------- | -------- | ------- | ------------------------------------- |
| `stops` | `number` | `15`    | Number of color stops in the gradient |

<Callout type="note">
More stops produce smoother gradients. 15 is the default and works well for most cases.
</Callout>

## How It Works

### 1. Easing Coordinates

The plugin uses cubic bezier easing functions to calculate color stop positions:

```ts
const EASING_FUNCTIONS = {
	ease: [0.25, 0.1, 0.25, 1],
	'ease-in': [0.42, 0, 1, 1],
	'ease-out': [0, 0, 0.58, 1],
	'ease-in-out': [0.42, 0, 0.58, 1]
};
```

### 2. Color Interpolation

Colors are blended with `color-mix()` in the `oklab` color space, the same space Tailwind uses for its native gradients. Mixing with `transparent` keeps the hue of the other color, so fades stay clean.

### 3. Generated CSS

For a utility like `bg-ease-in-out-to-r`, the plugin generates a `linear-gradient` with multiple color stops using `color-mix()`.

<Collapsible title="generated CSS output">

<!-- prettier-ignore -->
```css
.bg-ease-in-out-to-r {
  background-image: linear-gradient(
    to right,
    var(--tw-gradient-from) 0%,
    color-mix(in oklab, var(--tw-gradient-to, transparent) 1.3%, var(--tw-gradient-from)) 8.1%,
    color-mix(in oklab, var(--tw-gradient-to, transparent) 4.9%, var(--tw-gradient-from)) 15.5%,
    color-mix(in oklab, var(--tw-gradient-to, transparent) 10.4%, var(--tw-gradient-from)) 22.5%,
    /* ... more stops interpolated along the easing curve ... */
    color-mix(in oklab, var(--tw-gradient-to, transparent) 98.7%, var(--tw-gradient-from)) 91.9%,
    var(--tw-gradient-to, transparent) 100%
  );
}
```

</Collapsible>

## Browser Support

Requires browsers with [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) support: Chrome 111, Safari 16.2 and Firefox 113 or newer. Older browsers get a plain linear gradient as fallback.

## Exported Functions

The plugin also exports utility functions for programmatic use:

### `getCoordinates(easing, stops)`

Get easing coordinates for a given easing function:

```ts
import { getCoordinates } from 'tw-easing-gradients';

const coords = getCoordinates('ease-in-out', 15);
// Returns: [{ x: 0, y: 0 }, { x: 0.081, y: 0.021 }, ...]
```

## TypeScript

The plugin is written in TypeScript and includes full type definitions:

```ts
import type {
	EasingFunction,
	Direction,
	Coordinate
} from 'tw-easing-gradients';

const easing: EasingFunction = 'ease-in-out';
const dir: Direction = 'br';
```

## Next Steps

<CardGrid cols={2}>
	<Card title="Examples" href="/docs/examples">
		Practical use cases with live previews.
	</Card>
	<Card title="Playground" href="/playground">
		Experiment with easing gradients interactively.
	</Card>
</CardGrid>
