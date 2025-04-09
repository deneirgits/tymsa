import { sub } from "date-fns";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const timerRouter = createTRPCRouter({
  // start: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.timer.create({
  //       data: {
  //         name: input.name,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const timer = await ctx.db.timer.findFirst({
      orderBy: { startDatetime: "desc" },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    return timer ?? null;
  }),

  getRecent: protectedProcedure.query(async ({ ctx }) => {
    const timers = await ctx.db.timer.findMany({
      orderBy: { id: "desc" },
      where: { startDatetime: { gte: sub(new Date(), { days: 1 }) } },
      include: {
        project: {
          select: {
            name: true,
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
});
