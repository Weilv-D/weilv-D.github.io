// 基于群青/烟栗/冷金的优雅色系
export const ELEGANT_COLORS = [
	['#2E5090', '#3d62a8'], // 群青渐变
	['#6B5B4F', '#7d6d60'], // 烟栗渐变
	['#B89B6C', '#c9ac7d'], // 冷金渐变
];

export function hashCode(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash);
}

export function getCoverColors(title: string): { colorPair: string[]; hash: number } {
	const hash = hashCode(title);
	const pairIndex = hash % ELEGANT_COLORS.length;
	return {
		hash,
		colorPair: ELEGANT_COLORS[pairIndex],
	};
}

export function resolveImagePath(image: string | undefined, baseUrl: string): string | undefined {
	if (!image) return undefined;
	return image.startsWith('/') ? baseUrl + image.slice(1) : image;
}
