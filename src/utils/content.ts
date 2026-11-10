import type { CollectionEntry } from 'astro:content';

/** 按发布时间倒序返回新数组，不修改入参 */
export function sortByDateDesc(posts: CollectionEntry<'blog'>[]) {
	return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
