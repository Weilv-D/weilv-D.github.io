import { getCollection } from 'astro:content';

export async function GET(context) {
	const posts = await getCollection('blog');
	return new Response(
		JSON.stringify(
			posts.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				slug: post.slug,
				pubDate: post.data.pubDate,
                category: post.data.category,
                tags: post.data.tags
			}))
		),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
	);
}
