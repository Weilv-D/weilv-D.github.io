import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: '未来回忆录',
		description: 'weilv的时空褶皱 - 技术与生活',
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `${import.meta.env.BASE_URL}blog/${post.slug}/`,
		})),
	});
}
