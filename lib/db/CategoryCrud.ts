'use server';

import { Product, ProductCategory } from '@prisma/client';
import prisma from '../prisma';

export const GetCategories = async (): Promise<ProductCategory[]> => {
  try {
    return await prisma.productCategory.findMany({
      orderBy: {
        category: 'asc',
      },
    });
  } catch (error) {
    console.log(error);

    throw new Error('Something went wrong');
  }
};
