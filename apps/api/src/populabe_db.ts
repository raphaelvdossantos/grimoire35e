import { Spell } from '@prisma/client';
import { prisma } from './lib/prisma';

const jsonPath = '../spells.json';

const seedDatabase = async () => {
  try {
    const data = require(jsonPath);

    console.log(`Reading data from ${jsonPath}:`, data);
    if (!data) return;

    const spellsPromises = data.map((spell: Spell) =>
      (async () => {
        const spellId = spell.name.replace(' ', '_').toLocaleLowerCase();
        const createdSpell = await prisma.spell.create({
          data: {
            id: spellId,
            name: spell.name,
            level: spell.level ?? [],
            component: spell.component,
            casting_time: spell.casting_time,
            range: spell.range,
            target_or_area: spell.target_or_area,
            duration: spell.duration,
            saving_throw: spell.saving_throw,
            spell_resistance: spell.spell_resistance,
            domain: spell.domain,
            spell_domain: spell.spell_domain ?? [],
            description: spell.description,
          },
        });
        console.log('Added spell: ', createdSpell.name);
      })()
    );

    await Promise.all(spellsPromises);
  } catch (e) {
    console.error(`Error seeding database from ${jsonPath}:`, e);
  }
};
seedDatabase();
