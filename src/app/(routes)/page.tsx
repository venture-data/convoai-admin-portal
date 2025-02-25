"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {  Loader } from "lucide-react";
import { useAuthStore } from "../hooks/useAuth";
import { useDynamicForm } from "../hooks/use-form";
import { AuthToggle } from "@/components/auth/navigation/AuthToggle";
import { GoogleButton } from "@/components/auth/buttons/GoogleButton";
import { FormField } from "@/components/auth/forms/FormField";
import { z } from "zod";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { toast } from "@/app/hooks/use-toast"
import { useRouter } from "next/navigation";
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
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
          token: "",
        });
        const res = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (res?.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: res.error,
          });
        }else {
          toast({
            variant: "default",
            title: "Success",
            description: "Signed in successfully!",
          });
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
      } finally {
        setIsLoading(false);
      }
    }
  );

  const handleSignIn = async (provider: string) => {
    setGoogleLoading(true);
    try {
      await signIn(provider, { 
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error(`Error during ${provider} sign-in:`, error);
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl text-center font-[600] text-[30px] mb-2">Welcome back</h1>
      <p className="text-[#6B7280] text-center mb-6 font-inter">Welcome back! Please enter your details.</p>
      
      <AuthToggle mode="signin" />
      
      <GoogleButton 
        onClick={() => handleSignIn("google")}
        isLoading={googleLoading}
        mode="signin"
      />

      <form onSubmit={onSubmitHandler} className="space-y-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register as unknown as UseFormRegister<FieldValues>}
          error={errors.email}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          register={register as unknown as UseFormRegister<FieldValues>}
          error={errors.password}
        />

        {/* <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-gray-300 text-teal-500 focus:ring-teal-500 mr-2"
            />
            <label htmlFor="remember" className="text-sm text-gray-500">
              Remember for 30 days
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-teal-500">
            Forgot password
          </Link>
        </div> */}

        <Button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2.5 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </>
  );
}
