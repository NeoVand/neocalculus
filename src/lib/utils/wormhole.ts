export const WORMHOLE_STACK_EVENT = 'neocalculus:wormhole-stack-changed';
const WORMHOLE_STACK_KEY = 'neocalculus:wormhole-stack';
const MAX_WORMHOLE_ENTRIES = 20;

export interface WormholeEntry {
	y: number;
	hash: string;
	to: string;
	returnLabel: string;
	timestamp: number;
}

function isBrowserEnvironment() {
	return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
}

function emitStackChanged() {
	if (!isBrowserEnvironment()) return;
	window.dispatchEvent(new CustomEvent(WORMHOLE_STACK_EVENT));
}

function parseStack(raw: string | null): WormholeEntry[] {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];

		return parsed
			.filter((item) => typeof item === 'object' && item !== null)
			.map((item) => {
				const record = item as Partial<WormholeEntry>;
				return {
					y: typeof record.y === 'number' ? record.y : 0,
					hash: typeof record.hash === 'string' ? record.hash : '',
					to: typeof record.to === 'string' ? record.to : '',
					returnLabel:
						typeof record.returnLabel === 'string' && record.returnLabel.length > 0
							? record.returnLabel
							: 'previous section',
					timestamp: typeof record.timestamp === 'number' ? record.timestamp : Date.now()
				};
			});
	} catch {
		return [];
	}
}

function saveStack(entries: WormholeEntry[]) {
	if (!isBrowserEnvironment()) return;
	sessionStorage.setItem(WORMHOLE_STACK_KEY, JSON.stringify(entries.slice(-MAX_WORMHOLE_ENTRIES)));
	emitStackChanged();
}

export function getWormholeStack(): WormholeEntry[] {
	if (!isBrowserEnvironment()) return [];
	return parseStack(sessionStorage.getItem(WORMHOLE_STACK_KEY));
}

export function peekWormholeEntry(): WormholeEntry | null {
	const stack = getWormholeStack();
	return stack.length > 0 ? stack[stack.length - 1] : null;
}

export function pushWormholeEntry(entry: Omit<WormholeEntry, 'timestamp'>) {
	if (!isBrowserEnvironment()) return;
	const stack = getWormholeStack();
	stack.push({ ...entry, timestamp: Date.now() });
	saveStack(stack);
}

export function popWormholeEntry(): WormholeEntry | null {
	if (!isBrowserEnvironment()) return null;
	const stack = getWormholeStack();
	if (stack.length === 0) return null;
	const entry = stack.pop() ?? null;
	saveStack(stack);
	return entry;
}

export function clearWormholeStack() {
	if (!isBrowserEnvironment()) return;
	sessionStorage.removeItem(WORMHOLE_STACK_KEY);
	emitStackChanged();
}
