"use client";

import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../hooks/useAuth";
import { useDynamicForm } from "../../hooks/use-form";
// import { GoogleButton } from "@/components/auth/buttons/GoogleButton";
import { FormField } from "@/components/auth/forms/FormField";
import { toast } from "@/app/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(20, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).*$/,
      "Password must contain at least one uppercase letter, one number, and one lowercase letter"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const authStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  // const [googleLoading, setGoogleLoading] = useState(false);
  
  const router = useRouter();

  const { register, errors, onSubmitHandler } = useDynamicForm<FormValues>(
    formSchema,
    async (data) => {
      setIsLoading(true);
      try {
        authStore.setCreds({
          email: data.email,
          name: data.name,
          password: data.password,
          isAuth: true,
          token: "",
        });
        const res = await signIn("credentials", {
          email: data.email,
          password: data.password,
          name: data.name,
          redirect: false,
          mode:'register',
        });
        if(res?.error){
          toast({
            variant: "destructive",
            title: "Error",
            description: res.error,
          });
          setIsLoading(false);
        }
        else{
          router.push("/dashboard");
        } 
      } catch  {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred",
        });
        setIsLoading(false);
      }
    }
  );

  // Google sign-in handler - commented out
  // const handleSignIn = async (provider: string, mode: string) => {
  //   setGoogleLoading(true);
  //   try {
  //     const res = await signIn(provider, { 
  //       redirect: false,
  //       callbackUrl: "/dashboard",
  //       mode:mode,
  //     });
  //     if(res?.error){
  //       toast({
  //         variant: "destructive",
  //         title: "Error",
  //         description: res.error,
  //       });
  //     }
  //     else{
  //       router.push("/dashboard");
  //     }
  //     
  //   } catch (error) {
  //     console.error(`Error during ${provider} sign-in:`, error);
  //   } finally {
  //     setGoogleLoading(false);
  //   }
  // };

  return (
    <div>
      <div className='w-[400px] p-8 space-y-6'>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-white">Create an account</h1>
          <p className="text-gray-400">Sign up to get started</p>
        </div>

        <form onSubmit={onSubmitHandler} className='space-y-2'>
          <FormField
            id="name"
            label="Full name"
            type="text"
            placeholder="John Doe"
            register={register}
            error={errors.name}
          />

          <FormField
            id="email"
            label="Email address"
            type="email"
            placeholder="name@company.com"
            register={register}
            error={errors.email}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password}
          />

          <Button
            type="submit"
            className='w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-[1.02]'
            disabled={isLoading}
          >
            {isLoading ? <Loader className='mr-2 h-4 w-4 animate-spin' /> : 'Sign up'}
          </Button>
        </form>

        <div className='flex items-center justify-center w-full gap-2'>
          <div className='w-full h-[1px] bg-gray-700'></div>
          <div className="text-center text-sm text-gray-400 whitespace-nowrap">
            continue with
          </div>
          <div className='w-full h-[1px] bg-gray-700'></div>  
        </div>

        {/* Google Button - commented out
        <GoogleButton
          onClick={() => handleSignIn("google", "signup")}
          isLoading={googleLoading}
          mode="signup"
        />
        */}

        <div className='text-center text-sm text-gray-400'>
          Already have an account? <Link href='/' className='text-[#FF5C00] hover:text-[#FF7A33]'>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
