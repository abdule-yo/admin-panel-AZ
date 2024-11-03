'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import defaultImage from '@/public/default_product_image.png';
import { Product, ProductCategory } from '@prisma/client';
import Image from 'next/image';
import { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import AddProduct from './AddProduct';
import { DeleteProductAlert } from './DeleteProduct';
import EditProduct from './EditProduct';

type ProductWithCategory = Product & {
  category: ProductCategory;
};

type ProductListTypeProps = {
  products: ProductWithCategory[];
};

function ProductListTable({ products }: ProductListTypeProps) {
  const [search, setSearch] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredProduct = products.filter((product) => {
    return (
      search.toLowerCase() === '' ||
      product.product_name.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <Card className="overflow-x-auto m-4 p-3">
        <div className="flex items-center justify-between">
          <div className="w-96 space-y-4 ">
            <h1>Product List</h1>

            <Input
              placeholder="Search product"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <AddProduct />
        </div>
      </Card>
      <Card className="overflow-x-auto m-4 p-3">
        <Table className="min-w-full md:min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs md:text-sm">Product Name</TableHead>
              <TableHead className="text-xs md:text-sm">
                Product Description
              </TableHead>
              <TableHead className="text-xs md:text-sm">Category</TableHead>
              <TableHead className="text-xs md:text-sm">Price</TableHead>
              <TableHead className="text-xs md:text-sm">Status</TableHead>
              <TableHead className="text-xs md:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProduct && filteredProduct.length > 0 ? (
              filteredProduct.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          product.product_image
                            ? product.product_image
                            : defaultImage
                        }
                        width={35}
                        height={35}
                        className="rounded-md"
                        alt={`product_image_${product.product_id}`}
                      />
                      <p>{product.product_name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="truncate max-w-xs overflow-hidden whitespace-nowrap">
                    {product.product_description}
                  </TableCell>
                  <TableCell>{product.category.category}</TableCell>
                  <TableCell>{product.product_price}</TableCell>
                  <TableCell>{product.product_status}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <EditProduct productId={product.product_id} />

                      <DeleteProductAlert productId={product.product_id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="flex items-center justify-center">
                    <p>No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default ProductListTable;
