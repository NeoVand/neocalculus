<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import LegendList from '$lib/components/demos/LegendList.svelte';

	let j11 = $state(1.2);
	let j12 = $state(0.4);
	let j21 = $state(-0.25);
	let j22 = $state(1.1);
	let x0 = $state(1.1);
	let y0 = $state(0.8);

	const det = $derived(j11 * j22 - j12 * j21);
	const gradX = $derived(2 * x0);
	const gradY = $derived(2 * y0);

	const map = (x: number, y: number) => ({ x: j11 * x + j12 * y, y: j21 * x + j22 * y });
	const q0 = $derived(map(0, 0));
	const q1 = $derived(map(1, 0));
	const q2 = $derived(map(1, 1));
	const q3 = $derived(map(0, 1));

	const maxImageAbs = $derived(
		Math.max(
			1.35,
			Math.abs(q0.x),
			Math.abs(q0.y),
			Math.abs(q1.x),
			Math.abs(q1.y),
			Math.abs(q2.x),
			Math.abs(q2.y),
			Math.abs(q3.x),
			Math.abs(q3.y)
		)
	);
	const imageHalf = $derived(maxImageAbs * 1.15);
	const imageScale = $derived(Math.min(156 / imageHalf, 126 / imageHalf));

	const gradMag = $derived(Math.hypot(gradX, gradY));
	const gradLen = $derived(gradMag === 0 ? 0 : Math.min(1.25, 0.35 + 0.3 * gradMag));
	const gradDx = $derived(gradMag === 0 ? 0 : (gradX / gradMag) * gradLen);
	const gradDy = $derived(gradMag === 0 ? 0 : (gradY / gradMag) * gradLen);
</script>

<div class="demo-container content-width">
	<DemoHeader title="Explore: gradient and Jacobian geometry" />

	<DemoCard title="Controls">
		<div class="demo-controls-grid">
			<SliderField
				id="jac-j11"
				label="J11 (x from x)"
				hint="How x-input contributes to x-output"
				min={-2}
				max={2}
				step={0.01}
				decimals={2}
				bind:value={j11}
			/>
			<SliderField
				id="jac-j12"
				label="J12 (x from y)"
				hint="How y-input contributes to x-output"
				min={-2}
				max={2}
				step={0.01}
				decimals={2}
				bind:value={j12}
			/>
			<SliderField
				id="jac-j21"
				label="J21 (y from x)"
				hint="How x-input contributes to y-output"
				min={-2}
				max={2}
				step={0.01}
				decimals={2}
				bind:value={j21}
			/>
			<SliderField
				id="jac-j22"
				label="J22 (y from y)"
				hint="How y-input contributes to y-output"
				min={-2}
				max={2}
				step={0.01}
				decimals={2}
				bind:value={j22}
			/>
			<SliderField
				id="jac-x0"
				label="x0"
				hint="Evaluation point for gradient"
				min={-2.2}
				max={2.2}
				step={0.01}
				decimals={2}
				bind:value={x0}
			/>
			<SliderField
				id="jac-y0"
				label="y0"
				hint="Evaluation point for gradient"
				min={-2.2}
				max={2.2}
				step={0.01}
				decimals={2}
				bind:value={y0}
			/>
		</div>
	</DemoCard>

	<div class="gj-grid">
		<DemoCard title="Jacobian map of the unit square">
			<svg viewBox="0 0 360 300" role="img" aria-label="Unit square and Jacobian image">
				<defs>
					<marker id="arrow-purple" markerWidth="6" markerHeight="6" refX="5.2" refY="3" orient="auto">
						<path d="M0,0 L6,3 L0,6 Z" fill="#a855f7" />
					</marker>
				</defs>

				<rect x="24" y="24" width="312" height="252" fill="white" stroke="#ece8e0" />
				<line x1="180" y1="24" x2="180" y2="276" stroke="#e2ddd3" />
				<line x1="24" y1="150" x2="336" y2="150" stroke="#e2ddd3" />

				<polygon points="180,150 236,150 236,94 180,94" fill="rgba(59,130,246,0.24)" stroke="#2563eb" stroke-width="1.5" />

				<polygon
					points={`${180 + imageScale * q0.x},${150 - imageScale * q0.y} ${180 + imageScale * q1.x},${150 - imageScale * q1.y} ${180 + imageScale * q2.x},${150 - imageScale * q2.y} ${180 + imageScale * q3.x},${150 - imageScale * q3.y}`}
					fill="rgba(168,85,247,0.24)"
					stroke="#a855f7"
					stroke-width="1.5"
				/>

				<line
					x1="180"
					y1="150"
					x2={180 + imageScale * q1.x}
					y2={150 - imageScale * q1.y}
					stroke="#a855f7"
					stroke-width="1.9"
					marker-end="url(#arrow-purple)"
				/>
				<line
					x1="180"
					y1="150"
					x2={180 + imageScale * q3.x}
					y2={150 - imageScale * q3.y}
					stroke="#a855f7"
					stroke-width="1.9"
					marker-end="url(#arrow-purple)"
				/>

				<text x="32" y="42" fill="#2563eb" font-size="11" font-family="var(--font-sans)">source unit square</text>
				<text x="32" y="58" fill="#a855f7" font-size="11" font-family="var(--font-sans)">image under J</text>
			</svg>

			<LegendList
				items={[
					{ label: 'blue: source square [0,1]×[0,1]', color: '#2563eb' },
					{ label: 'purple: transformed square', color: '#a855f7' }
				]}
			/>
		</DemoCard>

		<DemoCard title="Gradient of f(x,y)=x²+y²">
			<svg viewBox="0 0 360 300" role="img" aria-label="Gradient field sample at chosen point">
				<defs>
					<marker id="arrow-gradient" markerWidth="6" markerHeight="6" refX="5.2" refY="3" orient="auto">
						<path d="M0,0 L6,3 L0,6 Z" fill="#a855f7" />
					</marker>
				</defs>

				<rect x="24" y="24" width="312" height="252" fill="white" stroke="#ece8e0" />
				<line x1="180" y1="24" x2="180" y2="276" stroke="#e2ddd3" />
				<line x1="24" y1="150" x2="336" y2="150" stroke="#e2ddd3" />

				<circle cx="180" cy="150" r="28" fill="none" stroke="#eee8f8" />
				<circle cx="180" cy="150" r="56" fill="none" stroke="#eee8f8" />
				<circle cx="180" cy="150" r="84" fill="none" stroke="#eee8f8" />

				<circle cx={180 + 56 * x0} cy={150 - 56 * y0} r="4" fill="#1a1a2e" />
				<line
					x1={180 + 56 * x0}
					y1={150 - 56 * y0}
					x2={180 + 56 * (x0 + gradDx)}
					y2={150 - 56 * (y0 + gradDy)}
					stroke="#a855f7"
					stroke-width="2.3"
					marker-end="url(#arrow-gradient)"
				/>

				<text
					x={180 + 56 * x0 + (x0 >= 0 ? 10 : -34)}
					y={150 - 56 * y0 + (y0 >= 0 ? -8 : 14)}
					fill="#a855f7"
					font-size="11"
					font-family="var(--font-sans)"
				>
					∇f at (x0,y0)
				</text>

				<text x="32" y="42" fill="#1a1a2e" font-size="11" font-family="var(--font-sans)">contours of x² + y²</text>
				<text x="32" y="58" fill="#a855f7" font-size="11" font-family="var(--font-sans)">gradient points orthogonal to contours</text>
			</svg>

			<LegendList
				items={[
					{ label: 'black: evaluation point (x0,y0)', color: '#1a1a2e' },
					{ label: 'purple arrow: gradient direction', color: '#a855f7' }
				]}
			/>
		</DemoCard>
	</div>

	<EquationPanel title="Live formulas">
		<Katex
			math={String.raw`J=\begin{bmatrix}${j11.toFixed(2)} & ${j12.toFixed(2)}\\ ${j21.toFixed(2)} & ${j22.toFixed(2)}\end{bmatrix},\quad \det J=${det.toFixed(3)}`}
			display
		/>
		<Katex math={String.raw`|\det J|\text{ is local area scale; sign tracks orientation}`} display />
		<Katex math={String.raw`\nabla f(x_0,y_0)=(2x_0,2y_0)=(${gradX.toFixed(2)},${gradY.toFixed(2)})`} display />
	</EquationPanel>
</div>

<style>
	.gj-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-top: 0.75rem;
	}

	svg {
		width: 100%;
		height: auto;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: white;
		margin-bottom: 0.6rem;
	}

	@media (max-width: 900px) {
		.gj-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
