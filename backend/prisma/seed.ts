import { PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";

const prisma = new PrismaClient();
const nanoid = customAlphabet("0123456789", 8);

async function main() {
  // Create a sample location
  const location = await prisma.location.create({
    data: {
      name: "City Hospital - OPD Department",
      address: "123 Main Street, Downtown",
      type: "Hospital",
    },
  });

  console.log(`✓ Created location: ${location.name}`);

  // Create a sample queue
  const publicId = `q_${nanoid()}`;
  const queue = await prisma.queue.create({
    data: {
      locationId: location.id,
      name: "General Consultation Queue",
      publicId,
      tokenPrefix: "A",
      currentSequence: 0,
      status: "OPEN",
    },
  });

  console.log(`✓ Created queue: ${queue.name}`);
  console.log(`✓ Queue public ID: ${publicId}`);
  console.log(`✓ Token prefix: ${queue.tokenPrefix}`);
  console.log(`\n📱 Visit: http://localhost:3000/q/${publicId}`);
  console.log(`🛠️  Admin panel: http://localhost:3001 (use public ID: ${publicId})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
