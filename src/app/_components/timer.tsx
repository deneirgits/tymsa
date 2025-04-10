"use client";

import { differenceInSeconds } from "node_modules/date-fns/fp/differenceInSeconds.cjs";
import { useState, useEffect } from "react";
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
    <div className="w-full max-w-xs">
      {timer ? (
        <p className="truncate">
          {formatTime(elapsedSeconds)} <span>{timer.project?.name}</span>
        </p>
      ) : (
        <p>You have no timers yet.</p>
      )}
    </div>
  );
}
