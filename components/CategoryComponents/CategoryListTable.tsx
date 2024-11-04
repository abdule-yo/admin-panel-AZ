'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductCategory } from '@prisma/client';
import { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import AddCategory from './AddCategory';
import { DeleteCategoryAlert } from './DeleteCategory';
import EditCategory from './EditCategory';

type CategoriesListTableProps = {
  categories: ProductCategory[];
};

function CategoriesListTable({ categories }: CategoriesListTableProps) {
  const [search, setSearch] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
  };

  const filteredCategory = categories.filter((product) => {
    return (
      search.toLowerCase() === '' ||
      product.category.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <Card className="overflow-x-auto m-4 p-3">
        <div className="flex items-center justify-between">
          <div className="w-96 space-y-4 ">
            <h1>Category List</h1>

            <Input
              placeholder="Search category"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <AddCategory />
        </div>
      </Card>
      <Card className="overflow-x-auto m-4 p-3">
        <Table className="min-w-full md:min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs md:text-sm">Category</TableHead>
              <TableHead className="text-xs md:text-sm">
                Category Description
              </TableHead>
              <TableHead className="text-xs md:text-sm">Created At</TableHead>
              <TableHead className="text-xs md:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories && filteredCategory.length > 0 ? (
              filteredCategory.map((category) => (
                <TableRow key={category.product_category_id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <p>{category.category}</p>
                    </div>
                  </TableCell>
                  <TableCell className="truncate max-w-3.5 overflow-hidden whitespace-wrap">
                    <Tooltip>
                      <TooltipTrigger>
                        <span>{category.category_description}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {category.category_description}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{category.createdAt.toDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <EditCategory categoryId={category.product_category_id} />

                      <DeleteCategoryAlert
                        categoryId={category.product_category_id}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="flex items-center justify-center">
                    <p>No categories found</p>
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

export default CategoriesListTable;
