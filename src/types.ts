import type { Timer } from "@prisma/client";

export type CurrentTimerType = Timer & {
  project: {
    id: number;
    name: string;
    color: string;
  } | null;
};
export type RecentTimerType = {
  duration: string | undefined;
  project: { id: number; name: string; color: string } | null;
  id: number;
  projectId: number | null;
  startDatetime: Date;
  endDatetime: Date | null;
  note: string | null;
  previousId: number | null;
};
