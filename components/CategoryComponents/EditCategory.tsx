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
import { useToast } from '@/hooks/use-toast';
import {
  CategoryById,
  CategoryUpdate,
  CreateCategory,
} from '@/lib/db/CategoryCrud';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const EditCategorySchema = z.object({
  category: z.string().min(1, { message: 'Category cannot be empty' }),
  categoryDescription: z
    .string()
    .min(1, { message: 'Category description cannot be empty' }),
});

type ProductFormData = z.infer<typeof EditCategorySchema>;

export default function EditCategory({ categoryId }: { categoryId: number }) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    const getCategoryById = async () => {
      try {
        const categoryData = await CategoryById(categoryId);
        setValue('category', categoryData.category);
        setValue('categoryDescription', categoryData.category_description);
      } catch (error) {
        setCategoryError('Failed to get category');
      }
    };

    getCategoryById();
  }, [categoryId]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(EditCategorySchema),
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    startTransition(async () => {
      try {
        const res = await CategoryUpdate(categoryId, {
          category: data.category,
          category_description: data.categoryDescription,
        });

        setOpen(false);
        toast({
          title: 'Successfully Updated',
          description: res.message,
          variant: 'default',
        });

        router.push('/dashboard/categories/list');
      } catch (error) {
        console.log('Catch Error:', error);
        toast({
          title: 'Error',
          description: 'Something went wrong',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil
          size={18}
          className="text-blue-500 hover:text-blue-600 cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Fill in the details of the editing category.
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
                <span>Update</span>
              </>
            ) : (
              <>
                <span>Update</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
