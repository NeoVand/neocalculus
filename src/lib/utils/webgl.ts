export const FULLSCREEN_VERTEX_SHADER = `#version 300 es
	in vec2 aPosition;
	void main() {
		gl_Position = vec4(aPosition, 0.0, 1.0);
	}
`;

export type FullscreenShader = {
	gl: WebGL2RenderingContext;
	program: WebGLProgram;
	uniform: (name: string) => WebGLUniformLocation | null;
	draw: (setUniforms?: (gl: WebGL2RenderingContext) => void) => void;
	destroy: () => void;
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) throw new Error('Unable to create WebGL shader');
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const message = gl.getShaderInfoLog(shader) ?? 'Unknown WebGL shader compilation error';
		gl.deleteShader(shader);
		throw new Error(message);
	}
	return shader;
}

export function createFullscreenShader(
	canvas: HTMLCanvasElement,
	fragmentSource: string,
	options: { pixelRatioCap?: number } = {}
): FullscreenShader | null {
	const gl = canvas.getContext('webgl2', {
		alpha: false,
		antialias: false,
		powerPreference: 'high-performance'
	});
	if (!gl) return null;

	const vertex = compile(gl, gl.VERTEX_SHADER, FULLSCREEN_VERTEX_SHADER);
	const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
	const program = gl.createProgram();
	if (!program) throw new Error('Unable to create WebGL program');
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const message = gl.getProgramInfoLog(program) ?? 'Unable to link WebGL program';
		gl.deleteProgram(program);
		gl.deleteShader(vertex);
		gl.deleteShader(fragment);
		throw new Error(message);
	}
	gl.useProgram(program);

	const buffer = gl.createBuffer();
	if (!buffer) throw new Error('Unable to create WebGL vertex buffer');
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const position = gl.getAttribLocation(program, 'aPosition');
	gl.enableVertexAttribArray(position);
	gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

	const locations = new Map<string, WebGLUniformLocation | null>();
	const uniform = (name: string) => {
		if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
		return locations.get(name) ?? null;
	};
	const resolution = uniform('uResolution');
	const pixelRatioCap = options.pixelRatioCap ?? 2.5;

	return {
		gl,
		program,
		uniform,
		draw(setUniforms) {
			const ratio = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
			const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
			const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
			}
			gl.viewport(0, 0, width, height);
			gl.useProgram(program);
			gl.uniform2f(resolution, width, height);
			setUniforms?.(gl);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},
		destroy() {
			gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
			gl.deleteShader(vertex);
			gl.deleteShader(fragment);
		}
	};
}

export type RenderScheduler = {
	request: () => void;
	destroy: () => void;
};

export function createRenderScheduler(
	canvas: HTMLCanvasElement,
	render: () => void
): RenderScheduler {
	let frame = 0;
	let visible = true;
	let destroyed = false;
	const request = () => {
		if (frame || destroyed || !visible) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			render();
		});
	};
	const resizeObserver = new ResizeObserver(request);
	resizeObserver.observe(canvas);
	const intersectionObserver = new IntersectionObserver(
		(entries) => {
			visible = entries[0]?.isIntersecting ?? true;
			if (visible) request();
		},
		{ rootMargin: '160px' }
	);
	intersectionObserver.observe(canvas);
	request();
	return {
		request,
		destroy() {
			destroyed = true;
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			if (frame) cancelAnimationFrame(frame);
			frame = 0;
		}
	};
}

export function cssColorToRgb(color: string): [number, number, number] {
	const hex = color.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
	if (hex) {
		const value =
			hex[1].length === 3
				? hex[1]
						.split('')
						.map((digit) => digit + digit)
						.join('')
				: hex[1];
		return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255) as [
			number,
			number,
			number
		];
	}
	const rgb = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
	if (rgb) return [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255];
	return [1, 1, 1];
}
