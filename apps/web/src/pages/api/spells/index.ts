import type { APIRoute } from 'astro';
import { actions } from 'astro:actions';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const { domain, take, skip } = Object.fromEntries(url.searchParams);

  const spells = await actions.getSpells({
    domain: domain === 'true',
    take: Number(take),
    skip: Number(skip),
    value: '/spells',
  });

  console.log(spells);

  return new Response(JSON.stringify(spells));
};
