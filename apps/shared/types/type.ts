// Type-related interfaces
export interface TypeAttributes {
  title?: string;
  slug?: string;
  pokemon?: { data?: unknown[] };
}

export interface TypeItem {
  attributes?: TypeAttributes;
  title?: string;
  slug?: string;
  pokemon?: unknown[];
}

// Type image data
interface TypeData {
  image: string;
}

const TYPE_MAP: Record<string, TypeData> = {
  Bug: {
    image: "/bug.jpg",
  },
  Dark: {
    image: "/dark.jpg",
  },
  Dragon: {
    image: "/dragon.jpg",
  },
  Electric: {
    image: "/electric.jpg",
  },
  Fairy: {
    image: "/fairy.jpg",
  },
  Fighting: {
    image: "/fighting.jpg",
  },
  Fire: {
    image: "/fire.jpg",
  },
  Flying: {
    image: "/flying.jpg",
  },
  Ghost: {
    image: "/ghost.jpg",
  },
  Grass: {
    image: "/grass.jpg",
  },
  Ground: {
    image: "/ground.jpg",
  },
  Ice: {
    image: "/ice.jpg",
  },
  Normal: {
    image: "/normal.jpg",
  },
  Poison: {
    image: "/poison.jpg",
  },
  Psychic: {
    image: "/psychic.jpg",
  },
  Rock: {
    image: "/rock.jpg",
  },
  Steel: {
    image: "/steel.jpg",
  },
  Stellar: {
    image: "/stellar.jpg",
  },
  Water: {
    image: "/water.jpg",
  },
  Default: {
    image: "/normal.jpg",
  },
};

export function getTypeData(typeName: string): TypeData {
  const normalizedName =
    typeName.charAt(0).toUpperCase() + typeName.slice(1).toLowerCase();
  return TYPE_MAP[normalizedName] || TYPE_MAP.Default;
}
