'use server';

import { Product, ProductCategory } from '@prisma/client';
import prisma from '../prisma';

export const GetPrdoducts = async (): Promise<
  (Product & { category: ProductCategory })[]
> => {
  try {
    return await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        product_name: 'asc',
      },
    });
  } catch (error) {
    console.log(error);

    throw new Error('Something went wrong');
  }
};

export const ProductById = async (product_id: number): Promise<Product> => {
  try {
    const productFound = await prisma.product.findFirst({
      where: {
        product_id: product_id,
      },
    });

    if (!productFound) {
      throw new Error('Product not found');
    }

    return productFound;
  } catch (error) {
    throw new Error('Something went wrong ');
  }
};

type ProdctCreateResponse = {
  status: number;
  message: string;
};

type ProductCreateInput = {
  product_name: string;
  product_price: string;
  product_description: string;
  product_image: string | null;
  categoryId: string;
};

export const CreateProduct = async (
  data: ProductCreateInput
): Promise<ProdctCreateResponse> => {
  try {
    await prisma.product.create({
      data: {
        product_name: data.product_name,
        product_description: data.product_description,
        product_price: +data.product_price,
        categoryId: +data.categoryId,
        product_image: data.product_image ? data.product_image : null,
      },
    });

    return { status: 201, message: 'Product added successfully' };
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};

type ProductUpdateResponse = {
  status: number;
  message: string;
};

type ProductUpdateInput = {
  product_id: number;
  product_name: string;
  product_description: string;
  product_price: string;
  product_image: string | null;
  categoryId: string;
};

export const ProductUpdate = async (
  productId: number,
  data: ProductCreateInput
): Promise<ProductUpdateResponse> => {
  try {
    const productFound = await prisma.product.findFirst({
      where: {
        product_id: productId,
      },
    });

    if (!productFound) {
      throw new Error('Product not found');
    }

    await prisma.product.update({
      where: {
        product_id: productId,
      },
      data: {
        product_name: data.product_name
          ? data.product_name
          : productFound.product_name,
        product_description: data.product_description
          ? data.product_description
          : productFound.product_description,
        product_price: +data.product_price
          ? +data.product_price
          : productFound.product_price,
        categoryId: +data.categoryId
          ? +data.categoryId
          : productFound.categoryId,
        product_image: data.product_image
          ? data.product_image
          : productFound.product_image,
      },
    });

    return { status: 200, message: 'Product updated successfully' };
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};

type ProductDeleteReponse = {
  status: number;
  message: string;
};

export const DeleteProduct = async (
  product_id: number
): Promise<ProductDeleteReponse> => {
  try {
    const productFound = await prisma.product.findFirst({
      where: {
        product_id: product_id,
      },
    });

    if (!productFound) {
      throw new Error('Product not found');
    }

    await prisma.product.delete({
      where: {
        product_id: product_id,
      },
    });

    return { status: 200, message: 'Product deleted succcefully' };
  } catch (error) {
    throw new Error('Something went wrong ');
  }
};
