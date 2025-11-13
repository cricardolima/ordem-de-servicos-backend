import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

const main = async () => {
  console.log('Starting seed...');
  await prisma.servicesType.deleteMany({});
  console.log('Deleted all services types.');
  await prisma.user.deleteMany({});
  console.log('Deleted all users.');
  await prisma.servicesType.createMany({
    data: [
      { serviceName: 'Ligação de água', serviceCode: 'ST1' },
      { serviceName: 'Ligação de esgoto', serviceCode: 'ST2' },
      { serviceName: 'Vazamento de água', serviceCode: 'ST3' },
      { serviceName: 'Vazamento de esgoto', serviceCode: 'ST4' },
      { serviceName: 'Entupimento', serviceCode: 'ST5' },
      { serviceName: 'Retirada de entulho', serviceCode: 'ST6' },
      { serviceName: 'Outros', serviceCode: 'ST7' },
    ],
  });
  console.log('Created all services types.');

  await prisma.user.create({
    data: {
      name: 'Admin',
      registration: 'admin',
      password: await hash('admin', Number(process.env.SALT_ROUNDS)),
      role: 'ADMIN',
    },
  });
  console.log('Created admin user.');
  console.log('Seed completed successfully.');
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
