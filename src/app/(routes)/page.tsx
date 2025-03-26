'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';
import { useDynamicForm } from '../hooks/use-form';
import { GoogleButton } from '@/components/auth/buttons/GoogleButton';
import { FormField } from '@/components/auth/forms/FormField';
import { z } from 'zod';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { toast } from '@/app/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const authStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const { register, errors, onSubmitHandler } = useDynamicForm<FormValues>(
    formSchema,
    async (data) => {
      setIsLoading(true);
      try {
        authStore.setCreds({
          email: data.email,
          password: data.password,
          isAuth: true,
          token: '',
        });
        const res = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (res?.error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: res.error,
          });
        } else {
          toast({
            variant: 'default',
            title: 'Success',
            description: 'Signed in successfully!',
          });
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error during sign-in:', error);
      } finally {
        setIsLoading(false);
      }
    }
  );

  const handleSignIn = async (provider: string) => {
    setGoogleLoading(true);
    try {
      await signIn(provider, { redirect: true, callbackUrl: '/dashboard' });
    } catch (error) {
      console.error(`Error during ${provider} sign-in:`, error);
      setGoogleLoading(false);
    }
  };

  return (
    <div >
      <div className='w-[400px] p-8 space-y-6'>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={onSubmitHandler} className='space-y-2 text-white'>
          <FormField
            id='email'
            label='Email address'
            type='email'
            placeholder='name@company.com'
            register={register as unknown as UseFormRegister<FieldValues>}
            error={errors.email}
          />

          <div className="space-y-1">
            <div className="flex justify-end items-center">
              <Link href='/forgot-password' className='text-sm text-[#FF5C00] hover:text-[#FF7A33]'>
                Forgot password?
              </Link>
            </div>
            <FormField
              id='password'
              label='Password'
              type='password'
              placeholder='Enter your password'
              register={register as unknown as UseFormRegister<FieldValues>}
              error={errors.password}
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-[1.02]'
            disabled={isLoading}
          >
            {isLoading ? <Loader className='mr-2 h-4 w-4 animate-spin' /> : 'Sign in'}
          </Button>
        </form>
        
        <div className='flex items-center justify-center w-full gap-2'>
          <div className='w-full h-[1px] bg-gray-700'></div>
          <div className="text-center text-sm text-gray-400 whitespace-nowrap">
          continue with
        </div>
          <div className='w-full h-[1px] bg-gray-700'></div>  
        </div>

        <GoogleButton 
          onClick={() => handleSignIn('google')} 
          isLoading={googleLoading} 
          mode='signin'
        />

        <div className='text-center text-sm text-gray-400'>
          Don&apos;t have an account? <Link href='/signup' className='text-[#FF5C00] hover:text-[#FF7A33]'>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
