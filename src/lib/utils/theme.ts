export const THEME_CHANGE_EVENT = 'neocalculus-themechange';

export type PlotTheme = {
	background: string;
	grid: string;
	axis: string;
	ink: string;
	muted: string;
	outline: string;
	violet: string;
	blue: string;
	teal: string;
	amber: string;
	rose: string;
};

export function getPlotTheme(): PlotTheme {
	const styles = getComputedStyle(document.documentElement);
	const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;

	return {
		background: read('--plot-background', '#fdfbf7'),
		grid: read('--plot-grid', '#f0ece4'),
		axis: read('--plot-axis', '#d4d0c8'),
		ink: read('--plot-ink', '#1a1a2e'),
		muted: read('--plot-muted', '#77716a'),
		outline: read('--plot-outline', '#ffffff'),
		violet: read('--plot-violet', '#a855f7'),
		blue: read('--plot-blue', '#2563eb'),
		teal: read('--plot-teal', '#059669'),
		amber: read('--plot-amber', '#d97706'),
		rose: read('--plot-rose', '#ef4444')
	};
}
