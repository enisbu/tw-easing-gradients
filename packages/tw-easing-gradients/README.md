<div align="center">
  <img src="https://raw.githubusercontent.com/enisbu/tw-easing-gradients/main/apps/docs/static/logo-rounded.png" alt="tw-easing-gradients" width="80" height="80" />
  <h1>tw-easing-gradients</h1>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/npm/v/tw-easing-gradients?style=flat-square&color=269BDE" alt="npm version" />
  <img src="https://img.shields.io/npm/dw/tw-easing-gradients?style=flat-square&color=4480E7" alt="npm downloads" />
  <img src="https://img.shields.io/github/license/enisbu/tw-easing-gradients?style=flat-square&color=6366F1" alt="License" />
</div>

<br />

<div align="center">
  <strong>Smooth, naturally blending gradients for Tailwind CSS</strong>
  <br />
  <sub>Cubic bezier easing • Custom curves • oklab color interpolation • Drop-in replacement</sub>
</div>

---

## Why?

Standard CSS gradients distribute colors linearly, resulting in sharp edges at the start and end of the gradient. This is particularly noticeable in transparency fades, where the transition looks abrupt rather than natural.

This plugin distributes color stops along an easing curve using `color-mix()` in the oklab color space, resulting in smooth, natural-looking transitions.

<br />
<div align="center">
  <img src="https://raw.githubusercontent.com/enisbu/tw-easing-gradients/main/apps/docs/static/og.png" alt="Comparison" width="800" />
</div>
<br />

## Installation

```bash
npm install tw-easing-gradients
```

```css
@import 'tailwindcss';
@plugin "tw-easing-gradients";
```

## Usage

```html
<!-- Fade to transparent -->
<div class="bg-ease-to-b from-black"></div>

<!-- Color-to-color gradient -->
<div class="bg-ease-in-out-to-br from-violet-600 to-pink-500"></div>
```

**Try it live:** [Playground](https://tw-easing-gradients.enisdev.com/playground)

## Easing Functions

| Class | Effect |
|-------|--------|
| `bg-ease-to-*` | Standard ease (most natural) |
| `bg-ease-in-to-*` | Slow start, fast end |
| `bg-ease-out-to-*` | Fast start, slow end |
| `bg-ease-in-out-to-*` | Slow start and end |

## Directions

`to-t` · `to-r` · `to-b` · `to-l` · `to-tl` · `to-tr` · `to-bl` · `to-br`

## Custom Bezier

Use arbitrary values for custom easing curves:

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

## Documentation

[tw-easing-gradients.enisdev.com/docs](https://tw-easing-gradients.enisdev.com/docs)

## Prior Art & Inspiration

- [larsenwork.com](https://larsenwork.com/easing-gradients) — Original easing gradients concept
- [postcss-easing-gradients](https://github.com/larsenwork/postcss-easing-gradients) — PostCSS implementation
- [CSSWG Proposal](https://github.com/w3c/csswg-drafts/issues/1332) — W3C proposal for native support

## AI Coding Assistant

A [SKILL.md](https://github.com/enisbu/tw-easing-gradients/tree/main/.claude/skills/tw-easing-gradients) is included for AI assistants (Claude Code, Codex, OpenCode) to automatically upgrade `bg-gradient-to-*` utilities.

---

## Roadmap

- [x] Custom bezier functions
- [ ] Radial gradients
- [ ] Conic gradients

## Contributing

Contributions welcome! Whether it's a bug fix, feature, or documentation improvement.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch and open a PR

## License

tw-easing-gradients is open-source and free to use. Licensed under [MIT](https://github.com/enisbu/tw-easing-gradients/blob/main/LICENSE).
