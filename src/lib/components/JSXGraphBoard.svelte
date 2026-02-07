<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

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
	}

	let {
		setup,
		boundingbox = [-5, 5, 5, -5],
		aspectRatio = 16 / 10,
		axes = true,
		caption,
		number: figNumber,
		class: className = ''
	}: Props = $props();

	let container: HTMLDivElement;
	let board: any = null;
	let boardId = `jsx-${Math.random().toString(36).slice(2, 9)}`;

	onMount(async () => {
		// Dynamic import — JSXGraph is browser-only (needs DOM)
		// Load JSXGraph CSS from static
		if (!document.querySelector('link[data-jsxgraph-css]')) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = '/jsxgraph.css';
			link.setAttribute('data-jsxgraph-css', '');
			document.head.appendChild(link);
		}

		const JXG = await import('jsxgraph');

		board = JXG.JSXGraph.initBoard(boardId, {
			boundingbox,
			keepAspectRatio: true,
			axis: axes,
			showCopyright: false,
			showNavigation: false,
			pan: { enabled: false },
			zoom: { enabled: false },
			registerEvents: false,
			renderer: 'svg',
			grid: {
				visible: false
			},
			defaultAxes: {
				x: {
					ticks: {
						strokeColor: '#ccc8bf',
						label: { fontSize: 11, cssClass: 'jsx-tick-label', anchorX: 'middle' }
					},
					strokeColor: '#ccc8bf'
				},
				y: {
					ticks: {
						strokeColor: '#ccc8bf',
						label: { fontSize: 11, cssClass: 'jsx-tick-label', anchorX: 'right' }
					},
					strokeColor: '#ccc8bf'
				}
			}
		});

		setup(JXG, board);
	});

	onDestroy(() => {
		if (board) {
			try {
				// @ts-ignore
				JXG?.JSXGraph?.freeBoard?.(board);
			} catch {
				/* ignore cleanup errors */
			}
		}
	});
</script>

<figure class="neo-figure jsx-figure {className}">
	<div class="jsx-board-wrapper" style="aspect-ratio: {aspectRatio};">
		<div id={boardId} bind:this={container} class="jxgbox" style="width:100%; height:100%;"></div>
	</div>
	{#if caption}
		<figcaption>
			{#if figNumber}<span class="figure-number">Figure {figNumber}.</span>{/if}
			{caption}
		</figcaption>
	{/if}
</figure>

<style>
	.jsx-board-wrapper {
		width: 100%;
		border: 1px solid var(--color-border-light);
		border-radius: 0.5rem;
		overflow: hidden;
		background: white;
	}

	.jsx-board-wrapper :global(.jxgbox) {
		background: white !important;
	}

	/* Hide JSXGraph default navigation */
	.jsx-board-wrapper :global(.JXG_navigation) {
		display: none !important;
	}

	/* Style tick labels */
	.jsx-board-wrapper :global(.jsx-tick-label) {
		font-family: var(--font-sans) !important;
		fill: #aaa !important;
	}

	/* Style text elements */
	.jsx-board-wrapper :global(.JXGtext) {
		font-family: 'Crimson Pro', serif !important;
	}
</style>
