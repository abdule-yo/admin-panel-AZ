'use server';

import { Customer } from '@prisma/client';
import prisma from '../prisma';

export const GetCustomers = async (): Promise<Customer[]> => {
  try {
    return await prisma.customer.findMany({
      orderBy: {
        customer_id: 'asc',
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};
