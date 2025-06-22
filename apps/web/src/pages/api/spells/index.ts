import type { APIRoute } from 'astro';
import type { APIQueryParams } from '../../../../types';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const searchParams = new URL(request.url).searchParams as unknown as Record<
      string,
      string | null
    >;
    const { domain, skip, take } = searchParams;

    const spells = await getSpells({
      domain: Boolean(domain),
      skip: parseStringToNumber(skip, 0),
      take: parseStringToNumber(take, 10),
    });

    return new Response(JSON.stringify(spells));
  } catch (e: any) {
    return new Response(null, {
      status: 500,
      statusText: e.message,
    });
  }
};

function parseStringToNumber(value: string | null, fallback: number) {
  return !isNaN(Number(value)) ? Number(value) : fallback;
}

async function getSpells({ domain = false, skip, take }: APIQueryParams) {
  try {
    const searchURL = '/spells'.concat(parseQueryURL({ domain, skip, take }));
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

function parseQueryURL({ domain = false, skip, take }: APIQueryParams) {
  const skipParam = skip ? `skip=${skip}` : '';
  const takeParam = take ? `take=${take}` : '';
  const domainParam = `domain=${domain}`;

  const queryString = `?${domainParam}${skipParam}${takeParam}`;

  return queryString;
}
