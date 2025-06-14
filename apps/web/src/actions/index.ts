import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  getSpell: defineAction({
    input: z.object({
      value: z.string(),
    }),
    handler: async (input) => {
      const data = await fetch(
        (import.meta.env.API_URL ?? process.env.API_URL).concat(input.value)
      );
      if (!data) return { message: 'spell not found' };

      const spell = await data.json();
      return spell;
    },
  }),
};
