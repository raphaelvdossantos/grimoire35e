import express, { Request, Response, NextFunction } from 'express';
import { prisma } from './lib/prisma';
import { formatSpell } from './utils/format';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/api/spells', async (req: Request, res: Response) => {
  const { domain, skip, take } = req.query;

  const queryParams: { take: number; skip?: number } = {
    take: Math.min(!Number.isNaN(take) ? Number(take) : 10, 50),
    skip: !Number.isNaN(skip) && Number(skip) > 0 ? Number(skip) : 0,
  };

  const spells = await prisma.spell.findMany({
    where: {
      domain: Boolean(domain),
    },
    select: {
      id: true,
      name: true,
      level: true,
      domain: true,
    },
    ...queryParams,
  });

  res.send(formatSpell(spells));
});

// Example route with types
app.get('/api/spells/:spellName', async (req: Request, res: Response) => {
  const spell = await prisma.spell.findUnique({
    where: {
      id: req.params.spellName,
    },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  res.send(spell);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
