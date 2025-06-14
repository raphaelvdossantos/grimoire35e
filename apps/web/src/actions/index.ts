import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  getSpell: defineAction({
    input: z.object({
      value: z.string(),
    }),
    handler: async (input) => {
      const data = await fetch(
        'http://localhost:3000/api/'.concat(input.value)
      );
      if (!data) return { message: 'spell not found' };

      const spell = await data.json();
      return spell;
    },
  }),
};
