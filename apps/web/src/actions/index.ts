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
  getSpells: defineAction({
    input: z.object({
      value: z.string(),
      skip: z.number().optional(),
      take: z.number().optional(),
      domain: z.boolean().optional().default(false),
    }),
    handler: async ({ value, domain, skip, take }) => {
      const data = await fetch(
        (import.meta.env.API_URL ?? process.env.API_URL).concat(
          value.concat(parseQueryURL({ domain, skip, take }))
        )
      );

      if (!data) return { message: 'No spells found for the parameters found' };

      const spells = await data.json();
      return spells;
    },
  }),
};

interface APIQueryParams {
  domain: boolean;
  skip?: number;
  take?: number;
}

function parseQueryURL({ domain = false, skip, take }: APIQueryParams) {
  const skipParam = skip ? `skip=${skip}` : '';
  const takeParam = take ? `take=${take}` : '';
  const domainParam = `domain=${domain}`;

  const queryString = `?${domainParam}${skipParam}${takeParam}`;

  return queryString;
}
