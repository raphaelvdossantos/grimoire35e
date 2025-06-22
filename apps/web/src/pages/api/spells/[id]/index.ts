import type { APIRoute } from 'astro';
import type { APIGetParams } from '../../../../../types';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;

    if (!id) {
      return new Response(null, {
        status: 404,
        statusText: 'Not found',
      });
    }

    const spell = await getSpell({ id });

    return new Response(JSON.stringify(spell));
  } catch (e: any) {
    return new Response(null, {
      status: 500,
      statusText: e.message,
    });
  }
};

async function getSpell({ id }: APIGetParams) {
  try {
    const searchURL = '/spells/' + id;
    const data = await fetch(
      (import.meta.env.API_URL ?? process.env.API_URL).concat(searchURL)
    );

    if (!data) return { message: 'No spells found for the parameters found' };

    const spells = await data.json();
    return spells;
  } catch (e) {
    console.log(e);
  }
}
