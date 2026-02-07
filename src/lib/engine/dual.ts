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

	pow(n: number): Dual {
		return new Dual(Math.pow(this.real, n), n * Math.pow(this.real, n - 1) * this.inf);
	}

	sqrt(): Dual {
		const s = Math.sqrt(this.real);
		return new Dual(s, this.inf / (2 * s));
	}

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
