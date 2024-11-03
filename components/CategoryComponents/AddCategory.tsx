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
import { CreateCategory } from '@/lib/db/CategoryCrud';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const AddCategorySchema = z.object({
  category: z.string().min(1, { message: 'Category cannot be empty' }),
  categoryDescription: z
    .string()
    .min(1, { message: 'Category description cannot be empty' }),
});

type ProductFormData = z.infer<typeof AddCategorySchema>;

export default function AddCategory() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(AddCategorySchema),
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    startTransition(async () => {
      try {
        const res = await CreateCategory({
          category: data.category,
          category_description: data.categoryDescription,
        });

        setOpen(false);
        router.push('/dashboard/categories/list');
      } catch (error) {
        console.log('Catch Error:', error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Fill in the details of the new category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 ">
          <div className="flex flex-col gap-3">
            <Label htmlFor="product_name">Category</Label>
            <Input
              id="category"
              placeholder="Enter category"
              className="col-span-3 "
              {...register('category', { required: true })}
            />
            {errors.category && (
              <span className="text-sm text-red-500 transition-all animate-appear ">
                {errors.category.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="category_description" className="">
              Category Description
            </Label>
            <Input
              id="category_description"
              placeholder="Enter category description"
              className="col-span-3"
              {...register('categoryDescription', { required: true })}
            />
            {errors.categoryDescription && (
              <span className="text-sm text-red-500 transition-all animate-appear ">
                {errors.categoryDescription &&
                  errors.categoryDescription.message}
              </span>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            {isPending ? (
              <>
                <Loader2Icon className="animate-spin transition-all" />
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
