import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ProductCategories, Products } from './productsSeed';
import { customers } from './customerSeed';

const prisma = new PrismaClient();

//Todo: Hashing the admins password
function hashMyPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

async function main() {
  // await prisma.productCategory.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.productCategory.createMany({
  //   data: ProductCategories,
  // });
  // await prisma.product.createMany({
  //   data: Products,
  // });
  // await prisma.customer.createMany({
  //   data: customers,
  // });
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
