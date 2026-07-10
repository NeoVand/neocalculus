<script lang="ts">
	import { onMount } from 'svelte';
	import { ensureJSXGraph } from '$lib/utils/jsxgraph-loader';
	import { getPlotTheme, THEME_CHANGE_EVENT } from '$lib/utils/theme';

	interface Props {
		/** Function that receives the JXG global and the board, and draws on it. */
		setup: (JXG: any, board: any) => void;
		/** Bounding box [xMin, yMax, xMax, yMin] */
		boundingbox?: [number, number, number, number];
		/** Aspect ratio width/height. Default 16/10. */
		aspectRatio?: number;
		/** Show axes. Default true. */
		axes?: boolean;
		/** Caption below the figure. */
		caption?: string;
		/** Figure number for labeling. */
		number?: string;
		class?: string;
		/** Render without a nested figure wrapper when placed inside another Figure component. */
		embedded?: boolean;
		/** Enable direct interaction with draggable construction points. */
		interactive?: boolean;
		/** Preserve equal x and y unit scales. Disable for conventional function plots. */
		keepAspectRatio?: boolean;
	}

	let {
		setup,
		boundingbox = [-5, 5, 5, -5],
		aspectRatio = 16 / 10,
		axes = true,
		caption,
		number: figNumber,
		class: className = '',
		embedded = false,
		interactive = false,
		keepAspectRatio = true
	}: Props = $props();

	let board: any = null;
	let jxg: any = null;
	let boardId = `jsx-${Math.random().toString(36).slice(2, 9)}`;
	let loadError = $state(false);

	onMount(() => {
		let disposed = false;

		const init = async () => {
			try {
				loadError = false;
				jxg = await ensureJSXGraph();
				if (disposed) return;
				const theme = getPlotTheme();

				board = jxg.JSXGraph.initBoard(boardId, {
					boundingbox,
					keepAspectRatio,
					axis: axes,
					showCopyright: false,
					showNavigation: false,
					pan: { enabled: false },
					zoom: { enabled: false },
					registerEvents: interactive,
					renderer: 'svg',
					grid: {
						visible: false
					},
					defaultAxes: {
						x: {
							ticks: {
								strokeColor: theme.axis,
								label: { fontSize: 11, cssClass: 'jsx-tick-label', anchorX: 'middle' }
							},
							strokeColor: theme.axis
						},
						y: {
							ticks: {
								strokeColor: theme.axis,
								label: { fontSize: 11, cssClass: 'jsx-tick-label', anchorX: 'right' }
							},
							strokeColor: theme.axis
						}
					}
				});

				setup(jxg, board);
			} catch (error) {
				loadError = true;
				console.error('Failed to initialize JSXGraph board', error);
			}
		};

		const handleThemeChange = () => {
			if (disposed || !jxg) return;
			if (board) {
				jxg.JSXGraph.freeBoard(board);
				board = null;
			}
			void init();
		};

		window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
		void init();

		return () => {
			disposed = true;
			window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
			if (board && jxg) {
				try {
					jxg.JSXGraph.freeBoard(board);
				} catch {
					/* ignore cleanup errors */
				}
			}
		};
	});
</script>

{#snippet boardContent()}
	<div class="jsx-board-wrapper" style="aspect-ratio: {aspectRatio};">
		{#if loadError}
			<div class="jsx-fallback">Interactive figure failed to load.</div>
		{:else}
			<div id={boardId} class="jxgbox" style="width:100%; height:100%;"></div>
		{/if}
	</div>
{/snippet}

{#if embedded}
	<div class="jsx-embedded {className}">
		{@render boardContent()}
	</div>
{:else}
	<figure class="neo-figure jsx-figure {className}">
		{@render boardContent()}
	{#if caption}
		<figcaption>
			{#if figNumber}<span class="figure-number">Figure {figNumber}.</span>{/if}
			{caption}
		</figcaption>
	{/if}
	</figure>
{/if}

<style>
	.jsx-board-wrapper {
		width: 100%;
		border: 1px solid var(--color-border-light);
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--plot-background);
		display: grid;
		place-items: center;
	}

	.jsx-embedded {
		width: 100%;
		min-width: 0;
	}

	.jsx-fallback {
		font-family: var(--font-sans);
		font-size: 0.9rem;
		color: var(--color-ink-faint);
		padding: 0.75rem;
	}

	.jsx-board-wrapper :global(.jxgbox) {
		background: var(--plot-background) !important;
	}

	/* Hide JSXGraph default navigation */
	.jsx-board-wrapper :global(.JXG_navigation) {
		display: none !important;
	}

	/* Style tick labels */
	.jsx-board-wrapper :global(.jsx-tick-label) {
		font-family: var(--font-sans) !important;
		fill: var(--plot-muted) !important;
	}

	/* Style text elements */
	.jsx-board-wrapper :global(.JXGtext) {
		font-family: 'Crimson Pro', serif !important;
	}
</style>
