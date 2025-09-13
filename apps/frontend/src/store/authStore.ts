"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IAuthStore, IUser } from "@/lib/interfaces/auth.interface";
import { baseApi } from "@/lib/axios/instance";
import { BaseApiResponse } from "@/lib/interfaces/base.interface";

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (token: string) => {
        localStorage.setItem("token", token);

        set({ isAuthenticated: true });

        get().fetchUser();
      },

      logout: () => {
        localStorage.removeItem("token");

        set({
          user: null,
          isAuthenticated: false,
        });
      },

      fetchUser: async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });

        try {
          const response = await baseApi.get<BaseApiResponse<IUser>>(
            "/v1/auth/profile"
          );

          if (response.data) {
            set({
              user: response.data.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error("No user data received");
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);

          localStorage.removeItem("token");

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
