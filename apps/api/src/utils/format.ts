import { Spell } from '@prisma/client';

export function formatSpell(
  spells: Pick<Spell, 'name' | 'id' | 'domain' | 'level'>[]
) {
  const levels = spells.map((spell) => ({
    id: spell.id,
    level: (spell.level as [string, number][])?.map(([c, l]) => ({ [c]: l })),
  }));

  const results = spells.map((spell) => ({
    ...spell,
    level: levels
      .filter((level) => level.id === spell.id)
      .map((level) => level),
    url: `/api/spells/${spell.id}`,
  }));

  return {
    count: spells.length,
    results,
  };
}
