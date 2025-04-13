import type { Project } from "@prisma/client";
import React, { useContext, createContext } from "react";
import { api } from "~/trpc/react";

type ProjectContextType = {
  projects: Project[];
  isLoading: boolean;
  refetch: () => Promise<Project[]>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }

  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: projects = [],
    isLoading,
    refetch: rawRefetch,
  } = api.project.getAll.useQuery();

  const refetch = async () => {
    const result = await rawRefetch();
    return result.data ?? [];
  };

  return (
    <ProjectContext.Provider value={{ projects, isLoading, refetch }}>
      {children}
    </ProjectContext.Provider>
  );
};
