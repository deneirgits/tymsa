"use client";

import { cn } from "~/lib/utils";

import { useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { CurrentTimer } from "~/app/_components/timer";
import { RecentTimers } from "~/app/_components/timers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { ProjectProvider } from "~/contexts/ProjectContext";

export function TimerDrawer() {
  const { data: timer, refetch: refetchTimer } =
    api.timer.getCurrent.useQuery();
  const timerMutation = api.timer.startNew.useMutation();

  const { data: timers, refetch: refetchTimers } =
    api.timer.getRecent.useQuery();

  const snapPoints: [number, number] = [0.35, 1];
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const scrollRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<HTMLDivElement>(null);

  const toggleSnap = () => {
    setSnap((prev) => (prev === snapPoints[0] ? snapPoints[1] : snapPoints[0]));
  };

  const closeOnOverScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;

    if (el && el.scrollTop <= 0 && e.deltaY < -30) {
      setSnap(snapPoints[0]);
    }
  };

  const openOnHeaderScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 20) {
      setSnap(snapPoints[1]);
    }
  };

  const handleNewTimer = async () => {
    await timerMutation.mutateAsync();
    await refetchTimer();
    await refetchTimers();
  };

  if (isDesktop) {
    return (
      <Dialog open={true} modal={false}>
        <DialogContent className="sm:max-w-sm">
          <ProjectProvider>
            <DialogHeader>
              <DialogTitle>
                <CurrentTimer timer={timer} onButtonClick={handleNewTimer} />
              </DialogTitle>
              <DialogDescription hidden={true}>Current timer</DialogDescription>
            </DialogHeader>

            <Separator />

            <ScrollArea
              className="max-h-[65vh] overflow-x-hidden"
              onWheel={closeOnOverScroll}
            >
              <RecentTimers timers={timers} />
            </ScrollArea>
          </ProjectProvider>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      modal={false}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible={false}
      open={true}
    >
      <DrawerContent aria-describedby="timer drawer">
        <ProjectProvider>
          <DrawerHeader
            aria-describedby="timer"
            onClick={toggleSnap}
            onWheel={openOnHeaderScroll}
          >
            <DrawerTitle>
              <CurrentTimer timer={timer} onButtonClick={handleNewTimer} />
            </DrawerTitle>
            <DrawerDescription hidden={true}>Current timer</DrawerDescription>
          </DrawerHeader>

          <div className="px-4" ref={snapRef}>
            <Separator />
          </div>

          <ScrollArea
            ref={scrollRef}
            className={cn("overflow-scroll p-4", {
              "h-[65lvh]": snap == snapPoints[0],
            })}
            onWheel={closeOnOverScroll}
          >
            <RecentTimers timers={timers} />
          </ScrollArea>
        </ProjectProvider>
      </DrawerContent>
    </Drawer>
  );
}
