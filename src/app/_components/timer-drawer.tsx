"use client";

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

export function TimerDrawer() {
  const snapPoints: [number, number] = [0.3, 1];
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleSnap = () => {
    setSnap((prev) => (prev === snapPoints[0] ? snapPoints[1] : snapPoints[0]));
  };

  const handleUpScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;

    if (el && el.scrollTop <= 0 && e.deltaY < -30) {
      setSnap(snapPoints[0]);
    }
  };

  const handleDownScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 20) {
      setSnap(snapPoints[1]);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <CurrentTimer />
            </DialogTitle>
            <DialogDescription hidden={true}>Current timer</DialogDescription>
          </DialogHeader>

          <Separator />

          <ScrollArea
            className="max-h-[80vh] overflow-x-hidden"
            onWheel={handleUpScroll}
          >
            <RecentTimers />
          </ScrollArea>
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
        <DrawerHeader
          aria-describedby="timer"
          onClick={toggleSnap}
          onWheel={handleDownScroll}
        >
          <DrawerTitle>
            <CurrentTimer />
          </DrawerTitle>
          <DrawerDescription hidden={true}>Current timer</DrawerDescription>
        </DrawerHeader>

        <div className="p-2">
          <Separator />
        </div>

        <ScrollArea
          ref={scrollRef}
          className="overflow-scroll p-4"
          onWheel={handleUpScroll}
        >
          <RecentTimers />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
