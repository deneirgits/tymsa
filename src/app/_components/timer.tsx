import { Square } from "lucide-react";
import { differenceInSeconds } from "node_modules/date-fns/fp/differenceInSeconds.cjs";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { formatTime } from "~/lib/utils";
import type { CurrentTimerType } from "~/types";
import { ProjectSelect } from "./project-select";

type CurrentTimerProps = {
  timer: CurrentTimerType | undefined | null;
  onButtonClick: () => Promise<void>;
};

export function CurrentTimer({ timer, onButtonClick }: CurrentTimerProps) {
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

  return (
    <div className="w-full">
      {timer ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="w-24 text-2xl font-semibold">
              {formatTime(elapsedSeconds)}
            </h1>
            <ProjectSelect timer={timer} />
          </div>
          <Button
            size="icon"
            className="cursor-pointer rounded-full border bg-gradient-to-r from-red-300 to-red-600 p-7 shadow hover:bg-gradient-to-r hover:from-red-200 hover:to-red-500"
            onClick={async (e) => {
              e.stopPropagation();
              await onButtonClick();
            }}
          >
            <Square className="size-5" strokeWidth={3} />
          </Button>
        </div>
      ) : (
        <p>You have no timers yet.</p>
      )}
    </div>
  );
}
