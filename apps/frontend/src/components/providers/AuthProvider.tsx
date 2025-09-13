"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useProjectStore } from "@/store/projectStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { fetchUser, isAuthenticated, user, isLoading } = useAuthStore();
  const { fetchProjects } = useProjectStore();
  const router = useRouter();
  const pathname = usePathname();

  const protectedRoutes = ["/dashboard", "/tasks"];
  const authRoutes = ["/login", "/register"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      fetchUser();
    }
  }, [fetchUser, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects();
    }
  }, [isAuthenticated, user, fetchProjects]);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && isAuthRoute) {
      router.push("/dashboard");
      return;
    }

    if (!isAuthenticated && isProtectedRoute) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, isProtectedRoute, isAuthRoute, router]);

  if (isLoading && isProtectedRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}
