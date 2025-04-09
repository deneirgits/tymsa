"use client";

import { api } from "~/trpc/react";

export function RecentTimers() {
  const [timers] = api.timer.getRecent.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs">
      {timers.map((timer) => (
        <p key={timer.id}>
          {timer.duration} <span>{timer.project?.name}</span>
        </p>
      ))}
    </div>
  );
}
