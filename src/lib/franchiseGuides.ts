// Curated viewing-order data for franchises where release order and in-universe
// chronological order genuinely diverge. Deliberately stores title + year (not TMDB
// numeric IDs) — the page resolves each film to its TMDB ID via search at request time,
// matching on title+year. A hand-typed ID can silently point at the wrong movie with no
// visible symptom (this bit /sub-genres earlier in this project); a title+year search
// either finds the right film or visibly finds nothing, which is a far safer failure mode.
export interface FranchiseFilm {
  title: string;
  year: number;
  releaseOrder: number;
  chronologicalOrder: number;
}

export interface FranchiseGuide {
  slug: string;
  name: string;
  description: string;
  films: FranchiseFilm[];
}

export const franchiseGuides: FranchiseGuide[] = [
  {
    slug: 'star-wars',
    name: 'Star Wars: Skywalker Saga',
    description: 'Released out of chronological order from the start — the prequels arrived 16-22 years after the originals.',
    films: [
      { title: 'Star Wars', year: 1977, releaseOrder: 1, chronologicalOrder: 4 },
      { title: 'The Empire Strikes Back', year: 1980, releaseOrder: 2, chronologicalOrder: 5 },
      { title: 'Return of the Jedi', year: 1983, releaseOrder: 3, chronologicalOrder: 6 },
      { title: 'The Phantom Menace', year: 1999, releaseOrder: 4, chronologicalOrder: 1 },
      { title: 'Attack of the Clones', year: 2002, releaseOrder: 5, chronologicalOrder: 2 },
      { title: 'Revenge of the Sith', year: 2005, releaseOrder: 6, chronologicalOrder: 3 },
      { title: 'The Force Awakens', year: 2015, releaseOrder: 7, chronologicalOrder: 7 },
      { title: 'The Last Jedi', year: 2017, releaseOrder: 8, chronologicalOrder: 8 },
      { title: 'The Rise of Skywalker', year: 2019, releaseOrder: 9, chronologicalOrder: 9 },
    ],
  },
  {
    slug: 'x-men',
    name: 'X-Men (Original + First Class eras)',
    description: 'First Class and its sequels are a prequel trilogy set decades before the original 2000s films.',
    films: [
      { title: 'X-Men: First Class', year: 2011, releaseOrder: 4, chronologicalOrder: 1 },
      { title: 'X-Men: Days of Future Past', year: 2014, releaseOrder: 6, chronologicalOrder: 2 },
      { title: 'X-Men: Apocalypse', year: 2016, releaseOrder: 8, chronologicalOrder: 3 },
      { title: 'X-Men', year: 2000, releaseOrder: 1, chronologicalOrder: 4 },
      { title: 'X2', year: 2003, releaseOrder: 2, chronologicalOrder: 5 },
      { title: 'X-Men: The Last Stand', year: 2006, releaseOrder: 3, chronologicalOrder: 6 },
    ],
  },
  {
    slug: 'fast-and-furious',
    name: 'Fast & Furious',
    description: 'Tokyo Drift released third but its events happen much later — Han\'s arc is the anchor for the whole timeline.',
    films: [
      { title: 'The Fast and the Furious', year: 2001, releaseOrder: 1, chronologicalOrder: 1 },
      { title: '2 Fast 2 Furious', year: 2003, releaseOrder: 2, chronologicalOrder: 2 },
      { title: 'Fast & Furious', year: 2009, releaseOrder: 4, chronologicalOrder: 3 },
      { title: 'Fast Five', year: 2011, releaseOrder: 5, chronologicalOrder: 4 },
      { title: 'Fast & Furious 6', year: 2013, releaseOrder: 6, chronologicalOrder: 5 },
      { title: 'The Fast and the Furious: Tokyo Drift', year: 2006, releaseOrder: 3, chronologicalOrder: 6 },
      { title: 'Furious 7', year: 2015, releaseOrder: 7, chronologicalOrder: 7 },
      { title: 'The Fate of the Furious', year: 2017, releaseOrder: 8, chronologicalOrder: 8 },
      { title: 'F9', year: 2021, releaseOrder: 9, chronologicalOrder: 9 },
      { title: 'Fast X', year: 2023, releaseOrder: 10, chronologicalOrder: 10 },
    ],
  },
  {
    slug: 'alien',
    name: 'Alien',
    description: 'Prometheus and Covenant are prequels, set decades before the crew of the Nostromo ever finds the derelict ship.',
    films: [
      { title: 'Prometheus', year: 2012, releaseOrder: 5, chronologicalOrder: 1 },
      { title: 'Alien: Covenant', year: 2017, releaseOrder: 6, chronologicalOrder: 2 },
      { title: 'Alien', year: 1979, releaseOrder: 1, chronologicalOrder: 3 },
      { title: 'Aliens', year: 1986, releaseOrder: 2, chronologicalOrder: 4 },
      { title: 'Alien 3', year: 1992, releaseOrder: 3, chronologicalOrder: 5 },
      { title: 'Alien: Resurrection', year: 1997, releaseOrder: 4, chronologicalOrder: 6 },
    ],
  },
  {
    slug: 'mcu-core-saga',
    name: 'MCU: Core Avengers Saga',
    description: 'A condensed 10-film core path through the Infinity Saga (not the full 23-film MCU) — the essential Avengers throughline.',
    films: [
      { title: 'Captain America: The First Avenger', year: 2011, releaseOrder: 5, chronologicalOrder: 1 },
      { title: 'Captain Marvel', year: 2019, releaseOrder: 21, chronologicalOrder: 2 },
      { title: 'Iron Man', year: 2008, releaseOrder: 1, chronologicalOrder: 3 },
      { title: 'Iron Man 2', year: 2010, releaseOrder: 3, chronologicalOrder: 4 },
      { title: 'The Avengers', year: 2012, releaseOrder: 6, chronologicalOrder: 5 },
      { title: 'Avengers: Age of Ultron', year: 2015, releaseOrder: 11, chronologicalOrder: 6 },
      { title: 'Captain America: Civil War', year: 2016, releaseOrder: 13, chronologicalOrder: 7 },
      { title: 'Spider-Man: Homecoming', year: 2017, releaseOrder: 15, chronologicalOrder: 8 },
      { title: 'Avengers: Infinity War', year: 2018, releaseOrder: 19, chronologicalOrder: 9 },
      { title: 'Avengers: Endgame', year: 2019, releaseOrder: 22, chronologicalOrder: 10 },
    ],
  },
];

export function getFranchiseGuide(slug: string): FranchiseGuide | undefined {
  return franchiseGuides.find((f) => f.slug === slug);
}
