'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { DeleteCategory } from '@/lib/db/CategoryCrud';
import delay from 'delay';
import { Loader2Icon, Trash2, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function DeleteCategoryAlert({ categoryId }: { categoryId: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDeleteProduct = async () => {
    startTransition(async () => {
      try {
        const res = await DeleteCategory(categoryId);

        toast({
          title: 'Successfully Deleted',
          description: res.message,
          variant: 'default',
        });

        await delay(4000);
        setOpen(false);

        router.push('/dashboard/categories/list');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Something went wrong',
          variant: 'destructive',
        });
      }
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Trash2
          size={18}
          className="text-red-500 hover:text-red-600 cursor-pointer"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span>Delete Category</span>
            <TriangleAlert
              size={18}
              className="text-red-500 hover:text-red-600 cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this <strong>category</strong>? this
            will also delete all the <strong>products</strong> under this
            category. and this action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteProduct}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            {isPending ? (
              <>
                <Loader2Icon className="animate-spin transition-all" />
                <span>Continuee</span>
              </>
            ) : (
              <>
                <span>Continuee</span>
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
