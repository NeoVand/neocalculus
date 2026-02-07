/**
 * Dual Number arithmetic: a + b·d where d² = 0.
 *
 * This is the computational heart of Neocalculus.
 * It is mathematically identical to the Kock-Lawvere axiom:
 * every function on the infinitesimals is affine.
 *
 * To compute f'(x), evaluate f(Dual.variable(x)).
 * The .inf property gives f'(x).
 */
export class Dual {
	constructor(
		public readonly real: number,
		public readonly inf: number = 0
	) {}

	/** A constant (no infinitesimal part). */
	static of(x: number): Dual {
		return new Dual(x, 0);
	}

	/** A variable x + d (infinitesimal part = 1). */
	static variable(x: number): Dual {
		return new Dual(x, 1);
	}

	add(other: Dual | number): Dual {
		const o = typeof other === 'number' ? Dual.of(other) : other;
		return new Dual(this.real + o.real, this.inf + o.inf);
	}

	sub(other: Dual | number): Dual {
		const o = typeof other === 'number' ? Dual.of(other) : other;
		return new Dual(this.real - o.real, this.inf - o.inf);
	}

	mul(other: Dual | number): Dual {
		const o = typeof other === 'number' ? Dual.of(other) : other;
		// (a + b·d)(c + e·d) = ac + (ae + bc)·d
		// The b·e·d² term vanishes — THIS is d² = 0 in code.
		return new Dual(this.real * o.real, this.real * o.inf + this.inf * o.real);
	}

	div(other: Dual | number): Dual {
		const o = typeof other === 'number' ? Dual.of(other) : other;
		const c = o.real;
		return new Dual(this.real / c, (this.inf * c - this.real * o.inf) / (c * c));
	}

	neg(): Dual {
		return new Dual(-this.real, -this.inf);
	}

	/** Raise to a constant power n. For variable exponents, use powDual(). */
	pow(n: number): Dual {
		return new Dual(Math.pow(this.real, n), n * Math.pow(this.real, n - 1) * this.inf);
	}

	/** Raise to a Dual power: x^y = e^(y·ln(x)). Handles x^x and similar. */
	powDual(exponent: Dual): Dual {
		// x^y = e^(y * ln(x))
		return exponent.mul(this.log()).exp();
	}

	sqrt(): Dual {
		const s = Math.sqrt(this.real);
		return new Dual(s, this.inf / (2 * s));
	}

	abs(): Dual {
		if (this.real > 0) return new Dual(this.real, this.inf);
		if (this.real < 0) return new Dual(-this.real, -this.inf);
		// At real = 0, abs is not differentiable; return 0
		return new Dual(0, 0);
	}

	// ─── Trigonometric ────────────────────────────

	sin(): Dual {
		return new Dual(Math.sin(this.real), Math.cos(this.real) * this.inf);
	}

	cos(): Dual {
		return new Dual(Math.cos(this.real), -Math.sin(this.real) * this.inf);
	}

	tan(): Dual {
		const c = Math.cos(this.real);
		return new Dual(Math.tan(this.real), this.inf / (c * c));
	}

	// ─── Inverse trigonometric ────────────────────

	asin(): Dual {
		// d/dx asin(x) = 1 / sqrt(1 - x²)
		return new Dual(Math.asin(this.real), this.inf / Math.sqrt(1 - this.real * this.real));
	}

	acos(): Dual {
		// d/dx acos(x) = -1 / sqrt(1 - x²)
		return new Dual(Math.acos(this.real), -this.inf / Math.sqrt(1 - this.real * this.real));
	}

	atan(): Dual {
		// d/dx atan(x) = 1 / (1 + x²)
		return new Dual(Math.atan(this.real), this.inf / (1 + this.real * this.real));
	}

	// ─── Hyperbolic ──────────────────────────────

	sinh(): Dual {
		// d/dx sinh(x) = cosh(x)
		return new Dual(Math.sinh(this.real), Math.cosh(this.real) * this.inf);
	}

	cosh(): Dual {
		// d/dx cosh(x) = sinh(x)
		return new Dual(Math.cosh(this.real), Math.sinh(this.real) * this.inf);
	}

	tanh(): Dual {
		// d/dx tanh(x) = 1 / cosh²(x) = sech²(x)
		const c = Math.cosh(this.real);
		return new Dual(Math.tanh(this.real), this.inf / (c * c));
	}

	// ─── Exponential & Logarithmic ───────────────

	exp(): Dual {
		const e = Math.exp(this.real);
		return new Dual(e, e * this.inf);
	}

	log(): Dual {
		return new Dual(Math.log(this.real), this.inf / this.real);
	}
}

/**
 * Compute the derivative of f at x using dual number arithmetic.
 *
 * @example
 * // derivative of x³ at x = 2
 * differentiate(d => d.pow(3), 2) // → 12
 */
export function differentiate(f: (x: Dual) => Dual, x: number): number {
	return f(Dual.variable(x)).inf;
}

// ═══════════════════════════════════════════════════
// Dual2 — Two independent infinitesimals for D(2)
// Represents a + b·d₁ + c·d₂ where d₁²=d₂²=d₁d₂=0
// Used for partial derivatives (Ch9)
// ═══════════════════════════════════════════════════

/**
 * Dual2: Numbers with two independent infinitesimals d₁ and d₂,
 * where d₁² = d₂² = d₁·d₂ = 0.
 *
 * This implements D(2) — the "infinitesimal cross" — used for
 * computing partial derivatives of functions of two variables.
 */
export class Dual2 {
	constructor(
		public readonly real: number,
		public readonly inf1: number = 0,
		public readonly inf2: number = 0
	) {}

	static of(x: number): Dual2 {
		return new Dual2(x, 0, 0);
	}

	/** Variable in the first direction: x + d₁ */
	static var1(x: number): Dual2 {
		return new Dual2(x, 1, 0);
	}

	/** Variable in the second direction: x + d₂ */
	static var2(x: number): Dual2 {
		return new Dual2(x, 0, 1);
	}

	add(other: Dual2 | number): Dual2 {
		const o = typeof other === 'number' ? Dual2.of(other) : other;
		return new Dual2(this.real + o.real, this.inf1 + o.inf1, this.inf2 + o.inf2);
	}

	sub(other: Dual2 | number): Dual2 {
		const o = typeof other === 'number' ? Dual2.of(other) : other;
		return new Dual2(this.real - o.real, this.inf1 - o.inf1, this.inf2 - o.inf2);
	}

	mul(other: Dual2 | number): Dual2 {
		const o = typeof other === 'number' ? Dual2.of(other) : other;
		// (a + b·d₁ + c·d₂)(e + f·d₁ + g·d₂)
		// = ae + (af + be)·d₁ + (ag + ce)·d₂
		// All d₁², d₂², d₁d₂ terms vanish in D(2)
		return new Dual2(
			this.real * o.real,
			this.real * o.inf1 + this.inf1 * o.real,
			this.real * o.inf2 + this.inf2 * o.real
		);
	}

	div(other: Dual2 | number): Dual2 {
		const o = typeof other === 'number' ? Dual2.of(other) : other;
		const c = o.real;
		const c2 = c * c;
		return new Dual2(
			this.real / c,
			(this.inf1 * c - this.real * o.inf1) / c2,
			(this.inf2 * c - this.real * o.inf2) / c2
		);
	}

	neg(): Dual2 {
		return new Dual2(-this.real, -this.inf1, -this.inf2);
	}

	pow(n: number): Dual2 {
		const rn = Math.pow(this.real, n);
		const drn = n * Math.pow(this.real, n - 1);
		return new Dual2(rn, drn * this.inf1, drn * this.inf2);
	}

	sqrt(): Dual2 {
		const s = Math.sqrt(this.real);
		const ds = 1 / (2 * s);
		return new Dual2(s, ds * this.inf1, ds * this.inf2);
	}

	sin(): Dual2 {
		const c = Math.cos(this.real);
		return new Dual2(Math.sin(this.real), c * this.inf1, c * this.inf2);
	}

	cos(): Dual2 {
		const s = -Math.sin(this.real);
		return new Dual2(Math.cos(this.real), s * this.inf1, s * this.inf2);
	}

	tan(): Dual2 {
		const c = Math.cos(this.real);
		const sec2 = 1 / (c * c);
		return new Dual2(Math.tan(this.real), sec2 * this.inf1, sec2 * this.inf2);
	}

	exp(): Dual2 {
		const e = Math.exp(this.real);
		return new Dual2(e, e * this.inf1, e * this.inf2);
	}

	log(): Dual2 {
		const d = 1 / this.real;
		return new Dual2(Math.log(this.real), d * this.inf1, d * this.inf2);
	}
}

/**
 * Compute the gradient of f(x, y) at the given point.
 *
 * @example
 * // gradient of f(x,y) = x²y at (3, 2)
 * gradient((x, y) => x.pow(2).mul(y), 3, 2) // → [12, 9]
 */
export function gradient(
	f: (x: Dual2, y: Dual2) => Dual2,
	x: number,
	y: number
): [number, number] {
	// Partial with respect to x: set d₁ direction on x
	const fx = f(Dual2.var1(x), Dual2.of(y));
	// Partial with respect to y: set d₂ direction on y
	const fy = f(Dual2.of(x), Dual2.var2(y));
	return [fx.inf1, fy.inf2];
}

/**
 * Compute the 2×2 Jacobian matrix of a vector-valued function
 * F(x,y) = (f₁(x,y), f₂(x,y)) at the given point.
 *
 * @returns [[∂f₁/∂x, ∂f₁/∂y], [∂f₂/∂x, ∂f₂/∂y]]
 */
export function jacobian2x2(
	f1: (x: Dual2, y: Dual2) => Dual2,
	f2: (x: Dual2, y: Dual2) => Dual2,
	x: number,
	y: number
): [[number, number], [number, number]] {
	// Evaluate both component functions with d₁ on x and d₂ on y
	const xd = Dual2.var1(x);
	const yd = Dual2.var2(y);
	const r1 = f1(xd, yd);
	const r2 = f2(xd, yd);
	return [
		[r1.inf1, r1.inf2],
		[r2.inf1, r2.inf2]
	];
}

// ═══════════════════════════════════════════════════
// HigherDual — Two nilsquare infinitesimals whose
// product is NOT zero, for second derivatives.
// Represents a + b·d₁ + c·d₂ + e·d₁d₂
// where d₁²=d₂²=0 but d₁d₂ ≠ 0
// Used for Taylor polynomials (Ch7) and second derivatives
// ═══════════════════════════════════════════════════

/**
 * HigherDual: Numbers with two nilsquare infinitesimals d₁, d₂
 * where d₁² = d₂² = 0 but d₁·d₂ ≠ 0.
 *
 * The coefficient of d₁·d₂ in f(x + d₁ + d₂) gives f''(x)
 * (from the exact infinitesimal Taylor formula).
 *
 * Structure: a + b·d₁ + c·d₂ + e·d₁d₂
 */
export class HigherDual {
	constructor(
		public readonly real: number,
		public readonly d1: number = 0,
		public readonly d2: number = 0,
		public readonly d1d2: number = 0
	) {}

	static of(x: number): HigherDual {
		return new HigherDual(x, 0, 0, 0);
	}

	/**
	 * Create x + d₁ + d₂ for computing both f'(x) and f''(x).
	 * After evaluating f(variable(x)):
	 * - .d1 (or .d2) gives f'(x)
	 * - .d1d2 gives f''(x)
	 */
	static variable(x: number): HigherDual {
		return new HigherDual(x, 1, 1, 0);
	}

	/** Create x + d₁ only */
	static withD1(x: number): HigherDual {
		return new HigherDual(x, 1, 0, 0);
	}

	/** Create x + d₂ only */
	static withD2(x: number): HigherDual {
		return new HigherDual(x, 0, 1, 0);
	}

	add(other: HigherDual | number): HigherDual {
		const o = typeof other === 'number' ? HigherDual.of(other) : other;
		return new HigherDual(
			this.real + o.real,
			this.d1 + o.d1,
			this.d2 + o.d2,
			this.d1d2 + o.d1d2
		);
	}

	sub(other: HigherDual | number): HigherDual {
		const o = typeof other === 'number' ? HigherDual.of(other) : other;
		return new HigherDual(
			this.real - o.real,
			this.d1 - o.d1,
			this.d2 - o.d2,
			this.d1d2 - o.d1d2
		);
	}

	mul(other: HigherDual | number): HigherDual {
		const o = typeof other === 'number' ? HigherDual.of(other) : other;
		// (a + b·d₁ + c·d₂ + e·d₁d₂)(p + q·d₁ + r·d₂ + s·d₁d₂)
		// real: a·p
		// d₁:   a·q + b·p
		// d₂:   a·r + c·p
		// d₁d₂: a·s + e·p + b·r + c·q
		// (d₁² = d₂² = 0, so b·q·d₁² and c·r·d₂² vanish)
		// (d₁d₂·d₁ = 0, d₁d₂·d₂ = 0, d₁d₂·d₁d₂ = 0 — all higher vanish)
		return new HigherDual(
			this.real * o.real,
			this.real * o.d1 + this.d1 * o.real,
			this.real * o.d2 + this.d2 * o.real,
			this.real * o.d1d2 + this.d1d2 * o.real + this.d1 * o.d2 + this.d2 * o.d1
		);
	}

	div(other: HigherDual | number): HigherDual {
		const o = typeof other === 'number' ? HigherDual.of(other) : other;
		const p = o.real;
		const p2 = p * p;
		const p3 = p2 * p;

		const realPart = this.real / p;
		const d1Part = (this.d1 * p - this.real * o.d1) / p2;
		const d2Part = (this.d2 * p - this.real * o.d2) / p2;
		const d1d2Part =
			(this.d1d2 * p - this.real * o.d1d2 - this.d1 * o.d2 - this.d2 * o.d1) / p2 +
			(2 * this.real * o.d1 * o.d2) / p3;

		return new HigherDual(realPart, d1Part, d2Part, d1d2Part);
	}

	neg(): HigherDual {
		return new HigherDual(-this.real, -this.d1, -this.d2, -this.d1d2);
	}

	pow(n: number): HigherDual {
		const r = this.real;
		const rn = Math.pow(r, n);
		const drn = n * Math.pow(r, n - 1);
		const ddrn = n * (n - 1) * Math.pow(r, n - 2);
		return new HigherDual(
			rn,
			drn * this.d1,
			drn * this.d2,
			drn * this.d1d2 + ddrn * this.d1 * this.d2
		);
	}

	sqrt(): HigherDual {
		const s = Math.sqrt(this.real);
		const ds = 1 / (2 * s);
		const dds = -1 / (4 * this.real * s);
		return new HigherDual(
			s,
			ds * this.d1,
			ds * this.d2,
			ds * this.d1d2 + dds * this.d1 * this.d2
		);
	}

	sin(): HigherDual {
		const sv = Math.sin(this.real);
		const cv = Math.cos(this.real);
		return new HigherDual(
			sv,
			cv * this.d1,
			cv * this.d2,
			cv * this.d1d2 - sv * this.d1 * this.d2
		);
	}

	cos(): HigherDual {
		const sv = Math.sin(this.real);
		const cv = Math.cos(this.real);
		return new HigherDual(
			cv,
			-sv * this.d1,
			-sv * this.d2,
			-sv * this.d1d2 - cv * this.d1 * this.d2
		);
	}

	tan(): HigherDual {
		const tv = Math.tan(this.real);
		const sec2 = 1 + tv * tv;
		const dsec2 = 2 * tv * sec2;
		return new HigherDual(
			tv,
			sec2 * this.d1,
			sec2 * this.d2,
			sec2 * this.d1d2 + dsec2 * this.d1 * this.d2
		);
	}

	exp(): HigherDual {
		const e = Math.exp(this.real);
		return new HigherDual(
			e,
			e * this.d1,
			e * this.d2,
			e * this.d1d2 + e * this.d1 * this.d2
		);
	}

	log(): HigherDual {
		const r = this.real;
		const dr = 1 / r;
		const ddr = -1 / (r * r);
		return new HigherDual(
			Math.log(r),
			dr * this.d1,
			dr * this.d2,
			dr * this.d1d2 + ddr * this.d1 * this.d2
		);
	}
}

/**
 * Compute f''(x) — the second derivative — using HigherDual arithmetic.
 *
 * Uses the exact infinitesimal Taylor formula:
 * f(x + d₁ + d₂) = f(x) + f'(x)(d₁ + d₂) + f''(x)·d₁d₂
 *
 * @example
 * secondDerivative(d => d.pow(4), 2) // → 48 (= 12·2²)
 */
export function secondDerivative(f: (x: HigherDual) => HigherDual, x: number): number {
	return f(HigherDual.variable(x)).d1d2;
}
