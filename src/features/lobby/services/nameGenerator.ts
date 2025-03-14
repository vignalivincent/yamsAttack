interface BarbaMember {
  name: string;
  color: string;
  trait: string;
}

const barbaFamily: BarbaMember[] = [
  { name: "Barbapapa", color: "Rose", trait: "Transformable" },
  { name: "Barbamama", color: "Noir", trait: "Musicienne" },
  { name: "Barbabelle", color: "Violet", trait: "Artiste" },
  { name: "Barbalala", color: "Vert", trait: "Musicienne" },
  { name: "Barbabright", color: "Orange", trait: "Scientifique" },
  { name: "Barbalib", color: "Jaune", trait: "Intellectuelle" },
  { name: "Barbouille", color: "Noir", trait: "Artiste" },
  { name: "Barbidur", color: "Bleu", trait: "Sportif" },
  { name: "Barbotine", color: "Rouge", trait: "Nature" },
];

const adjectives = [
  "Joyeux", "Rieur", "Dansant", "Câlin", "Rêveur",
  "Malin", "Joueur", "Tendre", "Doux", "Espiègle"
];

const truncateToMaxLength = (str: string, maxLength: number = 10): string => {
  return str.length <= maxLength ? str : str.slice(0, maxLength);
};

export const generateBarbaName = (): string => {
  const randomBarba = barbaFamily[Math.floor(Math.random() * barbaFamily.length)];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  // Format court uniquement pour garantir une longueur maximale de 10 caractères
  const prefix = randomBarba.name.startsWith("Barba") 
    ? "Barba" 
    : randomBarba.name.slice(0, 5);
  
  const suffix = randomAdjective.toLowerCase().slice(0, 4);
  return truncateToMaxLength(`${prefix}${suffix}`);
}; 