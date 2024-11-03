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

export const CategoryById = async (
  category_id: number
): Promise<ProductCategory> => {
  try {
    const categoryFound = await prisma.productCategory.findFirst({
      where: {
        product_category_id: category_id,
      },
    });

    if (!categoryFound) {
      throw new Error('Category not found');
    }

    return categoryFound;
  } catch (error) {
    throw new Error('Something went wrong ');
  }
};

type CategoryCreateResponse = {
  status: number;
  message: string;
};

type CategoryCreateInput = {
  category: string;
  category_description: string;
};

export const CreateCategory = async (
  data: CategoryCreateInput
): Promise<CategoryCreateResponse> => {
  try {
    const category = await prisma.productCategory.create({
      data: {
        category: data.category,
      },
    });

    return { status: 201, message: 'Category added successfully' };
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};

type CategoryUpdateResponse = {
  status: number;
  message: string;
};

type CategoryUpdateInput = {
  category: string;
  category_description: string;
};

export const CategoryUpdate = async (
  categoryId: number,
  data: CategoryCreateInput
): Promise<CategoryUpdateResponse> => {
  try {
    const categoryFound = await prisma.productCategory.findFirst({
      where: {
        product_category_id: categoryId,
      },
    });

    if (!categoryFound) {
      throw new Error('Category not found');
    }

    await prisma.productCategory.update({
      where: {
        product_category_id: categoryId,
      },
      data: {
        category: data.category ? data.category : categoryFound.category,
        category_description: data.category_description
          ? data.category_description
          : categoryFound.category_description,
      },
    });

    return { status: 200, message: 'Category updated successfully' };
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};

type CategoryDeleteReponse = {
  status: number;
  message: string;
};

export const DeleteCategory = async (
  category_id: number
): Promise<CategoryDeleteReponse> => {
  try {
    const categoryFound = await prisma.productCategory.findFirst({
      where: {
        product_category_id: category_id,
      },
    });

    if (!categoryFound) {
      throw new Error('Category not found');
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: category_id,
      },
    });

    if (!products) {
      await prisma.productCategory.delete({
        where: {
          product_category_id: category_id,
        },
      });
    } else {
      await prisma.product.deleteMany({
        where: {
          categoryId: category_id,
        },
      });

      await prisma.productCategory.delete({
        where: {
          product_category_id: category_id,
        },
      });
    }

    return {
      status: 200,
      message:
        'Category and any other product related to this category deleted succcefully',
    };
  } catch (error) {
    throw new Error('Something went wrong ');
  }
};
