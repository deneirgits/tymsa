import type { RecentTimerType } from "~/types";

type RecentTimersProps = {
  timers: RecentTimerType[] | null | undefined;
};

export function RecentTimers({ timers }: RecentTimersProps) {
  if (timers?.length == 0) {
    return (
      <h1 className="w-full text-center text-xl font-semibold">
        No recent timers
      </h1>
    );
  }

  return (
    <div className="min-h-lvh w-full max-w-xs">
      {timers?.map((timer) => (
        <p key={timer.id}>
          {timer.duration} <span>{timer.project?.name}</span>
        </p>
      ))}
    </div>
  );
}
