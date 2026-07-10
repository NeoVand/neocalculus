<script lang="ts">
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';

	let startingGuess = $state(2);
	let boardNode: any = null;

	const f = (x: number) => x * x - 2;
	const fp = (x: number) => 2 * x;
	const update = (x: number) => x - f(x) / fp(x);

	let firstGuess = $derived(update(startingGuess));
	let secondGuess = $derived(update(firstGuess));
	let sliderProgress = $derived(((startingGuess - 0.85) / (2.2 - 0.85)) * 100);

	function requestBoardUpdate() {
		requestAnimationFrame(() => boardNode?.update());
	}

	function setupNewtonGraph(JXG: any, board: any) {
		boardNode = board;
		board.create('functiongraph', [f, 0.8, 2.25], {
			strokeColor: '#1a1a2e',
			strokeWidth: 2.5,
			highlight: false
		});
		board.create('line', [[0, 0], [1, 0]], {
			strokeColor: '#b9b4c0',
			strokeWidth: 1,
			straightFirst: true,
			straightLast: true,
			point1: { visible: false },
			point2: { visible: false },
			highlight: false
		});

		const x0 = board.create('point', [() => startingGuess, () => f(startingGuess)], {
			size: 5,
			fillColor: '#a855f7',
			strokeColor: '#ffffff',
			strokeWidth: 2,
			name: '',
			fixed: true,
			highlight: false
		});
		const x1 = board.create('point', [() => update(startingGuess), 0], {
			size: 4,
			fillColor: '#2563eb',
			strokeColor: '#ffffff',
			strokeWidth: 2,
			name: '',
			fixed: true,
			highlight: false
		});
		const curveAtX1 = board.create(
			'point',
			[() => update(startingGuess), () => f(update(startingGuess))],
			{ visible: false, name: '', fixed: true }
		);
		const x2 = board.create('point', [() => update(update(startingGuess)), 0], {
			size: 4,
			fillColor: '#059669',
			strokeColor: '#ffffff',
			strokeWidth: 2,
			name: '',
			fixed: true,
			highlight: false
		});

		board.create('segment', [x0, x1], {
			strokeColor: '#a855f7',
			strokeWidth: 2,
			dash: 2,
			fixed: true,
			highlight: false
		});
		board.create('segment', [x1, curveAtX1], {
			strokeColor: '#2563eb',
			strokeWidth: 1,
			dash: 3,
			fixed: true,
			highlight: false
		});
		board.create('segment', [curveAtX1, x2], {
			strokeColor: '#2563eb',
			strokeWidth: 2,
			dash: 2,
			fixed: true,
			highlight: false
		});

		const root = Math.sqrt(2);
		board.create('point', [root, 0], {
			size: 2,
			fillColor: '#ef4444',
			strokeColor: '#ef4444',
			name: '',
			fixed: true,
			highlight: false
		});
		board.create('text', [root, -0.24, '√2'], {
			fontSize: 10,
			color: '#ef4444',
			anchorX: 'middle',
			highlight: false
		});
	}
</script>

<div class="newton-explorer">
	<JSXGraphBoard
		setup={setupNewtonGraph}
		boundingbox={[0.75, 2.55, 2.3, -0.45]}
		aspectRatio={1.35}
		keepAspectRatio={false}
		embedded
	/>

	<label class="slider-row" for="newton-starting-guess">
		<span>Starting guess <i>x</i>₀</span>
		<input
			id="newton-starting-guess"
			type="range"
			min="0.85"
			max="2.2"
			step="0.01"
			bind:value={startingGuess}
			oninput={requestBoardUpdate}
			class="demo-slider tone-violet"
			style={`--slider-progress: ${sliderProgress}%`}
		/>
		<output>{startingGuess.toFixed(2)}</output>
	</label>

	<div class="iteration" aria-live="polite">
		<span class="guess start"><small>start</small>x₀ = {startingGuess.toFixed(4)}</span>
		<b aria-hidden="true">→</b>
		<span class="guess first"><small>first intercept</small>x₁ = {firstGuess.toFixed(4)}</span>
		<b aria-hidden="true">→</b>
		<span class="guess second"><small>second intercept</small>x₂ = {secondGuess.toFixed(4)}</span>
	</div>
</div>

<style>
	.newton-explorer {
		display: grid;
		gap: 0.75rem;
		width: 100%;
		min-width: 0;
	}

	.slider-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) 3.6rem;
		align-items: center;
		gap: 0.7rem;
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 650;
		color: var(--color-ink-light);
	}

	.slider-row output {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		text-align: right;
		color: var(--color-d);
		font-variant-numeric: tabular-nums;
	}

	.iteration {
		display: grid;
		grid-template-columns: repeat(5, auto);
		justify-content: center;
		align-items: center;
		gap: 0.55rem;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		font-variant-numeric: tabular-nums;
	}

	.iteration b {
		color: var(--color-ink-faint);
	}

	.guess {
		display: grid;
		gap: 0.08rem;
		font-weight: 700;
	}

	.guess small {
		font-family: var(--font-sans);
		font-size: 0.58rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.guess.start {
		color: var(--color-d);
	}

	.guess.first {
		color: var(--color-result);
	}

	.guess.second {
		color: var(--color-success);
	}

	@media (max-width: 520px) {
		.slider-row {
			grid-template-columns: 1fr 3.6rem;
		}

		.slider-row span {
			grid-column: 1 / -1;
		}

		.iteration {
			grid-template-columns: 1fr;
			gap: 0.3rem;
			justify-items: center;
		}

		.iteration b {
			display: none;
		}

		.guess {
			grid-template-columns: 7.5rem auto;
			align-items: baseline;
			gap: 0.6rem;
		}
	}
</style>
