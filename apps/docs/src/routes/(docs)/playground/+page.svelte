<script lang="ts">
	import { Label, Separator, Select } from '@svecodocs/kit';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import { BRAND_COLORS, EASING_CURVES, COLOR_PRESETS, INTERPOLATIONS, type BezierCurve } from '$lib/constants';
	import { buildGradientStyle, hexToArbitrary, curveToSvgPath } from '$lib/gradient-utils';
	import ArrowUp from 'phosphor-svelte/lib/ArrowUp';
	import ArrowDown from 'phosphor-svelte/lib/ArrowDown';
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import ArrowUpLeft from 'phosphor-svelte/lib/ArrowUpLeft';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import ArrowDownLeft from 'phosphor-svelte/lib/ArrowDownLeft';
	import ArrowDownRight from 'phosphor-svelte/lib/ArrowDownRight';

	const EASINGS = [
		{ value: 'ease', label: 'Ease' },
		{ value: 'ease-in', label: 'Ease In' },
		{ value: 'ease-out', label: 'Ease Out' },
		{ value: 'ease-in-out', label: 'Ease In Out' },
		{ value: 'custom', label: 'Custom' }
	];

	const DIRECTIONS = [
		{ value: 't', label: 'Top', icon: ArrowUp },
		{ value: 'r', label: 'Right', icon: ArrowRight },
		{ value: 'b', label: 'Bottom', icon: ArrowDown },
		{ value: 'l', label: 'Left', icon: ArrowLeft },
		{ value: 'tl', label: 'Top Left', icon: ArrowUpLeft },
		{ value: 'tr', label: 'Top Right', icon: ArrowUpRight },
		{ value: 'bl', label: 'Bottom Left', icon: ArrowDownLeft },
		{ value: 'br', label: 'Bottom Right', icon: ArrowDownRight }
	];

	let fromHex = $state(BRAND_COLORS.from);
	let toHex = $state(BRAND_COLORS.to);
	let easing = $state('ease-in-out');
	let direction = $state('r');
	let interpolation = $state('');
	let customCurve = $state<BezierCurve>([0.35, 0, 0.2, 1]);
	let activeHandle = $state<1 | 2 | null>(null);

	let isCustom = $derived(easing === 'custom');
	let currentCurve = $derived(isCustom ? customCurve : EASING_CURVES[easing]);

	let className = $derived(
		(isCustom
			? `bg-ease-to-${direction}-[${customCurve.join(',')}]`
			: `bg-${easing}-to-${direction}`) + (interpolation ? `/${interpolation}` : '')
	);

	let fullClass = $derived(
		`${className} from-${hexToArbitrary(fromHex)} to-${hexToArbitrary(toHex)}`
	);

	let usesInlineStyle = $derived(isCustom || interpolation !== '');
	let previewClass = $derived(usesInlineStyle ? '' : `bg-${easing}-to-${direction}`);
	let customStyle = $derived(
		usesInlineStyle
			? buildGradientStyle(currentCurve, direction, INTERPOLATIONS.find((i) => i.value === interpolation)?.method)
			: ''
	);

	const PLOT_SIZE = 220;
	let svgPath = $derived(curveToSvgPath(currentCurve, PLOT_SIZE));

	let handle1 = $derived({
		cx: currentCurve[0] * PLOT_SIZE,
		cy: PLOT_SIZE - currentCurve[1] * PLOT_SIZE
	});

	let handle2 = $derived({
		cx: currentCurve[2] * PLOT_SIZE,
		cy: PLOT_SIZE - currentCurve[3] * PLOT_SIZE
	});

	function switchToCustom() {
		if (!isCustom) {
			customCurve = [...currentCurve] as BezierCurve;
			easing = 'custom';
		}
	}

	function clamp(v: number, min: number, max: number) {
		return Math.min(max, Math.max(min, v));
	}

	function updateHandle(event: PointerEvent, handle: 1 | 2) {
		const svg = event.currentTarget as SVGSVGElement;
		const rect = svg.getBoundingClientRect();
		const nx = Number(clamp((event.clientX - rect.left) / rect.width, 0, 1).toFixed(2));
		const ny = Number(clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1).toFixed(2));

		if (handle === 1) {
			customCurve = [nx, ny, customCurve[2], customCurve[3]];
		} else {
			customCurve = [customCurve[0], customCurve[1], nx, ny];
		}
	}
</script>

<svelte:head>
	<title>Playground | tw-easing-gradients</title>
</svelte:head>

<div class="mx-auto w-full max-w-[640px] space-y-6 2xl:max-w-[760px]">
	<div>
		<h1 class="scroll-m-20 text-[30px] font-semibold">Playground</h1>
		<p class="text-muted-foreground mt-3 text-[18px] leading-7 tracking-[-0.01em] text-balance">
			Build and preview easing gradients interactively.
		</p>
		<Separator class="mt-6" />
	</div>

	<!-- Preview -->
	<div
		class="border-border relative h-48 w-full rounded-xl border shadow-2xl sm:h-64 {previewClass}"
		style="--tw-gradient-from: {fromHex}; --tw-gradient-to: {toHex}; {customStyle}"
	>
		<div class="absolute inset-0 flex items-end p-4">
			<code class="rounded bg-black/20 px-2 py-1 font-mono text-sm text-white/60 backdrop-blur-sm">
				{className}
			</code>
		</div>
	</div>

	<div class="grid gap-6 sm:grid-cols-2">
		<!-- Colors -->
		<div class="border-border bg-card space-y-4 rounded-xl border p-5">
			<h3 class="text-foreground text-sm font-semibold">Colors</h3>

			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<Label class="text-muted-foreground text-xs tracking-wider uppercase">From</Label>
					<code class="text-muted-foreground font-mono text-xs">{fromHex}</code>
				</div>
				<div class="color-picker-wrapper">
					<ColorPicker bind:hex={fromHex} components={ChromeVariant} sliderDirection="horizontal" isAlpha --picker-width="100%" --picker-height="100px" />
				</div>
			</div>

			<Separator />

			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<Label class="text-muted-foreground text-xs tracking-wider uppercase">To</Label>
					<code class="text-muted-foreground font-mono text-xs">{toHex}</code>
				</div>
				<div class="color-picker-wrapper">
					<ColorPicker bind:hex={toHex} components={ChromeVariant} sliderDirection="horizontal" isAlpha --picker-width="100%" --picker-height="100px" />
				</div>
			</div>

			<Separator />

			<div class="space-y-2">
				<Label class="text-muted-foreground text-xs tracking-wider uppercase">Presets</Label>
				<div class="grid grid-cols-2 gap-1.5">
					{#each COLOR_PRESETS as preset (preset.label)}
						<button
							onclick={() => { fromHex = preset.fromHex; toHex = preset.toHex; }}
							class="group border-border hover:bg-accent flex items-center gap-2 rounded-lg border p-1.5 transition-all"
						>
							<div
								class="ring-border/50 h-6 w-6 shrink-0 rounded ring-1 ring-inset"
								style="background: linear-gradient(135deg, {preset.fromHex}, {preset.toHex});"
							></div>
							<span class="text-muted-foreground group-hover:text-foreground truncate text-[11px] transition-colors">
								{preset.label}
							</span>
						</button>
					{/each}
				</div>
			</div>

			<Separator />

			<div class="space-y-2">
				<Label class="text-muted-foreground text-xs tracking-wider uppercase">Color space</Label>
				<Select.Root type="single" bind:value={interpolation}>
					<Select.Trigger class="h-9 w-full">
						{INTERPOLATIONS.find((i) => i.value === interpolation)?.label}
					</Select.Trigger>
					<Select.Content side="top">
						{#each INTERPOLATIONS as i (i.value)}
							<Select.Item value={i.value} label={i.label}>{i.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<!-- Easing & Direction -->
		<div class="border-border bg-card space-y-4 rounded-xl border p-5">
			<h3 class="text-foreground text-sm font-semibold">Options</h3>

			<div class="space-y-2">
				<Label class="text-muted-foreground text-xs tracking-wider uppercase">Easing</Label>
				<Select.Root type="single" bind:value={easing}>
					<Select.Trigger class="h-9 w-full">
						{EASINGS.find((e) => e.value === easing)?.label ?? 'Select'}
					</Select.Trigger>
					<Select.Content side="top">
						{#each EASINGS as e (e.value)}
							<Select.Item value={e.value} label={e.label}>{e.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

				<!-- Curve editor -->
				<div class="border-border bg-muted/30 relative overflow-visible rounded-lg border p-3">
					<svg
						viewBox="0 0 {PLOT_SIZE} {PLOT_SIZE}"
						overflow="visible"
						class="aspect-square w-full touch-none text-foreground"
						onpointermove={(event) => { if (activeHandle) updateHandle(event, activeHandle); }}
						onpointerup={() => (activeHandle = null)}
						onpointercancel={() => (activeHandle = null)}
						onpointerleave={() => (activeHandle = null)}
					>
						<!-- Grid box -->
						<rect x="0" y="0" width={PLOT_SIZE} height={PLOT_SIZE} fill="none" stroke="currentColor" stroke-opacity="0.1" />
						<line x1="0" y1={PLOT_SIZE} x2={PLOT_SIZE} y2="0" stroke="currentColor" stroke-opacity="0.06" stroke-dasharray="4 4" />

						<!-- Handle lines -->
						<line x1="0" y1={PLOT_SIZE} x2={handle1.cx} y2={handle1.cy} stroke="currentColor" stroke-opacity="0.3" />
						<line x1={PLOT_SIZE} y1="0" x2={handle2.cx} y2={handle2.cy} stroke="currentColor" stroke-opacity="0.3" />

						<!-- Curve -->
						<path d={svgPath} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class={isCustom ? '' : 'transition-all duration-300'} />

						<!-- Draggable handles (drag switches to custom automatically) -->
						{#each [[handle1, 1] as const, [handle2, 2] as const] as [handle, id] (id)}
							<circle cx={handle.cx} cy={handle.cy} r="20" fill="transparent" class="cursor-grab active:cursor-grabbing"
								onpointerdown={(event) => {
									switchToCustom();
									(event.currentTarget as SVGCircleElement).setPointerCapture(event.pointerId);
									activeHandle = id;
								}}
							/>
							<circle cx={handle.cx} cy={handle.cy} r="6" fill="currentColor" class="pointer-events-none" />
						{/each}

						<!-- Endpoints -->
						<circle cx="0" cy={PLOT_SIZE} r="3" fill="currentColor" opacity="0.3" />
						<circle cx={PLOT_SIZE} cy="0" r="3" fill="currentColor" opacity="0.3" />
					</svg>
				</div>
			</div>

			<div class="space-y-2">
				<Label class="text-muted-foreground text-xs tracking-wider uppercase">Direction</Label>
				<div class="grid grid-cols-4 gap-1.5">
					{#each DIRECTIONS as dir (dir.value)}
						<button
							onclick={() => (direction = dir.value)}
							class="flex h-9 items-center justify-center rounded-md border transition-all duration-150 will-change-transform {direction === dir.value
								? 'border-brand bg-brand text-brand-foreground scale-105 shadow-sm'
								: 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground'}"
							title={dir.label}
						>
							<dir.icon class="size-4" />
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Code -->
	<div class="border-border bg-card space-y-4 rounded-xl border p-5">
		<div class="flex items-center justify-between">
			<h3 class="text-foreground text-sm font-semibold">Code</h3>
			<CopyButton text={fullClass} />
		</div>
		<div class="bg-background-secondary overflow-hidden rounded-lg p-4">
			<pre class="text-muted-foreground overflow-x-auto font-mono text-sm"><code><span class="text-brand">{className}</span> from-{hexToArbitrary(fromHex)} to-{hexToArbitrary(toHex)}</code></pre>
		</div>
	</div>
</div>

<style>
	.color-picker-wrapper {
		--cp-bg-color: var(--theme-color-background);
		--cp-border-color: var(--theme-color-border);
		--cp-text-color: var(--theme-color-foreground);
		--cp-input-color: var(--theme-color-muted);
		--cp-button-hover-color: var(--theme-color-accent);
	}

	.color-picker-wrapper :global(.color-picker) {
		width: 100%;
	}

	.color-picker-wrapper :global(.picker-wrapper) {
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.color-picker-wrapper :global(.container .alpha) {
		display: none;
	}
</style>
