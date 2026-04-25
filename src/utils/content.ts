import type { CollectionEntry } from 'astro:content';

export function sortByDateDesc(posts: CollectionEntry<'blog'>[]) {
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
