import { defineCollection, z } from 'astro:content';

const prophetStageBlock = z.object({
	type: z.enum(['portrait', 'quote', 'note', 'seal']),
	title: z.string().optional(),
	text: z.string().optional(),
	items: z.array(z.string()).default([]),
	src: z.string().optional(),
	caption: z.string().optional(),
	desktop: z.object({
		x: z.number(),
		y: z.number(),
		w: z.number(),
		h: z.number(),
	}),
	mobile: z.object({
		x: z.number(),
		y: z.number(),
		w: z.number(),
		h: z.number(),
	}).optional(),
	motion: z.object({
		dx: z.number().default(0),
		dy: z.number().default(0),
		speed: z.number().default(1),
	}).optional(),
});

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
        category: z.enum(['Tech', 'Life']).default('Tech'),
        tags: z.array(z.string()).default([]),
        layoutStyle: z.enum(['default', 'prophet']).default('default'),
        edition: z.string().optional(),
        series: z.string().optional(),
        issueNumber: z.number().int().positive().optional(),
        featured: z.boolean().default(false),
        prophet: z.object({
            kicker: z.string().optional(),
            deck: z.string().optional(),
            pullquote: z.string().optional(),
            portraitSrc: z.string().optional(),
            sidebarTitle: z.string().optional(),
            sidebarItems: z.array(z.string()).default([]),
            editorialText: z.string().optional(),
            portraitCaption: z.string().optional(),
            stageBlocks: z.array(prophetStageBlock).default([]),
        }).optional(),
	}),
});

export const collections = { blog };
