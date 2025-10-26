import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Product Categories
  productCategories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProductCategories();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductCategoryById(input.id);
      }),
  }),

  // Products
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
        status: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllProducts(input);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),
    myProducts: protectedProcedure.query(async ({ ctx }) => {
      return await db.getProductsBySellerId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        categoryId: z.number(),
        titleAr: z.string(),
        titleEn: z.string(),
        descriptionAr: z.string(),
        descriptionEn: z.string(),
        price: z.number(),
        coverImage: z.string(),
        images: z.string().optional(),
        demoUrl: z.string().optional(),
        tags: z.string().optional(),
        fileUrl: z.string(),
        fileSize: z.number().optional(),
        fileType: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createProduct({
          ...input,
          sellerId: ctx.user.id,
          currency: 'SAR',
          downloads: 0,
          views: 0,
          rating: 0,
          reviewsCount: 0,
          status: 'draft',
          isActive: true,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          titleAr: z.string().optional(),
          titleEn: z.string().optional(),
          descriptionAr: z.string().optional(),
          descriptionEn: z.string().optional(),
          price: z.number().optional(),
          coverImage: z.string().optional(),
          images: z.string().optional(),
          demoUrl: z.string().optional(),
          tags: z.string().optional(),
          status: z.enum(['draft', 'pending', 'active', 'rejected', 'suspended']).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateProduct(input.id, input.data as any);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProduct(input.id);
        return { success: true };
      }),
  }),

  // Service Categories
  serviceCategories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllServiceCategories();
    }),
  }),

  // Services
  services: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllServices(input);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getServiceById(input.id);
      }),
  }),

  // Job Categories
  jobCategories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllJobCategories();
    }),
  }),

  // Jobs
  jobs: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllJobs(input);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getJobById(input.id);
      }),
  }),

  // Wallet
  wallet: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      let wallet = await db.getWalletByUserId(ctx.user.id);
      if (!wallet) {
        await db.createWallet(ctx.user.id);
        wallet = await db.getWalletByUserId(ctx.user.id);
      }
      return wallet;
    }),
  }),
});

export type AppRouter = typeof appRouter;

