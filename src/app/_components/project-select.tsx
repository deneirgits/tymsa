import { Circle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useProjects } from "~/contexts/ProjectContext";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { CurrentTimerType } from "~/types";

type ProjectSelectProps = {
  timer: CurrentTimerType;
};

export function ProjectSelect({ timer }: ProjectSelectProps) {
  const { projects } = useProjects();
  const [selectedValue, setSelectedValue] = useState(
    timer.project ? String(timer.project.name) : "",
  );
  const timerMutation = api.timer.updateProject.useMutation();

  const handleValueChange = async (value: string) => {
    setSelectedValue(value);

    const project = projects.find((proj) => proj.name === value);
    const projectId = project ? Number(project.id) : null;

    timerMutation.mutate({ timerId: timer.id, projectId: projectId });
  };

  useEffect(() => {
    setSelectedValue(timer.project ? String(timer.project.name) : "");
  }, [timer]);

  return (
    <Select
      value={selectedValue}
      onValueChange={(value) => handleValueChange(value)}
    >
      <SelectTrigger
        className="cursor-pointer border-0 shadow-none"
        size="sm"
        onClick={(e) => e.stopPropagation()}
      >
        <Circle fill="black" className={cn("size-2.5")} />
        <SelectValue placeholder="Project" />
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()}>
        <SelectGroup>
          <SelectLabel>Project</SelectLabel>
          {projects.map((proj) => (
            <SelectItem
              key={proj.id}
              value={String(proj.name)}
              className="cursor-pointer"
            >
              {proj.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
