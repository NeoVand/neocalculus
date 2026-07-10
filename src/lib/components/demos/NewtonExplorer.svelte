<script lang="ts">
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';

	let startingGuess = $state(2.1);
	let boardNode: any = null;

	// Vertical scaling preserves x - f(x)/f'(x), but keeps the curve behind the construction.
	const f = (x: number) => 0.25 * (x * x * x - 2);
	const fp = (x: number) => 0.75 * x * x;
	const update = (x: number) => x - f(x) / fp(x);
	const root = Math.cbrt(2);

	const guesses = $derived.by(() => {
		const values = [startingGuess];
		for (let i = 0; i < 4; i += 1) values.push(update(values[i]));
		return values;
	});
	const sliderProgress = $derived(((startingGuess - 1.1) / 1.1) * 100);

	function requestBoardUpdate() {
		requestAnimationFrame(() => boardNode?.update());
	}

	function setupNewtonGraph(_JXG: any, board: any) {
		boardNode = board;
		board.create('functiongraph', [f, 0.75, 2.25], {
			strokeColor: 'var(--plot-curve)',
			strokeWidth: 2,
			strokeOpacity: 0.42,
			highlight: false
		});
		board.create('line', [[0, 0], [1, 0]], {
			strokeColor: 'var(--plot-axis)',
			strokeWidth: 1,
			straightFirst: true,
			straightLast: true,
			point1: { visible: false },
			point2: { visible: false },
			highlight: false
		});

		const stepColors = ['var(--plot-violet)', 'var(--plot-blue)', 'var(--plot-teal)', 'var(--plot-amber)'];
		for (let i = 0; i < 4; i += 1) {
			const curvePoint = board.create('point', [() => guesses[i], () => f(guesses[i])], {
				size: i === 0 ? 4.5 : 3.5,
				fillColor: stepColors[i],
				strokeColor: 'var(--plot-background)',
				strokeWidth: 1.6,
				name: '', fixed: true, highlight: false
			});
			const intercept = board.create('point', [() => guesses[i + 1], 0], {
				size: 3.4,
				fillColor: stepColors[i],
				strokeColor: 'var(--plot-background)',
				strokeWidth: 1.5,
				name: '', fixed: true, highlight: false
			});
			board.create('segment', [curvePoint, intercept], {
				strokeColor: stepColors[i], strokeWidth: 2, fixed: true, highlight: false
			});
			if (i < 3) {
				const nextCurvePoint = board.create('point', [() => guesses[i + 1], () => f(guesses[i + 1])], {
					visible: false, name: '', fixed: true
				});
				board.create('segment', [intercept, nextCurvePoint], {
					strokeColor: stepColors[i + 1], strokeWidth: 1.1, dash: 3, fixed: true, highlight: false
				});
			}
		}

		board.create('point', [root, 0], {
			size: 2.2, fillColor: 'var(--plot-error)', strokeColor: 'var(--plot-error)', name: '', fixed: true, highlight: false
		});
		board.create('text', [root, -0.2, '∛2'], {
			fontSize: 11, color: 'var(--plot-error)', anchorX: 'middle', highlight: false
		});
	}
</script>

<div class="newton-explorer">
	<p class="model-note">Shown curve: g(x) = ¼(x³ − 2). Its vertical scale keeps four Newton steps legible without changing any intercept.</p>
	<JSXGraphBoard setup={setupNewtonGraph} boundingbox={[0.72, 2.5, 2.28, -0.48]} aspectRatio={1.42} keepAspectRatio={false} embedded />

	<label class="slider-row" for="newton-starting-guess">
		<span>Starting guess <i>x</i>₀</span>
		<input id="newton-starting-guess" type="range" min="1.1" max="2.2" step="0.01" bind:value={startingGuess} oninput={requestBoardUpdate} class="demo-slider tone-violet" style={`--slider-progress: ${sliderProgress}%`} />
		<output>{startingGuess.toFixed(2)}</output>
	</label>

	<div class="iteration" aria-live="polite">
		{#each guesses as guess, index (index)}
			<span><small>{index === 0 ? 'start' : `step ${index}`}</small>x<sub>{index}</sub> = {guess.toFixed(5)}</span>
		{/each}
	</div>
</div>

<style>
	.newton-explorer { display: grid; gap: 0.72rem; width: 100%; min-width: 0; }
	.model-note { margin: 0; font-family: var(--font-sans); font-size: 0.76rem; line-height: 1.45; color: var(--color-ink-light); }
	.slider-row { display: grid; grid-template-columns: auto minmax(0, 1fr) 3.6rem; align-items: center; gap: 0.7rem; font-family: var(--font-sans); font-size: 0.78rem; font-weight: 650; color: var(--color-ink-light); }
	.slider-row output { font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; text-align: right; color: var(--color-d); font-variant-numeric: tabular-nums; }
	.iteration { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.45rem; padding-top: 0.25rem; border-top: 1px solid var(--color-border-light); font-family: var(--font-mono); font-size: 0.68rem; font-variant-numeric: tabular-nums; }
	.iteration span { display: grid; gap: 0.04rem; min-width: 0; color: var(--color-ink-light); }
	.iteration small { font-family: var(--font-sans); font-size: 0.64rem; color: var(--color-ink-faint); }
	.iteration sub { font-size: 0.72em; }
	@media (max-width: 620px) { .iteration { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 520px) { .slider-row { grid-template-columns: 1fr 3.6rem; } .slider-row span { grid-column: 1 / -1; } }
</style>
