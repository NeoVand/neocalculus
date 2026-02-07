/**
 * Svelte action: fade-in on scroll.
 * Usage: <div use:reveal> or <div use:reveal={{ delay: 200 }}>
 */
export function reveal(node: HTMLElement, options?: { delay?: number; y?: number }) {
	const delay = options?.delay ?? 0;
	const y = options?.y ?? 24;

	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;
	node.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.style.opacity = '1';
					node.style.transform = 'translateY(0)';
					observer.unobserve(node);
				}
			});
		},
		{ threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
