'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Login } from '@/lib/db/UserCrud';
import logo from '@/public/nexlogiklogo.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, CircleDashedIcon, EyeIcon, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BorderBeam } from './ui/border-beam';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid Email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    startTransition(async () => {
      try {
        const res = await Login({
          email: data.email,
          password: data.password,
        });

        if (res.status === 200) {
          toast({
            title: 'Successfully Logged In',
            description: res.message,
            variant: 'default',
          });

          router.push('/dashboard');
        }
        toast({
          title: 'Error',
          description: res.message,
          variant: 'destructive',
        });
      } catch (error) {
        toast({
          title: 'OOPs!! Something went wrong',
          description: 'Check your internet please and try again',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex  items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-sm p-8 bg-white rounded-lg shadow-xl border ">
        <BorderBeam size={250} duration={12} delay={9} />

        <div className="flex flex-col gap-4 items-center justify-center ">
          <Image src={logo} width={50} height={50} alt="logo" className="" />

          <div>
            <h2 className="mb-1 text-2xl font-semibold text-center">
              Sign in to Adeegzone
            </h2>
            <p className="text-center text-gray-500 text-sm">
              Welcome back! Please sign in to continue
            </p>
          </div>
        </div>

        <div className="flex items-center my-4">
          <span className="w-full border-b border-gray-300"></span>
          <span className="px-3 text-gray-500"></span>
          <span className="w-full border-b border-gray-300"></span>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email *
            </Label>
            <Input
              id="email"
              type="text"
              className="mt-1 w-full"
              placeholder="johndoe@gmail.com"
              {...register('email', { required: true })}
            />
            {errors.email && (
              <span className="text-sm text-red-500 transition-all animate-appear ">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password *
            </Label>

            <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="mt-1 w-full pr-10 border rounded-md focus-visible:border-none"
                placeholder="123456"
                {...register('password', { required: true })}
              />
              {showPassword ? (
                <EyeIcon
                  size={17}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <EyeOff
                  size={17}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>

            {errors.password && (
              <span className="text-sm text-red-500 transition-all animate-appear">
                {errors.password.message}
              </span>
            )}
          </div>

          <Button className="w-full text-sm flex items-center gap-2">
            {isPending ? (
              <CircleDashedIcon
                size={17}
                className="animate-spin transition-all delay-75"
              />
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight size={15} />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Secured by{' '}
          <Link
            href={'https://yoolgaadh.com'}
            target="_blank"
            className="text-[#1c40b0]"
          >
            @NexLogik
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
