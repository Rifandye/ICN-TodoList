"use client";

import { create } from "zustand";
import { IProject } from "@/lib/interfaces/task.interface";
import { baseApi } from "@/lib/axios/instance";
import { BaseApiResponse } from "@/lib/interfaces/base.interface";

interface IProjectStore {
  projects: IProject[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: IProject) => void;
  updateProject: (projectId: string, updatedProject: Partial<IProject>) => void;
  removeProject: (projectId: string) => void;
  deleteProject: (projectId: string) => Promise<void>;
}

export const useProjectStore = create<IProjectStore>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await baseApi.get<BaseApiResponse<IProject[]>>(
        "/v1/projects"
      );

      if (response.data && response.data.data) {
        set({
          projects: response.data.data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error("No projects data received");
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch projects",
        isLoading: false,
      });
    }
  },

  addProject: (project: IProject) => {
    set((state) => ({
      projects: [project, ...state.projects],
    }));
  },

  updateProject: (projectId: string, updatedProject: Partial<IProject>) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId ? { ...project, ...updatedProject } : project
      ),
    }));
  },

  removeProject: (projectId: string) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== projectId),
    }));
  },

  deleteProject: async (projectId: string) => {
    try {
      const response = await baseApi.delete(`/v1/projects/${projectId}`);

      if (response.data) {
        get().removeProject(projectId);
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  },
}));
