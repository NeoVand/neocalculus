const LOCAL_CSS_HREF = '/jsxgraph.css';
const LOCAL_SCRIPT_SRC = '/vendor/jsxgraphcore.js';
const CDN_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/jsxgraph@1.12.2/distrib/jsxgraphcore.js';

type JXGGlobal = {
	JSXGraph: {
		initBoard: (containerId: string, options: Record<string, unknown>) => any;
		freeBoard: (board: any) => void;
	};
};

let pendingLoad: Promise<JXGGlobal> | null = null;

function getGlobalJXG(): JXGGlobal | null {
	if (typeof window === 'undefined') {
		return null;
	}

	const maybe = (window as typeof window & { JXG?: JXGGlobal }).JXG;
	if (!maybe?.JSXGraph) {
		return null;
	}

	return maybe;
}

function ensureCssLoaded() {
	if (typeof document === 'undefined') {
		return;
	}

	if (document.querySelector('link[data-jsxgraph-css]')) {
		return;
	}

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = LOCAL_CSS_HREF;
	link.setAttribute('data-jsxgraph-css', '');
	document.head.appendChild(link);
}

function loadScript(src: string, markerAttr: string): Promise<void> {
	if (typeof document === 'undefined') {
		return Promise.reject(new Error('JSXGraph script loading requires a browser document.'));
	}

	const existing = document.querySelector<HTMLScriptElement>(`script[${markerAttr}]`);
	if (existing) {
		if (existing.getAttribute('data-loaded') === 'true') {
			return Promise.resolve();
		}

		if (existing.getAttribute('data-failed') === 'true') {
			return Promise.reject(new Error(`JSXGraph script already failed: ${src}`));
		}

		return new Promise((resolve, reject) => {
			const onLoad = () => resolve();
			const onError = () => reject(new Error(`Failed to load JSXGraph script: ${src}`));
			existing.addEventListener('load', onLoad, { once: true });
			existing.addEventListener('error', onError, { once: true });
		});
	}

	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = src;
		script.async = true;
		script.defer = true;
		script.setAttribute(markerAttr, '');

		script.addEventListener(
			'load',
			() => {
				script.setAttribute('data-loaded', 'true');
				resolve();
			},
			{ once: true }
		);

		script.addEventListener(
			'error',
			() => {
				script.setAttribute('data-failed', 'true');
				reject(new Error(`Failed to load JSXGraph script: ${src}`));
			},
			{ once: true }
		);

		document.head.appendChild(script);
	});
}

export async function ensureJSXGraph(): Promise<JXGGlobal> {
	const cached = getGlobalJXG();
	if (cached) {
		return cached;
	}

	if (typeof window === 'undefined') {
		throw new Error('JSXGraph can only be loaded in the browser.');
	}

	ensureCssLoaded();

	if (!pendingLoad) {
		pendingLoad = (async () => {
			try {
				await loadScript(LOCAL_SCRIPT_SRC, 'data-jsxgraph-core-local');
			} catch {
				await loadScript(CDN_SCRIPT_SRC, 'data-jsxgraph-core-cdn');
			}

			const loaded = getGlobalJXG();
			if (!loaded) {
				throw new Error('JSXGraph script loaded but window.JXG is unavailable.');
			}

			return loaded;
		})().catch((error) => {
			pendingLoad = null;
			throw error;
		});
	}

	return pendingLoad;
}
