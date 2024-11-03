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
import { DeleteProduct } from '@/lib/db/ProductCrud';
import delay from 'delay';
import { Loader2Icon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function DeleteProductAlert({ productId }: { productId: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDeleteProduct = async () => {
    startTransition(async () => {
      try {
        const res = await DeleteProduct(productId);

        toast({
          title: 'Successfully Deleted',
          description: res.message,
          variant: 'default',
        });

        await delay(4000);
        setOpen(false);
        router.push('/dashboard/products/list');
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
        <Trash2 className="text-red-500 hover:text-red-600 cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteProduct}
            className="flex items-center gap-2"
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
