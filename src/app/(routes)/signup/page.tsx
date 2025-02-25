"use client";

import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../hooks/useAuth";
import { useDynamicForm } from "../../hooks/use-form";
import { AuthToggle } from "@/components/auth/navigation/AuthToggle";
import { GoogleButton } from "@/components/auth/buttons/GoogleButton";
import { FormField } from "@/components/auth/forms/FormField";
import { toast } from "@/app/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])[A-Za-z\d]{8,}$/,
      "Password must contain at least one uppercase letter, one number, and one lowercase letter"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
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

        
      } finally {
        setIsLoading(false);
      }
    }
  );

  const handleSignIn = async (provider: string, mode: string) => {
    setGoogleLoading(true);
    try {
      const res = await signIn(provider, { 
        redirect: false,
        callbackUrl: "/dashboard",
        mode:mode,
      });
      if(res?.error){
        toast({
          variant: "destructive",
          title: "Error",
          description: res.error,
        });
      }
      else{
        router.push("/dashboard");
      }
      
    } catch (error) {
      console.error(`Error during ${provider} sign-in:`, error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl text-center font-[600] text-[30px] mb-2">
        Hello World!
      </h1>
      <p className="text-[#6B7280] text-center mb-6 font-inter">
        Please enter your details to begin
      </p>

      <AuthToggle mode="signup" />

      <GoogleButton
        onClick={() => handleSignIn("google","signup")}
        isLoading={googleLoading}
        mode="signup"
      />

      <form onSubmit={onSubmitHandler} className="space-y-4">
        <FormField<FormValues>
          id="name"
          label="Name"
          type="text"
          placeholder="Enter your full name"
          register={register}
          error={errors.name}
        />

        <FormField<FormValues>
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
        />

        <FormField<FormValues>
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          register={register}
          error={errors.password}
        />

        <Button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2.5 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </>
  );
}
