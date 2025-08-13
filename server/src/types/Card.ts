export type Card = {
  uuid: string;
  accessory: AccessoryType | null;
  type: CardType;
  name: string;
  aspectList: CardCost;
  aspectMask: number;
  art: string;
  description: string;
  objectiveDescription: string;
  offence: number;
  defence: number;
  regeneration: number;
  tags: string[];
};

export type CardCost = {
  [key: string]: number;
};

// Database representation (what Prisma returns)
export type CardDB = {
  uuid: string;
  accessory: string | null;
  type: string;
  name: string;
  aspectList: string; // JSON string
  aspectMask: number;
  art: string;
  description: string;
  objectiveDescription: string;
  offence: number;
  defence: number;
  regeneration: number;
  tags: string; // JSON string
  createdAt?: Date;
  updatedAt?: Date;
};

export const blankCard: Card = {
  uuid: "",
  accessory: null,
  type: "CREATURE",
  name: "",
  aspectList: {},
  aspectMask: 0,
  art: "",
  description: "",
  objectiveDescription: "",
  offence: 0,
  defence: 0,
  regeneration: 0,
  tags: [],
};

export const CARD_TYPES = [
  "CREATURE",
  "ENCHANTMENT",
  "DEVICE",
  "REACTION",
  "FAST",
  "SLOW",
  "GEM",
] as const;

export type CardType = (typeof CARD_TYPES)[number];

export const ACCESSORIES = ["UNIQUE", "OBJECTIVE"];

export type AccessoryType = (typeof ACCESSORIES)[number];

export type CreateCardInput = Omit<Card, "uuid">;
export type UpdateCardInput = Partial<CreateCardInput>;
