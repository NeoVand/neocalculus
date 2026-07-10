<svg
	viewBox="0 0 690 210"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	style="max-width: 690px; width: 100%;"
	role="img"
	aria-labelledby="smoothness-title smoothness-description"
>
	<title id="smoothness-title">Smooth curve, corner, and jump comparison</title>
	<desc id="smoothness-description">
		Three panels compare a parabola with a tangent, an absolute-value graph with a corner, and a
		step function with a jump.
	</desc>

	<g>
		<rect x="6" y="6" width="210" height="198" rx="10" fill="white" stroke="#e5e1d8" />
		<text x="111" y="25" text-anchor="middle" class="panel-title">SMOOTH</text>
		<line x1="22" y1="152" x2="200" y2="152" class="axis" />
		<line x1="111" y1="32" x2="111" y2="192" class="axis" />
		<polyline
			points="23,31 30,50 38,68 45,84 52,98 60,111 67,122 74,131 82,139 89,144 96,149 104,151 111,152 118,151 126,149 133,144 140,139 148,131 155,122 162,111 170,98 177,84 184,68 192,50 199,31"
			class="graph"
		/>
		<line x1="123" y1="162" x2="179" y2="92" class="tangent" />
		<circle cx="151" cy="127" r="3" fill="#a855f7" />
		<text x="111" y="190" text-anchor="middle" class="formula">f(x) = x²</text>
	</g>

	<g>
		<rect x="240" y="6" width="210" height="198" rx="10" fill="white" stroke="#e5e1d8" />
		<text x="345" y="25" text-anchor="middle" class="panel-title">CORNER</text>
		<line x1="256" y1="152" x2="434" y2="152" class="axis" />
		<line x1="345" y1="32" x2="345" y2="192" class="axis" />
		<line x1="265" y1="72" x2="345" y2="152" class="graph" />
		<line x1="345" y1="152" x2="425" y2="72" class="graph" />
		<circle cx="345" cy="152" r="3.5" fill="#a855f7" />
		<line x1="308" y1="180" x2="345" y2="152" class="tangent faint" />
		<line x1="345" y1="152" x2="382" y2="180" class="tangent faint" />
		<text x="345" y="190" text-anchor="middle" class="formula">f(x) = |x|</text>
	</g>

	<g>
		<rect x="474" y="6" width="210" height="198" rx="10" fill="white" stroke="#e5e1d8" />
		<text x="579" y="25" text-anchor="middle" class="panel-title">JUMP</text>
		<line x1="490" y1="132" x2="668" y2="132" class="axis" />
		<line x1="579" y1="32" x2="579" y2="192" class="axis" />
		<line x1="496" y1="132" x2="579" y2="132" class="graph" />
		<line x1="579" y1="72" x2="662" y2="72" class="graph" />
		<line x1="579" y1="132" x2="579" y2="72" class="tangent faint" />
		<circle cx="579" cy="132" r="3.5" fill="white" stroke="#1a1a2e" stroke-width="1.5" />
		<circle cx="579" cy="72" r="3.5" fill="#1a1a2e" />
		<text x="579" y="190" text-anchor="middle" class="formula">step function</text>
	</g>
</svg>

<style>
	.panel-title {
		font-family: var(--font-sans);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.04em;
		fill: #a855f7;
	}

	.axis {
		stroke: #d4d0c8;
		stroke-width: 0.6;
	}

	.graph {
		fill: none;
		stroke: #1a1a2e;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.tangent {
		stroke: #a855f7;
		stroke-width: 1.5;
		stroke-dasharray: 5 3;
	}

	.faint {
		opacity: 0.7;
	}

	.formula {
		font-family: var(--font-mono);
		font-size: 10px;
		fill: #1a1a2e;
	}
</style>
