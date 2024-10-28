import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

//Todo: Hashing the admins password
function hashMyPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

async function main() {
  //   await prisma.user.create({
  //     data: {
  //       name: 'Husna',
  //       email: 'husnabaroo@gmail.com',
  //       password: hashMyPassword('husna1212#'),
  //     },
  //   });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
