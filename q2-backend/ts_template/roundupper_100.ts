import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number; y: number };
type spaceCowboy = { name: string; lassoLength: number };
type spaceAnimal = { type: 'pig' | 'cow' | 'flying_burger' };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
  | { type: 'space_cowboy'; metadata: spaceCowboy; location: location }
  | { type: 'space_animal'; metadata: spaceAnimal; location: location };

// === ADD YOUR CODE BELOW :D ===

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();

app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
  const { entities } = req.body;

  entities.forEach((entity: spaceEntity) => {
    spaceDatabase.push(entity);
  });

  res.status(200).send();
});

function calculateDistance(p1: location, p2: location): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// /lassoable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
  const cowboyName = req.query.cowboy_name;

  const cowboy = spaceDatabase.find(
    (e) => e.type === 'space_cowboy' && e.metadata.name === cowboyName
  );

  if (!cowboy) {
    res.status(404).send();
    return;
  }

  if (cowboy.type === 'space_cowboy') {
    const lassoableAnimals = spaceDatabase.filter((e) => {
      if (e.type !== 'space_animal') return false;

      const distance = calculateDistance(cowboy.location, e.location);
      return distance <= cowboy.metadata.lassoLength;
    });

    const formattedOutput = lassoableAnimals.map((entity) => {
      if (entity.type === 'space_animal') {
        return {
          type: entity.metadata.type,
          location: entity.location,
        };
      }
    });
    res.status(200).json({ space_animals: formattedOutput });
  }
});

app.listen(8080);
