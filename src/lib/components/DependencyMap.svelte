<script lang="ts">
	import { pushWormholeEntry } from '$lib/utils/wormhole';

	export type DependencyLane = 'core' | 'bridge' | 'deep';

	export interface DependencyNode {
		id: string;
		label: string;
		to: string;
		lane?: DependencyLane;
		note?: string;
	}

	export interface DependencyEdge {
		from: string;
		to: string;
		note?: string;
	}

	interface Props {
		title?: string;
		intro?: string;
		nodes: ReadonlyArray<DependencyNode>;
		edges?: ReadonlyArray<DependencyEdge>;
		returnLabel?: string;
		defaultOpen?: boolean;
	}

	let {
		title = 'Dependency map',
		intro = 'Prerequisites and forward links for this chapter.',
		nodes,
		edges = [],
		returnLabel = 'dependency map',
		defaultOpen = false
	}: Props = $props();

	function normalizeHref(target: string) {
		return target.startsWith('#') ? target : `#${target}`;
	}

	function rememberOrigin(target: string) {
		if (typeof window === 'undefined') return;
		pushWormholeEntry({
			y: window.scrollY,
			hash: window.location.hash,
			to: normalizeHref(target),
			returnLabel
		});
	}

	function laneLabel(lane?: DependencyLane) {
		if (lane === 'bridge') return 'Bridge';
		if (lane === 'deep') return 'Deep';
		return 'Core';
	}

	const edgeRows = $derived.by(() => {
		const rows: Array<{ from: DependencyNode; to: DependencyNode; note?: string }> = [];

		for (const edge of edges) {
			const from = nodes.find((node) => node.id === edge.from);
			const to = nodes.find((node) => node.id === edge.to);
			if (!from || !to) continue;
			rows.push({ from, to, note: edge.note });
		}

		return rows;
	});
</script>

<aside class="dependency-map">
	<details class="dependency-details" open={defaultOpen}>
		<summary class="dependency-summary">
			<span class="dependency-kicker">Map</span>
			<span class="dependency-title">{title}</span>
		</summary>
		<p class="dependency-intro">{intro}</p>

		<div class="dependency-grid">
			{#each nodes as node (node.id)}
				<article class={['dependency-node', `lane-${node.lane ?? 'core'}`]}>
					<div class="dependency-node-head">
						<span class="dependency-lane">{laneLabel(node.lane)}</span>
						<a href={normalizeHref(node.to)} onclick={() => rememberOrigin(node.to)}>{node.label}</a>
					</div>
					{#if node.note}
						<p class="dependency-note">{node.note}</p>
					{/if}
				</article>
			{/each}
		</div>

		{#if edgeRows.length > 0}
			<div class="dependency-paths">
				<h4>Paths</h4>
				<ul>
					{#each edgeRows as edge (`${edge.from.id}-${edge.to.id}-${edge.note ?? ''}`)}
						<li>
							<span>{edge.from.label}</span>
							<span aria-hidden="true">→</span>
							<span>{edge.to.label}</span>
							{#if edge.note}
								<span class="dependency-edge-note">{edge.note}</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</details>
</aside>

<style>
	.dependency-map {
		margin: var(--space-md) 0 var(--space-lg);
	}

	.dependency-details {
		border: 1px solid var(--color-border-light);
		border-radius: 0.8rem;
		background: linear-gradient(180deg, rgba(236, 253, 245, 0.7), rgba(255, 255, 255, 0.98));
	}

	.dependency-summary {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.7rem 0.85rem;
		cursor: pointer;
		list-style: none;
	}

	.dependency-summary::-webkit-details-marker {
		display: none;
	}

	.dependency-kicker {
		font-family: var(--font-sans);
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: #065f46;
		background: rgba(16, 185, 129, 0.16);
		border: 1px solid rgba(16, 185, 129, 0.25);
		padding: 0.14rem 0.4rem;
		border-radius: 999px;
	}

	.dependency-title {
		font-family: var(--font-sans);
		font-size: 0.86rem;
		font-weight: 650;
		color: var(--color-ink);
	}

	.dependency-intro {
		margin: 0;
		padding: 0 0.9rem 0.65rem;
		font-family: var(--font-sans);
		font-size: 0.76rem;
		color: var(--color-ink-faint);
	}

	.dependency-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 0.45rem;
		padding: 0 0.9rem 0.8rem;
	}

	.dependency-node {
		border: 1px solid var(--color-border-light);
		border-radius: 0.55rem;
		padding: 0.5rem 0.56rem;
		background: white;
	}

	.dependency-node.lane-bridge {
		background: linear-gradient(180deg, rgba(245, 243, 255, 0.65), rgba(255, 255, 255, 0.98));
	}

	.dependency-node.lane-deep {
		background: linear-gradient(180deg, rgba(255, 247, 237, 0.7), rgba(255, 255, 255, 0.98));
	}

	.dependency-node-head {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.dependency-lane {
		font-family: var(--font-sans);
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
		min-width: 2.8rem;
	}

	.dependency-node a {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-d);
		text-decoration: none;
		border-bottom: 1px dashed rgba(168, 85, 247, 0.4);
	}

	.dependency-node a:hover {
		color: var(--color-c);
		border-bottom-color: var(--color-c);
	}

	.dependency-note {
		margin: 0.32rem 0 0;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--color-ink-faint);
		line-height: 1.35;
	}

	.dependency-paths {
		padding: 0 0.9rem 0.85rem;
	}

	.dependency-paths h4 {
		margin: 0 0 0.35rem;
		font-family: var(--font-sans);
		font-size: 0.71rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.dependency-paths ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.24rem;
	}

	.dependency-paths li {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.32rem;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--color-ink-faint);
	}

	.dependency-edge-note {
		color: var(--color-ink-light);
	}
</style>
