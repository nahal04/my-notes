import { z, defineCollection } from 'astro:content'


const notesCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        createdAt: z.date(),
        lastUpdated: z.date(),
        draft: z.boolean(),
        author: z.string()
    })
})

export const collections = {
    'notes': notesCollection
}