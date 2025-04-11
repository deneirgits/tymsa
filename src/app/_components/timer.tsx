"use client";

import { CircleStop } from "lucide-react";
import { differenceInSeconds } from "node_modules/date-fns/fp/differenceInSeconds.cjs";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function CurrentTimer() {
  const [timer] = api.timer.getCurrent.useSuspenseQuery();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      if (timer?.startDatetime) {
        setElapsedSeconds(differenceInSeconds(timer.startDatetime, now));
      }
    });

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="w-full">
      {timer ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{formatTime(elapsedSeconds)}</h1>
            <span className="text-md">{timer.project?.name}</span>
          </div>
          <Button variant="ghost" size="icon">
            <CircleStop className="size-12" strokeWidth={1.5} />
          </Button>
        </div>
      ) : (
        <p>You have no timers yet.</p>
      )}
    </div>
  );
}
