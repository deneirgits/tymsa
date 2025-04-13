import { sub } from "date-fns";
import { z } from "zod";
import { formatDuration } from "~/lib/utils";

import {
  type createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

async function findCurrent(ctx: Context) {
  return ctx.db.timer.findFirst({
    orderBy: { startDatetime: "desc" },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });
}

export const timerRouter = createTRPCRouter({
  startNew: protectedProcedure.mutation(async ({ ctx }) => {
    const timer = await findCurrent(ctx);
    const currentTime = new Date();
    const duration = timer?.startDatetime
      ? formatDuration(
          currentTime.getTime() - new Date(timer?.startDatetime).getTime(),
        )
      : "00:00:00";

    await ctx.db.timer.update({
      where: { id: timer?.id },
      data: {
        endDatetime: currentTime,
        duration: duration,
      },
    });

    return ctx.db.timer.create({
      data: {
        startDatetime: currentTime,
        previousId: timer?.id,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const timer = findCurrent(ctx);

    return timer ?? null;
  }),

  getRecent: protectedProcedure.query(async ({ ctx }) => {
    const timers = await ctx.db.timer.findMany({
      orderBy: { id: "desc" },
      where: {
        endDatetime: { gte: sub(new Date(), { days: 1 }) },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    const cleanedTimers = timers.map((timer) => ({
      ...timer,
      duration: timer.duration?.split(".")[0],
    }));

    return cleanedTimers ?? null;
  }),

  updateProject: protectedProcedure
    .input(z.object({ timerId: z.number(), projectId: z.nullable(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const timer = await ctx.db.timer.update({
        where: { id: input.timerId },
        data: {
          projectId: input.projectId,
        },
      });

      return timer;
    }),
});
