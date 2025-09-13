"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { baseApi } from "@/lib/axios/instance";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const form = useForm<LoginFormValues>({
    defaultValues: { username: "", password: "" },
  });
  const { handleSubmit } = form;

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const response = await baseApi.post("/v1/auth/login", values);

      if (!response.data) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const token = response.data.data.accessToken;

      login(token);

      toast.success("Welcome back!", {
        description: "You have been successfully logged in.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast.error("Login failed", {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <Form {...form}>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your account password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
