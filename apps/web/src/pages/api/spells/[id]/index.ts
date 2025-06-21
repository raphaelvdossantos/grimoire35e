import type { APIRoute } from 'astro';
import { actions } from 'astro:actions';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    console.log(id);

    if (!id) {
      return new Response(null, {
        status: 404,
        statusText: 'Not found',
      });
    }

    const spell = await getSpell({ value: id });

    return new Response(JSON.stringify(spell));
  } catch (e: any) {
    console.log('Error from GET Request: ', e);
    return new Response(null, {
      status: 500,
      statusText: e.message,
    });
  }
};

interface APIQueryParams {
  domain?: boolean;
  skip?: number;
  take?: number;
}

async function getSpell({
  value,
  domain = false,
  skip,
  take,
}: APIQueryParams & { value: string }) {
  try {
    const data = await fetch(
      (import.meta.env.API_URL ?? process.env.API_URL).concat(
        value.concat(parseQueryURL({ domain, skip, take }))
      )
    );

    console.log(data);

    if (!data) return { message: 'No spells found for the parameters found' };

    const spells = await data.json();
    return spells;
  } catch (e) {
    console.log(e);
  }
}

function parseQueryURL({ domain = false, skip, take }: APIQueryParams) {
  const skipParam = skip ? `skip=${skip}` : '';
  const takeParam = take ? `take=${take}` : '';
  const domainParam = `domain=${domain}`;

  const queryString = `?${domainParam}${skipParam}${takeParam}`;

  return queryString;
}
