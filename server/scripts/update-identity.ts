import { PrismaClient } from "@prisma/client";
import { db } from "../src/database";

const prisma = new PrismaClient();

async function resaveAllCards() {
  console.log("Starting resave of all cards to update identity fields...");

  try {
    // Get all cards
    const cards = await prisma.card.findMany();
    console.log(`Found ${cards.length} cards to resave`);

    let updatedCount = 0;

    // Resave each card through the normal update process
    for (const card of cards) {
      // Parse the stored data back to the format updateCard expects
      const cardData = {
        name: card.name,
        accessory: card.accessory,
        aspectList: JSON.parse(card.aspectList),
        aspectMask: card.aspectMask,
        art: card.art,
        description: card.description,
        objectiveDescription: card.objectiveDescription,
        offence: card.offence,
        defence: card.defence,
        regeneration: card.regeneration,
        tags: JSON.parse(card.tags),
        type: card.type as
          | "CREATURE"
          | "ENCHANTMENT"
          | "DEVICE"
          | "REACTION"
          | "FAST"
          | "SLOW"
          | "GEM",
      };

      // Use the existing updateCard function which will run cardToDb and regenerate identity
      const updatedCard = await db.updateCard(card.uuid, cardData);

      if (updatedCard) {
        updatedCount++;
        console.log(`Resaved card ${card.uuid}: ${card.name}`);
      }
    }

    console.log(
      `Successfully resaved ${updatedCount} cards with updated identity fields!`
    );
  } catch (error) {
    console.error("Error during resave operation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resaveAllCards();
// run with 'npm run update-identity'
