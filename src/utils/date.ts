/**
 * 统一用 UTC 格式化，避免构建机器时区不同导致日期漂移。
 * pubDate 在 frontmatter 中不带时区时会被解析为 UTC 零点。
 */
export function formatDate(date: Date, options: { month: 'short' | 'long' } = { month: 'short' }): string {
	return date.toLocaleDateString('en-us', {
		year: 'numeric',
		month: options.month,
		day: 'numeric',
		timeZone: 'UTC',
	});
}
