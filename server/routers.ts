import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { financeRouter } from "./modules/finance";
import { disputesRouter } from "./modules/disputes";
import { productsExtRouter } from "./modules/products";
import { servicesExtRouter } from "./modules/services";
import { jobsExtRouter } from "./modules/jobs";
import { notificationsRouter, conversationsRouter } from "./modules/notifications";

export const appRouter = router({
  system: systemRouter,

  // Financial core: wallet (available/escrow/pending-withdrawal), top-up, withdrawals,
  // transactions, revenue config (admin) — see server/modules/finance.ts
  finance: financeRouter,

  // Disputes: open/evidence/reply/admin-resolve (escrow freeze law) — server/modules/disputes.ts
  disputes: disputesRouter,

  // Market module extensions (implemented by market agents)
  productsExt: productsExtRouter,
  servicesExt: servicesExtRouter,
  jobsExt: jobsExtRouter,

  // Core UI: notifications list/mark-read + general conversations — server/modules/notifications.ts
  notifications: notificationsRouter,
  conversations: conversationsRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const bcrypt = await import('bcryptjs');
        const user = await db.getUserByEmail(input.email);
        
        if (!user || !user.password) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        
        const isValid = await bcrypt.compare(input.password, user.password);
        if (!isValid) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        
        // Update last signed in
        await db.updateUserLastSignIn(user.id);
        
        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, JSON.stringify({ userId: user.id }), cookieOptions);
        
        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),
    
    register: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const bcrypt = await import('bcryptjs');
        
        // Check if email exists
        const existing = await db.getUserByEmail(input.email);
        if (existing) {
          throw new Error('البريد الإلكتروني مستخدم بالفعل');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);
        
        // Create user
        const user = await db.createUser({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: 'user',
          loginMethod: 'email',
        });
        
        if (!user) {
          throw new Error('فشل إنشاء الحساب');
        }
        
        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, JSON.stringify({ userId: user.id }), cookieOptions);
        
        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),
    
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

  // Service Packages
  servicePackages: router({
    list: publicProcedure
      .input(z.object({ serviceId: z.number() }))
      .query(async ({ input }) => {
        return await db.getServicePackages(input.serviceId);
      }),
  }),

  // Service Orders
  serviceOrders: router({
    create: protectedProcedure
      .input(z.object({
        serviceId: z.number(),
        packageId: z.number(),
        requirements: z.string(),
        totalPrice: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createServiceOrder({
          serviceId: input.serviceId,
          buyerId: ctx.user.id,
          sellerId: 0, // Will be set from service
          titleAr: 'Service Order',
          titleEn: 'Service Order',
          descriptionAr: input.requirements,
          descriptionEn: input.requirements,
          price: input.totalPrice,
          deliveryTime: 7,
          status: 'pending',
          currency: 'SAR',
        });
      }),
    myOrders: protectedProcedure
      .input(z.object({ type: z.enum(['buyer', 'seller']) }))
      .query(async ({ ctx, input }) => {
        return await db.getMyServiceOrders(ctx.user.id, input.type);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getServiceOrderById(input.id);
      }),
  }),

  // Job Bids
  jobBids: router({
    create: protectedProcedure
      .input(z.object({
        jobId: z.number(),
        bidAmount: z.number(),
        deliveryTime: z.number(),
        proposal: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createJobBid({
          jobId: input.jobId,
          freelancerId: ctx.user.id,
          amount: input.bidAmount,
          deliveryTime: input.deliveryTime,
          proposalAr: input.proposal,
          proposalEn: input.proposal,
          status: 'pending',
          currency: 'SAR',
        });
      }),
    listByJob: publicProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ input }) => {
        return await db.getJobBids(input.jobId);
      }),
    myBids: protectedProcedure.query(async ({ ctx }) => {
      return await db.getMyBids(ctx.user.id);
    }),
  }),

  // Contracts
  contracts: router({
    create: protectedProcedure
      .input(z.object({
        jobId: z.number(),
        bidId: z.number(),
        freelancerId: z.number(),
        amount: z.number(),
        deliveryTime: z.number(),
        terms: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createContract({
          jobId: input.jobId,
          bidId: input.bidId,
          employerId: ctx.user.id,
          freelancerId: input.freelancerId,
          amount: input.amount,
          deliveryTime: input.deliveryTime,
          titleAr: input.terms,
          titleEn: input.terms,
          descriptionAr: input.terms,
          descriptionEn: input.terms,
          status: 'active',
          currency: 'SAR',
        });
      }),
    myContracts: protectedProcedure
      .input(z.object({ type: z.enum(['employer', 'freelancer']) }))
      .query(async ({ ctx, input }) => {
        return await db.getMyContracts(ctx.user.id, input.type);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContractById(input.id);
      }),
  }),

  // Admin APIs
  admin: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== 'admin') {
        throw new Error('غير مصرح لك بالوصول');
      }

      const totalUsers = await db.getTotalUsersCount();
      const totalProducts = await db.getTotalProductsCount();
      const totalServices = await db.getTotalServicesCount();
      const totalJobs = await db.getTotalJobsCount();
      const totalOrders = 0; // TODO: implement orders
      const totalRevenue = 0; // TODO: implement revenue

      return {
        totalUsers,
        totalProducts,
        totalServices,
        totalJobs,
        totalOrders,
        totalRevenue,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;

