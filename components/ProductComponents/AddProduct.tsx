'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GetCategories } from '@/lib/db/CategoryCrud';
import { CreateProduct } from '@/lib/db/ProductCrud';
import { UploadButton } from '@/utils/uploadting';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductCategory } from '@prisma/client';
import { DotIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const AddProductSchema = z.object({
  productName: z.string().min(1, { message: 'Product name cannot be empty' }),
  productDescription: z
    .string()
    .min(1, { message: 'Product description cannot be empty' }),
  productPrice: z.string().min(1, { message: 'Product price cannot be empty' }),
  productCategory: z.string().min(1, { message: 'Select at least 1 category' }),
});

type ProductFormData = z.infer<typeof AddProductSchema>;

export default function AddProduct() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await GetCategories();
        setCategories(categoriesData);
      } catch (error) {
        setCategoryError('Failed to get categories');
      }
    };

    getCategories();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(AddProductSchema),
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    startTransition(async () => {
      try {
        const res = await CreateProduct({
          product_name: data.productName,
          product_description: data.productDescription,
          product_price: data.productPrice,
          product_image: image,
          categoryId: data.productCategory,
        });

        setOpen(false);
        router.push('/dashboard/products/list');
      } catch (error) {
        console.log('Catch Error:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Fill in the details of the new product and select a category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 ">
          <div className="flex flex-col gap-3">
            <Label htmlFor="product_name">Product Name</Label>
            <Input
              id="product_name"
              placeholder="Enter product name"
              className="col-span-3"
              {...register('productName', { required: true })}
            />
            {errors.productName && (
              <span className="text-sm text-red-500 transition-all animate-appear ">
                {errors.productName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="product_description" className="">
              Product Description
            </Label>
            <Input
              id="product_description"
              placeholder="Enter product description"
              className="col-span-3"
              {...register('productDescription', { required: true })}
            />
            {errors.productDescription && (
              <span className="text-sm text-red-500 transition-all animate-appear ">
                {errors.productDescription.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="product_price" className="">
              Product Price
            </Label>
            <Input
              id="product_price"
              type="number"
              placeholder="Enter price"
              className="col-span-3"
              {...register('productPrice', { required: true })}
            />
            {errors.productPrice && (
              <span className="text-sm text-red-500 transition-all animate-appear ">
                {errors.productPrice.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="product_category" className="">
              Category
            </Label>
            {categoryError && (
              <span className="text-sm text-red-500">{categoryError}</span>
            )}

            <Controller
              name="productCategory"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[380px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories &&
                      categories.length > 0 &&
                      categories.map((category) => (
                        <SelectItem
                          key={category.product_category_id}
                          value={String(category.product_category_id)}
                        >
                          {category.category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.productCategory && (
              <span className="text-sm text-red-500">
                {errors.productCategory.message}
              </span>
            )}
          </div>
          {/* <div className="border-2 border-dashed border-gray-300 p-4 rounded-md flex items-center justify-center space-x-2">
            <ImageIcon className="h-6 w-6 text-gray-600" />
            <span> Drag and drop images here, </span>
            <Label className="text-blue-600 underline cursor-pointer">
              upload
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e)}
              />
            </Label>
          </div> */}

          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImage(res[0].url);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />

          {/* {preview && (
            <div className="flex items-center justify-center ">
              <Image
                src={preview}
                width={100}
                height={100}
                alt="product_image"
                className="border border-purple-600"
              />
            </div>
          )} */}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            {isPending ? (
              <>
                <DotIcon className="animate-spin transition-all" />
                <span>Add</span>
              </>
            ) : (
              <>
                <span>Add</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
