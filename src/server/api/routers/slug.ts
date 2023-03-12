import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const slugRouter = createTRPCRouter({
  build: publicProcedure
    .input(z.object({ slug: z.string(), url: z.string().url() }))
    .mutation(async ({ input, ctx }) => {
      const { slug, url } = input;

      const findSlug = await ctx.prisma.slug.findUnique({
        where: { slug },
      });

      if (findSlug) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Slug already exists",
        });
      }

      const createdSlug = await ctx.prisma.slug.create({
        data: {
          slug,
          url,
        },
      });

      return "slugz.ca/" + createdSlug.slug;
    }),

  get: publicProcedure
    .input(z.object({ slugId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { slugId } = input;

      const slug = await ctx.prisma.slug.findUnique({
        where: { slug: slugId },
      });

      return slug?.url as string;
    }),
});
