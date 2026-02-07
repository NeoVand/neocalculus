<script lang="ts">
	interface Props {
		fn: (x: number) => number;
		domain?: [number, number];
		range?: [number, number];
		tangentAt?: number;
		areaFrom?: number;
		areaTo?: number;
		secondFn?: (x: number) => number;
		caption?: string;
		width?: number;
		height?: number;
		class?: string;
	}

	let {
		fn,
		domain = [-5, 5],
		range,
		tangentAt,
		areaFrom,
		areaTo,
		secondFn,
		caption,
		width = 380,
		height = 220,
		class: className = ''
	}: Props = $props();

	const PL = 32,
		PR = 12,
		PT = 12,
		PB = 22;
	const pW = width - PL - PR;
	const pH = height - PT - PB;

	let computedRange = $derived.by(() => {
		if (range) return range;
		let yMin = Infinity,
			yMax = -Infinity;
		for (let i = 0; i <= 200; i++) {
			const x = domain[0] + ((domain[1] - domain[0]) * i) / 200;
			const y = fn(x);
			if (isFinite(y)) {
				yMin = Math.min(yMin, y);
				yMax = Math.max(yMax, y);
			}
		}
		const pad = Math.max((yMax - yMin) * 0.12, 0.5);
		return [yMin - pad, yMax + pad] as [number, number];
	});

	function tx(x: number) {
		return PL + ((x - domain[0]) / (domain[1] - domain[0])) * pW;
	}
	function ty(y: number) {
		return PT + pH - ((y - computedRange[0]) / (computedRange[1] - computedRange[0])) * pH;
	}

	function makePath(f: (x: number) => number): string {
		const pts: string[] = [];
		const N = 250;
		for (let i = 0; i <= N; i++) {
			const x = domain[0] + ((domain[1] - domain[0]) * i) / N;
			const y = f(x);
			if (!isFinite(y)) continue;
			const sy = ty(y);
			if (sy < PT - 10 || sy > height - PB + 10) continue;
			pts.push(`${pts.length === 0 ? 'M' : 'L'}${tx(x).toFixed(1)},${sy.toFixed(1)}`);
		}
		return pts.join('');
	}

	let curvePath = $derived(makePath(fn));
	let secondPath = $derived(secondFn ? makePath(secondFn) : '');

	let tangent = $derived.by(() => {
		if (tangentAt === undefined) return null;
		const x0 = tangentAt;
		const y0 = fn(x0);
		const h = 1e-5;
		const slope = (fn(x0 + h) - fn(x0 - h)) / (2 * h);
		const dx = (domain[1] - domain[0]) * 0.25;
		return {
			x1: tx(x0 - dx),
			y1: ty(y0 - slope * dx),
			x2: tx(x0 + dx),
			y2: ty(y0 + slope * dx),
			px: tx(x0),
			py: ty(y0)
		};
	});

	let areaD = $derived.by(() => {
		if (areaFrom === undefined || areaTo === undefined) return '';
		const N = 150;
		let d = `M${tx(areaFrom).toFixed(1)},${ty(0).toFixed(1)}`;
		for (let i = 0; i <= N; i++) {
			const x = areaFrom + ((areaTo - areaFrom) * i) / N;
			d += `L${tx(x).toFixed(1)},${ty(fn(x)).toFixed(1)}`;
		}
		d += `L${tx(areaTo).toFixed(1)},${ty(0).toFixed(1)}Z`;
		return d;
	});

	/* axis ticks */
	function niceStep(range: number): number {
		const raw = range / 5;
		const mag = Math.pow(10, Math.floor(Math.log10(raw)));
		const n = raw / mag;
		if (n < 1.5) return mag;
		if (n < 3.5) return 2 * mag;
		if (n < 7.5) return 5 * mag;
		return 10 * mag;
	}

	let xTicks = $derived.by(() => {
		const step = niceStep(domain[1] - domain[0]);
		const ticks: number[] = [];
		let t = Math.ceil(domain[0] / step) * step;
		while (t <= domain[1]) {
			ticks.push(t);
			t += step;
		}
		return ticks;
	});

	let yTicks = $derived.by(() => {
		const step = niceStep(computedRange[1] - computedRange[0]);
		const ticks: number[] = [];
		let t = Math.ceil(computedRange[0] / step) * step;
		while (t <= computedRange[1]) {
			ticks.push(t);
			t += step;
		}
		return ticks;
	});
</script>

<figure class="neo-figure inline-plot {className}">
	<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
		<!-- grid -->
		{#each xTicks as xt}
			<line x1={tx(xt)} y1={PT} x2={tx(xt)} y2={height - PB} stroke="#eee9e0" stroke-width="0.7" />
			<text x={tx(xt)} y={height - PB + 14} text-anchor="middle" font-size="9" font-family="var(--font-sans)" fill="#aaa">{xt}</text>
		{/each}
		{#each yTicks as yt}
			<line x1={PL} y1={ty(yt)} x2={width - PR} y2={ty(yt)} stroke="#eee9e0" stroke-width="0.7" />
			<text x={PL - 5} y={ty(yt) + 3} text-anchor="end" font-size="9" font-family="var(--font-sans)" fill="#aaa">{yt}</text>
		{/each}

		<!-- axes -->
		{#if domain[0] <= 0 && domain[1] >= 0}
			<line x1={tx(0)} y1={PT} x2={tx(0)} y2={height - PB} stroke="#ccc8bf" stroke-width="1" />
		{/if}
		{#if computedRange[0] <= 0 && computedRange[1] >= 0}
			<line x1={PL} y1={ty(0)} x2={width - PR} y2={ty(0)} stroke="#ccc8bf" stroke-width="1" />
		{/if}

		<!-- area -->
		{#if areaD}
			<path d={areaD} fill="rgba(168,85,247,0.12)" stroke="none" />
		{/if}

		<!-- second function -->
		{#if secondPath}
			<path d={secondPath} fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,4" />
		{/if}

		<!-- curve -->
		<path d={curvePath} fill="none" stroke="var(--color-ink)" stroke-width="2" />

		<!-- tangent -->
		{#if tangent}
			<line x1={tangent.x1} y1={tangent.y1} x2={tangent.x2} y2={tangent.y2} stroke="var(--color-d)" stroke-width="1.8" stroke-dasharray="6,4" />
			<circle cx={tangent.px} cy={tangent.py} r="4" fill="var(--color-d)" />
			<circle cx={tangent.px} cy={tangent.py} r="2" fill="white" />
		{/if}
	</svg>
	{#if caption}<figcaption>{caption}</figcaption>{/if}
</figure>
