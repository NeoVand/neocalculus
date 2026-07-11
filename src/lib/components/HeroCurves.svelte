<div class="curve-field" aria-hidden="true">
	<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
		<defs>
			<linearGradient id="hero-curve-blue" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" stop-color="var(--plot-curve)" stop-opacity="0" />
				<stop offset="0.18" stop-color="var(--plot-curve)" stop-opacity="0.3" />
				<stop offset="0.72" stop-color="var(--plot-curve)" stop-opacity="0.2" />
				<stop offset="1" stop-color="var(--plot-curve)" stop-opacity="0" />
			</linearGradient>
			<linearGradient id="hero-curve-violet" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" stop-color="var(--plot-tangent)" stop-opacity="0" />
				<stop offset="0.24" stop-color="var(--plot-tangent)" stop-opacity="0.26" />
				<stop offset="0.76" stop-color="var(--plot-tangent)" stop-opacity="0.2" />
				<stop offset="1" stop-color="var(--plot-tangent)" stop-opacity="0" />
			</linearGradient>
			<radialGradient id="hero-point-glow">
				<stop offset="0" stop-color="var(--plot-point)" stop-opacity="0.42" />
				<stop offset="1" stop-color="var(--plot-point)" stop-opacity="0" />
			</radialGradient>
			<linearGradient id="hero-field-fade" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="white" stop-opacity="0.74" />
				<stop offset="0.62" stop-color="white" stop-opacity="0.9" />
				<stop offset="0.88" stop-color="white" stop-opacity="0.24" />
				<stop offset="1" stop-color="white" stop-opacity="0" />
			</linearGradient>
			<mask id="hero-field-mask">
				<rect width="1440" height="900" fill="url(#hero-field-fade)" />
			</mask>
			<filter id="hero-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
				<feGaussianBlur stdDeviation="13" />
			</filter>
		</defs>

		<g class="curve-composition" mask="url(#hero-field-mask)">
			<g class="drift drift-one">
				<path
					class="curve curve-primary"
					d="M-160 295 C 90 86 330 108 530 238 S 920 430 1110 216 S 1450 70 1600 205"
				/>
				<path
					class="curve curve-echo"
					d="M-160 333 C 88 122 327 145 526 274 S 918 465 1109 251 S 1452 105 1600 240"
				/>
				<g class="curve-traveler">
					<animateMotion
						dur="26s"
						repeatCount="indefinite"
						path="M-160 295 C 90 86 330 108 530 238 S 920 430 1110 216 S 1450 70 1600 205"
					/>
					<circle class="point-glow" r="28" />
					<circle class="curve-point" r="4" />
				</g>
			</g>

			<g class="drift drift-two">
				<path
					class="curve curve-secondary"
					d="M-120 90 C 190 356 430 385 650 183 S 1055 -5 1240 182 S 1502 390 1600 320"
				/>
				<path
					class="curve curve-faint"
					d="M-110 510 C 160 336 414 354 622 505 S 1008 684 1216 493 S 1510 303 1600 372"
				/>
			</g>

		</g>
	</svg>
</div>

<style>
	.curve-field {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
		opacity: 0.92;
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.curve {
		fill: none;
		vector-effect: non-scaling-stroke;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.curve-primary {
		stroke: url(#hero-curve-blue);
		stroke-width: 2.2;
	}

	.curve-echo {
		stroke: url(#hero-curve-violet);
		stroke-width: 1;
		stroke-dasharray: 2 10;
		opacity: 0.7;
	}

	.curve-secondary {
		stroke: url(#hero-curve-violet);
		stroke-width: 1.55;
		opacity: 0.68;
	}

	.curve-faint {
		stroke: url(#hero-curve-blue);
		stroke-width: 1.1;
		opacity: 0.42;
	}

	.drift-one {
		animation: drift-one 18s ease-in-out infinite alternate;
	}

	.drift-two {
		animation: drift-two 24s ease-in-out infinite alternate;
	}

	.point-glow {
		fill: url(#hero-point-glow);
		filter: url(#hero-soft-glow);
	}

	.curve-point {
		fill: var(--plot-point);
		opacity: 0.64;
	}

	@keyframes drift-one {
		from {
			transform: translate3d(-1.2%, -0.7%, 0) scale(1.01);
		}
		to {
			transform: translate3d(1.3%, 0.9%, 0) scale(1.018);
		}
	}

	@keyframes drift-two {
		from {
			transform: translate3d(1.1%, 0.4%, 0);
		}
		to {
			transform: translate3d(-1.4%, -0.8%, 0);
		}
	}

	@media (max-width: 760px) {
		.curve-field {
			opacity: 0.7;
		}

		.curve-faint {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.drift-one,
		.drift-two {
			animation: none;
		}

		.curve-traveler {
			display: none;
		}
	}

	@media print {
		.curve-field {
			display: none;
		}
	}
</style>
