export function formatDate(date: Date, options: { month: 'short' | 'long' } = { month: 'short' }): string {
	return date.toLocaleDateString('en-us', {
		year: 'numeric',
		month: options.month,
		day: 'numeric',
	});
}
