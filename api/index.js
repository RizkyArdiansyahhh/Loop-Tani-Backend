/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = handler;
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const express_1 = __webpack_require__(157);
const platform_express_1 = __webpack_require__(41);
const express_2 = __importDefault(__webpack_require__(157));
console.log("cwd:", process.cwd());
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
let cachedServer;
async function bootstrapServerless() {
    if (!cachedServer) {
        const expressApp = (0, express_2.default)();
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp), {
            bodyParser: false,
        });
        app.use((0, express_1.json)({ limit: '20mb' }));
        app.use((0, express_1.urlencoded)({ limit: '20mb', extended: true }));
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
        }));
        app.setGlobalPrefix('api/v1');
        const allowedOrigins = [
            "https://looptani.id",
            "https://www.looptani.id",
            "http://localhost:3000",
        ];
        app.enableCors({
            origin(origin, callback) {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
        });
        await app.init();
        cachedServer = expressApp;
    }
    return cachedServer;
}
async function handler(req, res) {
    const server = await bootstrapServerless();
    return server(req, res);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: false,
    });
    app.use((0, express_1.json)({ limit: '20mb' }));
    app.use((0, express_1.urlencoded)({ limit: '20mb', extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.setGlobalPrefix('api/v1');
    const allowedOrigins = [
        "https://looptani.id",
        "https://www.looptani.id",
        "http://localhost:3000",
    ];
    app.enableCors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    });
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Loop Tani API')
            .setDescription('REST API untuk marketplace hasil pertanian dan limbah pertanian Loop Tani.\n\n' +
            '**Auth:** Endpoint yang memerlukan autentikasi menggunakan session cookie dari Better Auth. ' +
            'Login terlebih dahulu via `/api/v1/auth/sign-in/email` sebelum mengakses endpoint yang dilindungi.')
            .setVersion('1.0')
            .addTag('Products', 'Manajemen produk marketplace')
            .addTag('Categories', 'Kategori produk')
            .addCookieAuth('better-auth.session_token')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
            },
            customSiteTitle: 'Loop Tani API Docs',
        });
        console.log(`📚 Swagger docs: http://localhost:${process.env.PORT ?? 2000}/api/docs`);
    }
    await app.listen(process.env.PORT ?? 2000);
}
if (!process.env.VERCEL) {
    bootstrap();
}


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const app_controller_1 = __webpack_require__(4);
const app_service_1 = __webpack_require__(5);
const product_module_1 = __webpack_require__(6);
const category_module_1 = __webpack_require__(24);
const cart_module_1 = __webpack_require__(28);
const prisma_module_1 = __webpack_require__(33);
const config_1 = __webpack_require__(34);
const nestjs_better_auth_1 = __webpack_require__(18);
const auth_1 = __webpack_require__(35);
const profile_module_1 = __webpack_require__(39);
const seller_module_1 = __webpack_require__(48);
const cloudinary_module_1 = __webpack_require__(47);
const knowledge_module_1 = __webpack_require__(54);
const points_module_1 = __webpack_require__(60);
const admin_module_1 = __webpack_require__(64);
const comment_module_1 = __webpack_require__(74);
const chatbot_module_1 = __webpack_require__(82);
const waste_analyzer_module_1 = __webpack_require__(87);
const address_module_1 = __webpack_require__(90);
const region_module_1 = __webpack_require__(97);
const checkout_module_1 = __webpack_require__(109);
const order_module_1 = __webpack_require__(120);
const payment_module_1 = __webpack_require__(129);
const xendit_module_1 = __webpack_require__(141);
const shipping_module_1 = __webpack_require__(142);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            nestjs_better_auth_1.AuthModule.forRoot({ auth: auth_1.auth }),
            prisma_module_1.PrismaModule,
            cloudinary_module_1.CloudinaryModule,
            xendit_module_1.XenditModule,
            product_module_1.ProductModule,
            category_module_1.CategoryModule,
            cart_module_1.CartModule,
            profile_module_1.ProfileModule,
            seller_module_1.SellerModule,
            knowledge_module_1.KnowledgeModule,
            points_module_1.PointsModule,
            admin_module_1.AdminModule,
            comment_module_1.CommentModule,
            chatbot_module_1.ChatbotModule,
            waste_analyzer_module_1.WasteAnalyzerModule,
            address_module_1.AddressModule,
            region_module_1.RegionModule,
            checkout_module_1.CheckoutModule,
            order_module_1.OrderModule,
            payment_module_1.PaymentModule,
            shipping_module_1.ShippingModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(3);
const app_service_1 = __webpack_require__(5);
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(3);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductModule = void 0;
const common_1 = __webpack_require__(3);
const product_service_1 = __webpack_require__(7);
const product_controller_1 = __webpack_require__(17);
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService],
    })
], ProductModule);


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const get_products_dto_1 = __webpack_require__(12);
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(sellerId, dto) {
        await this.assertActiveSeller(sellerId);
        const slug = await this.generateUniqueSlug(dto.title);
        const product = await this.prisma.product.create({
            data: {
                sellerId,
                category: dto.category,
                title: dto.title,
                slug,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                unit: dto.unit || 'kg',
                weight: dto.weight ?? 1000,
                condition: dto.condition,
                status: dto.status,
                isFeatured: dto.isFeatured ?? false,
                province: dto.province,
                city: dto.city,
                images: dto.images?.length
                    ? {
                        createMany: {
                            data: dto.images.map((img) => ({
                                imageUrl: img.imageUrl,
                                order: img.order,
                            })),
                        },
                    }
                    : undefined,
            },
            include: {
                images: { orderBy: { order: 'asc' } },
                seller: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        sellerProfile: {
                            select: { storeName: true, storeSlug: true, logoUrl: true },
                        },
                    },
                },
                _count: { select: { favorites: true } },
            },
        });
        return this.serializeProduct(product);
    }
    async findAll(dto, userId) {
        const { page, limit, search, category, sort, minPrice, maxPrice, province, city, minSellerRating, favoriteOnly, sellerId, storeSlug, includeOutOfStock, } = dto;
        const skip = (page - 1) * limit;
        const where = {
            ...(!sellerId && !storeSlug && { status: 'ACTIVE' }),
            ...(!includeOutOfStock && { stock: { gt: 0 } }),
            ...(search && {
                title: { contains: search, mode: 'insensitive' },
            }),
            ...(category && { category }),
            ...((minPrice !== undefined || maxPrice !== undefined) && {
                price: {
                    ...(minPrice !== undefined && { gte: minPrice }),
                    ...(maxPrice !== undefined && { lte: maxPrice }),
                },
            }),
            ...(province && {
                province: { contains: province, mode: 'insensitive' },
            }),
            ...(city && {
                city: { contains: city, mode: 'insensitive' },
            }),
            ...(minSellerRating !== undefined && {
                sellerRating: { gte: minSellerRating },
            }),
            ...(favoriteOnly && userId && {
                favorites: {
                    some: { userId },
                },
            }),
            ...(sellerId && { sellerId }),
            ...(storeSlug && {
                seller: {
                    sellerProfile: {
                        storeSlug,
                    },
                },
            }),
        };
        const orderBy = this.buildOrderBy(sort);
        const include = {
            images: {
                orderBy: { order: 'asc' },
            },
            seller: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    sellerProfile: {
                        select: { storeName: true, storeSlug: true, logoUrl: true },
                    },
                },
            },
            _count: { select: { favorites: true } },
        };
        if (userId) {
            include.favorites = { where: { userId } };
        }
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: data.map((product) => this.serializeProduct(product, userId)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId) {
        const include = {
            images: { orderBy: { order: 'asc' } },
            seller: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    sellerProfile: {
                        select: { storeName: true, storeSlug: true, logoUrl: true },
                    },
                },
            },
            _count: { select: { favorites: true } },
        };
        if (userId) {
            include.favorites = { where: { userId } };
        }
        const product = await this.prisma.product.findUnique({
            where: { id },
            include,
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with id "${id}" not found`);
        }
        return this.serializeProduct(product, userId);
    }
    async update(id, sellerId, dto) {
        await this.assertActiveSeller(sellerId);
        await this.assertOwnership(id, sellerId);
        const slug = dto.title !== undefined
            ? await this.generateUniqueSlug(dto.title, id)
            : undefined;
        const product = await this.prisma.product.update({
            where: { id },
            data: {
                ...(dto.category && { category: dto.category }),
                ...(dto.title && { title: dto.title }),
                ...(slug && { slug }),
                ...(dto.description && { description: dto.description }),
                ...(dto.price !== undefined && { price: dto.price }),
                ...(dto.stock !== undefined && { stock: dto.stock }),
                ...(dto.unit !== undefined && { unit: dto.unit }),
                ...(dto.weight !== undefined && { weight: dto.weight }),
                ...(dto.condition && { condition: dto.condition }),
                ...(dto.status && { status: dto.status }),
                ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
                ...(dto.province !== undefined && { province: dto.province }),
                ...(dto.city !== undefined && { city: dto.city }),
                ...(dto.images !== undefined && {
                    images: {
                        deleteMany: {},
                        createMany: {
                            data: dto.images.map((img) => ({
                                imageUrl: img.imageUrl,
                                order: img.order,
                            })),
                        },
                    },
                }),
            },
            include: {
                images: { orderBy: { order: 'asc' } },
                seller: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        sellerProfile: {
                            select: { storeName: true, storeSlug: true, logoUrl: true },
                        },
                    },
                },
                _count: { select: { favorites: true } },
            },
        });
        return this.serializeProduct(product, sellerId);
    }
    async remove(id, sellerId) {
        await this.assertActiveSeller(sellerId);
        await this.assertOwnership(id, sellerId);
        await this.prisma.product.delete({ where: { id } });
        return { message: 'Product deleted successfully' };
    }
    async favorite(productId, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: { id: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with id "${productId}" not found`);
        }
        try {
            await this.prisma.productFavorite.create({
                data: {
                    productId,
                    userId,
                },
            });
        }
        catch (e) {
        }
        return { message: 'Product favorited successfully' };
    }
    async unfavorite(productId, userId) {
        try {
            await this.prisma.productFavorite.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
        }
        catch (e) {
        }
        return { message: 'Product unfavorited successfully' };
    }
    serializeProduct(product, userId) {
        const isFavorite = userId
            ? Boolean(product.favorites && product.favorites.length > 0)
            : false;
        return {
            id: product.id,
            title: product.title,
            slug: product.slug,
            description: product.description,
            price: product.price,
            stock: product.stock ?? 0,
            unit: product.unit || 'kg',
            weight: product.weight || 1000,
            condition: product.condition,
            isFeatured: product.isFeatured ?? false,
            category: product.category,
            thumbnail: product.images?.[0]?.imageUrl || null,
            images: product.images || [],
            seller: {
                id: product.seller.id,
                name: product.seller.sellerProfile?.storeName || product.seller.name,
                storeName: product.seller.sellerProfile?.storeName || product.seller.name,
                image: product.seller.sellerProfile?.logoUrl || product.seller.image,
                storeSlug: product.seller.sellerProfile?.storeSlug || null,
            },
            sellerRating: product.sellerRating,
            totalReview: product.totalReview,
            location: product.city && product.province
                ? `${product.city}, ${product.province}`
                : product.province || product.city || null,
            favoriteCount: product._count?.favorites ?? 0,
            isFavorite,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
    async assertOwnership(id, sellerId) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            select: { id: true, sellerId: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with id "${id}" not found`);
        }
        if (product.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('You do not own this product');
        }
    }
    async assertActiveSeller(sellerId) {
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { userId: sellerId },
        });
        if (!profile || profile.status !== 'ACTIVE') {
            throw new common_1.ForbiddenException('Only active sellers may perform this operation.');
        }
    }
    buildOrderBy(sort) {
        switch (sort) {
            case get_products_dto_1.ProductSortBy.NEWEST:
                return [{ createdAt: 'desc' }];
            case get_products_dto_1.ProductSortBy.OLDEST:
                return [{ createdAt: 'asc' }];
            case get_products_dto_1.ProductSortBy.PRICE_ASC:
                return [{ price: 'asc' }];
            case get_products_dto_1.ProductSortBy.PRICE_DESC:
                return [{ price: 'desc' }];
            case get_products_dto_1.ProductSortBy.RECOMMENDED:
            default:
                return [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
        }
    }
    async generateUniqueSlug(title, excludeId) {
        const baseSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        let slug = baseSlug;
        let counter = 0;
        while (true) {
            const existing = await this.prisma.product.findFirst({
                where: {
                    slug,
                    ...(excludeId && { id: { not: excludeId } }),
                },
                select: { id: true },
            });
            if (!existing)
                break;
            counter++;
            slug = `${baseSlug}-${counter}`;
        }
        return slug;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProductService);


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(9);
const adapter_pg_1 = __webpack_require__(10);
const pg_1 = __webpack_require__(11);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    pool;
    constructor() {
        const pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        super({ adapter });
        this.pool = pool;
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@prisma/adapter-pg");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("pg");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetProductsDto = exports.ProductSortBy = void 0;
const swagger_1 = __webpack_require__(13);
const class_transformer_1 = __webpack_require__(14);
const class_validator_1 = __webpack_require__(15);
const product_category_enum_1 = __webpack_require__(16);
var ProductSortBy;
(function (ProductSortBy) {
    ProductSortBy["RECOMMENDED"] = "recommended";
    ProductSortBy["NEWEST"] = "newest";
    ProductSortBy["OLDEST"] = "oldest";
    ProductSortBy["PRICE_ASC"] = "price-asc";
    ProductSortBy["PRICE_DESC"] = "price-desc";
})(ProductSortBy || (exports.ProductSortBy = ProductSortBy = {}));
class GetProductsDto {
    page = 1;
    limit = 12;
    search;
    category;
    sort = ProductSortBy.RECOMMENDED;
    minPrice;
    maxPrice;
    province;
    city;
    minSellerRating;
    favoriteOnly;
    sellerId;
    storeSlug;
    includeOutOfStock;
}
exports.GetProductsDto = GetProductsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        default: 1,
        minimum: 1,
        description: 'Nomor halaman (dimulai dari 1)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetProductsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 12,
        default: 12,
        minimum: 1,
        maximum: 100,
        description: 'Jumlah produk per halaman (maksimal 100)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetProductsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'beras',
        description: 'Kata kunci pencarian berdasarkan judul produk (case-insensitive)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetProductsDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: product_category_enum_1.ProductCategory,
        description: 'Filter berdasarkan kategori produk',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            const upper = value.toUpperCase().replace(/-/g, '_');
            if (upper in product_category_enum_1.ProductCategory) {
                return upper;
            }
        }
        return value;
    }),
    (0, class_validator_1.IsEnum)(product_category_enum_1.ProductCategory),
    __metadata("design:type", typeof (_a = typeof product_category_enum_1.ProductCategory !== "undefined" && product_category_enum_1.ProductCategory) === "function" ? _a : Object)
], GetProductsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ProductSortBy,
        default: ProductSortBy.RECOMMENDED,
        description: 'Urutan tampilan produk:\n' +
            '- `recommended` — produk unggulan dulu, lalu terbaru\n' +
            '- `newest` — terbaru pertama\n' +
            '- `oldest` — terlama pertama\n' +
            '- `price-asc` — harga terendah ke tertinggi\n' +
            '- `price-desc` — harga tertinggi ke terendah',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ProductSortBy),
    __metadata("design:type", String)
], GetProductsDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10000, description: 'Harga minimum' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GetProductsDto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000000, description: 'Harga maksimum' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GetProductsDto.prototype, "maxPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jawa Tengah', description: 'Filter provinsi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetProductsDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Semarang', description: 'Filter kota' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetProductsDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4.5, description: 'Rating minimum penjual (minSellerRating)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], GetProductsDto.prototype, "minSellerRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, description: 'Tampilkan produk yang difavoritkan saja' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetProductsDto.prototype, "favoriteOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-penjual', description: 'Filter berdasarkan seller ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetProductsDto.prototype, "sellerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'tani-makmur', description: 'Filter berdasarkan store slug' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetProductsDto.prototype, "storeSlug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, description: 'Sertakan produk yang stoknya 0 (default: false)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetProductsDto.prototype, "includeOutOfStock", void 0);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductCategory = void 0;
var client_1 = __webpack_require__(9);
Object.defineProperty(exports, "ProductCategory", ({ enumerable: true, get: function () { return client_1.ProductCategory; } }));


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const product_service_1 = __webpack_require__(7);
const create_product_dto_1 = __webpack_require__(19);
const update_product_dto_1 = __webpack_require__(22);
const get_products_dto_1 = __webpack_require__(12);
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    create(session, createProductDto) {
        return this.productService.create(session.user.id, createProductDto);
    }
    findAll(session, getProductsDto) {
        return this.productService.findAll(getProductsDto, session?.user?.id);
    }
    getFavorites(session, getProductsDto) {
        return this.productService.findAll({ ...getProductsDto, favoriteOnly: true }, session.user.id);
    }
    findOne(id, session) {
        return this.productService.findOne(id, session?.user?.id);
    }
    favorite(id, session) {
        return this.productService.favorite(id, session.user.id);
    }
    unfavorite(id, session) {
        return this.productService.unfavorite(id, session.user.id);
    }
    update(id, session, updateProductDto) {
        return this.productService.update(id, session.user.id, updateProductDto);
    }
    remove(id, session) {
        return this.productService.remove(id, session.user.id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Buat produk baru',
        description: 'Membuat produk baru. Memerlukan autentikasi sebagai seller.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Produk berhasil dibuat' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_product_dto_1.CreateProductDto !== "undefined" && create_product_dto_1.CreateProductDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar produk (marketplace)',
        description: 'Mengambil daftar produk aktif dengan dukungan pagination, pencarian, filter, dan sorting. Endpoint publik.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar produk' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof get_products_dto_1.GetProductsDto !== "undefined" && get_products_dto_1.GetProductsDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('favorites'),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar produk yang disukai user',
        description: 'Mengambil daftar produk yang telah ditandai sebagai favorit oleh user yang sedang login.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar produk favorit' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof get_products_dto_1.GetProductsDto !== "undefined" && get_products_dto_1.GetProductsDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getFavorites", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Detail produk',
        description: 'Mengambil detail lengkap satu produk. Endpoint publik.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID produk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detail produk ditemukan' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Produk tidak ditemukan' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/favorite'),
    (0, swagger_1.ApiOperation)({
        summary: 'Menyukai produk',
        description: 'Menambahkan produk ke dalam daftar favorit user.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID produk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produk berhasil difavoritkan' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "favorite", null);
__decorate([
    (0, common_1.Delete)(':id/favorite'),
    (0, swagger_1.ApiOperation)({
        summary: 'Batal menyukai produk',
        description: 'Menghapus produk dari daftar favorit user.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID produk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produk berhasil dihapus dari favorit' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "unfavorite", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update produk',
        description: 'Memperbarui data produk. Hanya seller pemilik produk yang dapat mengupdate.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID produk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produk berhasil diupdate' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Produk tidak ditemukan' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Bukan pemilik produk' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof update_product_dto_1.UpdateProductDto !== "undefined" && update_product_dto_1.UpdateProductDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Hapus produk',
        description: 'Menghapus produk secara permanen. Hanya seller pemilik produk yang dapat menghapus.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID produk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produk berhasil dihapus' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Produk tidak ditemukan' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Bukan pemilik produk' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "remove", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [typeof (_a = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _a : Object])
], ProductController);


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("@thallesp/nestjs-better-auth");

/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateProductDto = exports.CreateProductImageDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_transformer_1 = __webpack_require__(14);
const class_validator_1 = __webpack_require__(15);
const product_condition_enum_1 = __webpack_require__(20);
const product_status_enum_1 = __webpack_require__(21);
const product_category_enum_1 = __webpack_require__(16);
class CreateProductImageDto {
    imageUrl;
    order;
}
exports.CreateProductImageDto = CreateProductImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        description: 'URL atau string Base64 gambar produk',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductImageDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Urutan tampilan gambar. Gambar dengan order=0 adalah gambar utama.',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductImageDto.prototype, "order", void 0);
class CreateProductDto {
    category;
    title;
    description;
    price;
    stock;
    unit;
    weight;
    condition;
    status = product_status_enum_1.ProductStatus.DRAFT;
    isFeatured = false;
    province;
    city;
    images;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: product_category_enum_1.ProductCategory,
        example: product_category_enum_1.ProductCategory.AGRICULTURAL_WASTE,
        description: 'Kategori produk',
    }),
    (0, class_validator_1.IsEnum)(product_category_enum_1.ProductCategory),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof product_category_enum_1.ProductCategory !== "undefined" && product_category_enum_1.ProductCategory) === "function" ? _a : Object)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Beras Merah Organik Premium',
        description: 'Nama/judul produk',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Beras merah organik tanpa pestisida, ditanam di sawah dataran tinggi.',
        description: 'Deskripsi lengkap produk',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 28000,
        description: 'Harga produk dalam Rupiah (minimal 0)',
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        description: 'Jumlah stok tersedia (minimal 0)',
        minimum: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'kg',
        default: 'kg',
        description: 'Satuan penjualan (contoh: kg, ton, karung, liter, pcs)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1000,
        default: 1000,
        description: 'Berat pengiriman dalam gram',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: product_condition_enum_1.ProductCondition,
        example: product_condition_enum_1.ProductCondition.NEW,
        description: 'Kondisi produk: NEW (baru) atau USED (bekas)',
    }),
    (0, class_validator_1.IsEnum)(product_condition_enum_1.ProductCondition),
    __metadata("design:type", typeof (_b = typeof product_condition_enum_1.ProductCondition !== "undefined" && product_condition_enum_1.ProductCondition) === "function" ? _b : Object)
], CreateProductDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: product_status_enum_1.ProductStatus,
        example: product_status_enum_1.ProductStatus.DRAFT,
        default: product_status_enum_1.ProductStatus.DRAFT,
        description: 'Status produk. Default DRAFT. Set ke ACTIVE agar tampil di marketplace.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(product_status_enum_1.ProductStatus),
    __metadata("design:type", typeof (_c = typeof product_status_enum_1.ProductStatus !== "undefined" && product_status_enum_1.ProductStatus) === "function" ? _c : Object)
], CreateProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: false,
        default: false,
        description: 'Tandai sebagai produk unggulan (featured). Muncul di urutan teratas.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Jawa Tengah',
        description: 'Provinsi asal pengiriman',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Semarang',
        description: 'Kota asal pengiriman',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [CreateProductImageDto],
        description: 'Daftar gambar produk. Gambar dengan order=0 adalah gambar utama.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateProductImageDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "images", void 0);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductCondition = void 0;
var ProductCondition;
(function (ProductCondition) {
    ProductCondition["NEW"] = "NEW";
    ProductCondition["USED"] = "USED";
})(ProductCondition || (exports.ProductCondition = ProductCondition = {}));


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductStatus = void 0;
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "DRAFT";
    ProductStatus["ACTIVE"] = "ACTIVE";
    ProductStatus["SOLD"] = "SOLD";
    ProductStatus["ARCHIVED"] = "ARCHIVED";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProductDto = void 0;
const mapped_types_1 = __webpack_require__(23);
const create_product_dto_1 = __webpack_require__(19);
class UpdateProductDto extends (0, mapped_types_1.PartialType)(create_product_dto_1.CreateProductDto) {
}
exports.UpdateProductDto = UpdateProductDto;


/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryModule = void 0;
const common_1 = __webpack_require__(3);
const category_controller_1 = __webpack_require__(25);
const category_service_1 = __webpack_require__(26);
let CategoryModule = class CategoryModule {
};
exports.CategoryModule = CategoryModule;
exports.CategoryModule = CategoryModule = __decorate([
    (0, common_1.Module)({
        controllers: [category_controller_1.CategoryController],
        providers: [category_service_1.CategoryService],
        exports: [category_service_1.CategoryService],
    })
], CategoryModule);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const category_service_1 = __webpack_require__(26);
const create_category_dto_1 = __webpack_require__(27);
let CategoryController = class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    create(createCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }
    findAll() {
        return this.categoryService.findAll();
    }
    findOne(id) {
        return this.categoryService.findOne(id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Buat kategori baru',
        description: 'Membuat kategori produk baru. Slug harus unik dan dalam format kebab-case lowercase. ' +
            '**Dalam production, endpoint ini seharusnya dibatasi untuk ADMIN saja.**',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Kategori berhasil dibuat',
        schema: {
            example: {
                id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                name: 'Sayuran Segar',
                slug: 'sayuran-segar',
            },
        },
    }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Slug sudah digunakan oleh kategori lain' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_category_dto_1.CreateCategoryDto !== "undefined" && create_category_dto_1.CreateCategoryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar semua kategori',
        description: 'Mengambil semua kategori produk yang tersedia, diurutkan alphabetically. Menyertakan jumlah produk per kategori. **Endpoint publik.**',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daftar kategori',
        schema: {
            example: [
                {
                    id: 'uuid',
                    name: 'Beras & Serealia',
                    slug: 'beras-serealia',
                    _count: { products: 3 },
                },
                {
                    id: 'uuid',
                    name: 'Sayuran Segar',
                    slug: 'sayuran-segar',
                    _count: { products: 8 },
                },
            ],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Detail kategori',
        description: 'Mengambil detail satu kategori berdasarkan UUID. **Endpoint publik.**',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'UUID kategori',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Detail kategori ditemukan',
        schema: {
            example: {
                id: 'uuid',
                name: 'Sayuran Segar',
                slug: 'sayuran-segar',
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Kategori tidak ditemukan' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findOne", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [typeof (_a = typeof category_service_1.CategoryService !== "undefined" && category_service_1.CategoryService) === "function" ? _a : Object])
], CategoryController);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
let CategoryService = class CategoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        throw new common_1.ForbiddenException('Kategori bersifat statis di publik. Gunakan panel admin.');
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({
            where: { type: 'MARKETPLACE' },
            orderBy: { name: 'asc' },
        });
        const groups = await this.prisma.product.groupBy({
            by: ['category'],
            where: { status: 'ACTIVE' },
            _count: { _all: true },
        });
        const countMap = groups.reduce((acc, curr) => {
            if (curr.category) {
                const raw = curr.category.toLowerCase();
                const hyphenated = raw.replace(/_/g, '-');
                acc[raw] = curr._count._all;
                acc[hyphenated] = curr._count._all;
            }
            return acc;
        }, {});
        return categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            _count: {
                products: countMap[cat.slug.toLowerCase()] || 0,
            },
        }));
    }
    async findOne(id) {
        const category = await this.prisma.category.findFirst({
            where: {
                OR: [
                    { id },
                    { slug: id },
                ],
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Kategori dengan id/slug "${id}" tidak ditemukan`);
        }
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
        };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CategoryService);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCategoryDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class CreateCategoryDto {
    name;
    slug;
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sayuran Segar',
        description: 'Nama kategori produk',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'sayuran-segar',
        description: 'Slug unik kategori dalam format kebab-case lowercase (e.g. hasil-tani)',
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'slug must be lowercase kebab-case (e.g. hasil-tani)',
    }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "slug", void 0);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CartModule = void 0;
const common_1 = __webpack_require__(3);
const cart_controller_1 = __webpack_require__(29);
const cart_service_1 = __webpack_require__(30);
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        controllers: [cart_controller_1.CartController],
        providers: [cart_service_1.CartService],
    })
], CartModule);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CartController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const cart_service_1 = __webpack_require__(30);
const add_to_cart_dto_1 = __webpack_require__(31);
const update_cart_item_dto_1 = __webpack_require__(32);
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCart(session) {
        return this.cartService.getCart(session.user.id);
    }
    addToCart(session, addToCartDto) {
        return this.cartService.addToCart(session.user.id, addToCartDto);
    }
    updateItem(session, id, updateCartItemDto) {
        return this.cartService.updateItem(session.user.id, id, updateCartItemDto);
    }
    removeItem(session, id) {
        return this.cartService.removeItem(session.user.id, id);
    }
    clearCart(session) {
        return this.cartService.clearCart(session.user.id);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Ambil isi keranjang belanja',
        description: 'Mengambil daftar produk di keranjang belanja beserta rincian ringkasan subtotal & totalWeight.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Isi keranjang belanja berhasil diambil' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Tambah produk ke keranjang',
        description: 'Menambahkan produk baru atau mengakumulasi kuantitas produk yang sudah ada di keranjang.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Produk berhasil ditambahkan ke keranjang' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Produk sendiri, status tidak aktif, atau melampaui stok' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Produk tidak ditemukan' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Produk habis (out of stock)' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof add_to_cart_dto_1.AddToCartDto !== "undefined" && add_to_cart_dto_1.AddToCartDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ubah kuantitas item keranjang',
        description: 'Memperbarui kuantitas produk yang ada di dalam keranjang belanja.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Kuantitas berhasil diperbarui' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Kuantitas melampaui batas stok' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Item keranjang tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_c = typeof update_cart_item_dto_1.UpdateCartItemDto !== "undefined" && update_cart_item_dto_1.UpdateCartItemDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Hapus satu item dari keranjang',
        description: 'Menghapus satu item produk dari keranjang belanja secara permanen.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Item berhasil dihapus' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Item keranjang tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Kosongkan isi keranjang',
        description: 'Menghapus seluruh item produk dari keranjang belanja tanpa menghapus data keranjang itu sendiri.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Keranjang berhasil dikosongkan' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [typeof (_a = typeof cart_service_1.CartService !== "undefined" && cart_service_1.CartService) === "function" ? _a : Object])
], CartController);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CartService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { orderBy: { order: 'asc' } },
                                seller: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!cart) {
            return {
                cart: null,
                items: [],
                summary: {
                    totalItems: 0,
                    subtotal: 0,
                    totalWeight: 0,
                },
            };
        }
        let totalItems = 0;
        let subtotal = 0;
        let totalWeight = 0;
        const mappedItems = cart.items.map((item) => {
            const { product } = item;
            const isAvailable = product.status === 'ACTIVE' && product.stock > 0;
            let availabilityReason = null;
            if (!isAvailable) {
                if (product.status === 'DRAFT') {
                    availabilityReason = 'DRAFT';
                }
                else if (product.status === 'SOLD') {
                    availabilityReason = 'SOLD';
                }
                else if (product.status === 'ARCHIVED') {
                    availabilityReason = 'ARCHIVED';
                }
                else if (product.stock === 0) {
                    availabilityReason = 'OUT_OF_STOCK';
                }
            }
            const itemSubtotal = isAvailable ? item.quantity * product.price : 0;
            if (isAvailable) {
                totalItems += item.quantity;
                subtotal += itemSubtotal;
                totalWeight += item.quantity * product.weight;
            }
            return {
                id: item.id,
                quantity: item.quantity,
                subtotal: itemSubtotal,
                isAvailable,
                availabilityReason,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                product: {
                    id: product.id,
                    title: product.title,
                    thumbnail: product.images?.[0]?.imageUrl || null,
                    price: product.price,
                    stock: product.stock,
                    weight: product.weight,
                    seller: product.seller,
                },
            };
        });
        return {
            cart: {
                id: cart.id,
                userId: cart.userId,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt,
            },
            items: mappedItems,
            summary: {
                totalItems,
                subtotal,
                totalWeight,
            },
        };
    }
    async addToCart(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: dto.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found.');
            }
            if (product.sellerId === userId) {
                throw new common_1.BadRequestException('You cannot add your own product to the cart.');
            }
            if (product.status !== 'ACTIVE') {
                throw new common_1.BadRequestException(`Product status is ${product.status}. Only ACTIVE products can be added to the cart.`);
            }
            if (product.stock === 0) {
                throw new common_1.ConflictException('Product is out of stock.');
            }
            let cart = await tx.cart.findUnique({
                where: { userId },
            });
            if (!cart) {
                cart = await tx.cart.create({
                    data: { userId },
                });
            }
            const existingItem = await tx.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: dto.productId,
                    },
                },
            });
            const targetQuantity = existingItem
                ? existingItem.quantity + dto.quantity
                : dto.quantity;
            if (targetQuantity > product.stock) {
                throw new common_1.BadRequestException('Requested quantity exceeds available stock.');
            }
            if (targetQuantity > 999) {
                throw new common_1.BadRequestException('Quantity exceeds maximum limit of 999.');
            }
            if (existingItem) {
                await tx.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: targetQuantity },
                });
            }
            else {
                await tx.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: dto.productId,
                        quantity: targetQuantity,
                    },
                });
            }
            await tx.cart.update({
                where: { id: cart.id },
                data: { updatedAt: new Date() },
            });
            return { message: 'Product added to cart successfully.' };
        });
    }
    async updateItem(userId, itemId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const item = await tx.cartItem.findUnique({
                where: { id: itemId },
                include: {
                    cart: true,
                    product: true,
                },
            });
            if (!item) {
                throw new common_1.NotFoundException('Cart item not found.');
            }
            if (item.cart.userId !== userId) {
                throw new common_1.ForbiddenException('You do not own this cart item.');
            }
            if (dto.quantity > item.product.stock) {
                throw new common_1.BadRequestException('Requested quantity exceeds available stock.');
            }
            await tx.cartItem.update({
                where: { id: itemId },
                data: { quantity: dto.quantity },
            });
            await tx.cart.update({
                where: { id: item.cartId },
                data: { updatedAt: new Date() },
            });
            return { message: 'Cart item quantity updated successfully.' };
        });
    }
    async removeItem(userId, itemId) {
        return this.prisma.$transaction(async (tx) => {
            const item = await tx.cartItem.findUnique({
                where: { id: itemId },
                include: { cart: true },
            });
            if (!item) {
                throw new common_1.NotFoundException('Cart item not found.');
            }
            if (item.cart.userId !== userId) {
                throw new common_1.ForbiddenException('You do not own this cart item.');
            }
            await tx.cartItem.delete({
                where: { id: itemId },
            });
            await tx.cart.update({
                where: { id: item.cartId },
                data: { updatedAt: new Date() },
            });
            return { message: 'Item removed from cart successfully.' };
        });
    }
    async clearCart(userId) {
        return this.prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { userId },
            });
            if (!cart) {
                return { message: 'Cart is already empty.' };
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            await tx.cart.update({
                where: { id: cart.id },
                data: { updatedAt: new Date() },
            });
            return { message: 'Cart cleared successfully.' };
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CartService);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddToCartDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class AddToCartDto {
    productId;
    quantity;
}
exports.AddToCartDto = AddToCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'UUID produk yang ingin ditambahkan',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Jumlah kuantitas produk yang ditambahkan (1-999)',
        minimum: 1,
        maximum: 999,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(999),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "quantity", void 0);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCartItemDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class UpdateCartItemDto {
    quantity;
}
exports.UpdateCartItemDto = UpdateCartItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2,
        description: 'Jumlah kuantitas produk yang diperbarui (1-999)',
        minimum: 1,
        maximum: 999,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(999),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateCartItemDto.prototype, "quantity", void 0);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 34 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.auth = void 0;
__webpack_require__(36);
const better_auth_1 = __webpack_require__(37);
const prisma_1 = __webpack_require__(38);
const prisma_service_1 = __webpack_require__(8);
console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
const prisma = new prisma_service_1.PrismaService();
exports.auth = (0, better_auth_1.betterAuth)({
    baseURL: process.env.BETTER_AUTH_URL,
    database: (0, prisma_1.prismaAdapter)(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }
    },
    trustedOrigins: ["http://localhost:3000", "https://looptani.id", "https://www.looptani.id"],
});


/***/ }),
/* 36 */
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),
/* 37 */
/***/ ((module) => {

module.exports = require("better-auth");

/***/ }),
/* 38 */
/***/ ((module) => {

module.exports = require("better-auth/adapters/prisma");

/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileModule = void 0;
const common_1 = __webpack_require__(3);
const profile_controller_1 = __webpack_require__(40);
const profile_service_1 = __webpack_require__(42);
const prisma_module_1 = __webpack_require__(33);
const cloudinary_module_1 = __webpack_require__(47);
let ProfileModule = class ProfileModule {
};
exports.ProfileModule = ProfileModule;
exports.ProfileModule = ProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, cloudinary_module_1.CloudinaryModule],
        controllers: [profile_controller_1.ProfileController],
        providers: [profile_service_1.ProfileService],
    })
], ProfileModule);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileController = void 0;
const common_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(41);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const profile_service_1 = __webpack_require__(42);
const update_profile_dto_1 = __webpack_require__(46);
let ProfileController = class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    getProfile(session) {
        return this.profileService.getProfile(session.user.id);
    }
    updateProfile(session, dto) {
        return this.profileService.updateProfile(session.user.id, dto);
    }
    uploadAvatar(session, file) {
        return this.profileService.uploadAvatar(session.user.id, file);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get logged-in user profile',
        description: 'Returns the full profile of the currently authenticated user, including seller profile status.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile data' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Not authenticated' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user profile',
        description: 'Update name and/or phone number of the authenticated user.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Updated profile' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Not authenticated' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof update_profile_dto_1.UpdateProfileDto !== "undefined" && update_profile_dto_1.UpdateProfileDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 2 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload avatar image',
        description: 'Uploads an avatar image to Cloudinary. Previous avatar is deleted automatically. Allowed types: JPEG, PNG. Max size: 2 MB.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Updated profile with new avatar' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Not authenticated' }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid file type, size, or format',
    }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof Express !== "undefined" && (_c = Express.Multer) !== void 0 && _c.File) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "uploadAvatar", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('Profile'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('profile'),
    __metadata("design:paramtypes", [typeof (_a = typeof profile_service_1.ProfileService !== "undefined" && profile_service_1.ProfileService) === "function" ? _a : Object])
], ProfileController);


/***/ }),
/* 41 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const cloudinary_service_1 = __webpack_require__(43);
const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
]);
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];
let ProfileService = class ProfileService {
    prisma;
    cloudinary;
    constructor(prisma, cloudinary) {
        this.prisma = prisma;
        this.cloudinary = cloudinary;
    }
    async getProfile(userId) {
        const user = await this.findUserOrThrow(userId);
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, dto) {
        await this.findUserOrThrow(userId);
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
            },
            include: { sellerProfile: true, roles: true },
        });
        return this.sanitizeUser(updated);
    }
    async uploadAvatar(userId, file) {
        this.validateAvatarFile(file);
        const user = await this.findUserOrThrow(userId);
        if (user.avatarPublicId) {
            await this.cloudinary.delete(user.avatarPublicId);
        }
        const folder = `loop-tani/avatars/${userId}`;
        const result = await this.cloudinary.upload(file.buffer, folder);
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                image: result.secure_url,
                avatarPublicId: result.public_id,
            },
            include: { sellerProfile: true, roles: true },
        });
        return this.sanitizeUser(updated);
    }
    async findUserOrThrow(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { sellerProfile: true, roles: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    validateAvatarFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type "${file.mimetype}". Only JPEG and PNG are allowed.`);
        }
        if (file.size > MAX_AVATAR_SIZE_BYTES) {
            throw new common_1.BadRequestException(`File size ${(file.size / 1024 / 1024).toFixed(2)} MB exceeds the 2 MB limit.`);
        }
        const bytes = Array.from(file.buffer.subarray(0, 4));
        const isJpeg = JPEG_MAGIC.every((b, i) => bytes[i] === b);
        const isPng = PNG_MAGIC.every((b, i) => bytes[i] === b);
        if (!isJpeg && !isPng) {
            throw new common_1.BadRequestException('File content does not match a valid image format.');
        }
    }
    sanitizeUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles: user.roles.map((r) => r.role),
            sellerProfile: user.sellerProfile
                ? {
                    id: user.sellerProfile.id,
                    storeName: user.sellerProfile.storeName,
                    storeSlug: user.sellerProfile.storeSlug,
                    logoUrl: user.sellerProfile.logoUrl,
                    status: user.sellerProfile.status,
                }
                : null,
        };
    }
    async getNotifications(userId) {
        return this.prisma.notification.findMany({
            where: {
                OR: [
                    { isGlobal: true },
                    { userId },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof cloudinary_service_1.CloudinaryService !== "undefined" && cloudinary_service_1.CloudinaryService) === "function" ? _b : Object])
], ProfileService);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryService = void 0;
const common_1 = __webpack_require__(3);
const cloudinary_1 = __webpack_require__(44);
const stream_1 = __webpack_require__(45);
let CloudinaryService = class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async upload(buffer, folder, publicId) {
        return new Promise((resolve, reject) => {
            const options = {
                folder,
                resource_type: 'image',
                ...(publicId ? { public_id: publicId } : {}),
            };
            const uploadStream = cloudinary_1.v2.uploader.upload_stream(options, (error, result) => {
                if (error || !result) {
                    reject(new common_1.InternalServerErrorException(error?.message ?? 'Cloudinary upload failed'));
                    return;
                }
                resolve(result);
            });
            const readable = new stream_1.Readable();
            readable.push(buffer);
            readable.push(null);
            readable.pipe(uploadStream);
        });
    }
    async delete(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: 'image' });
        }
        catch {
            console.error(`[Cloudinary] Failed to delete asset: ${publicId}`);
        }
    }
    async uploadVideo(buffer, folder, publicId) {
        return new Promise((resolve, reject) => {
            const options = {
                folder,
                resource_type: 'video',
                ...(publicId ? { public_id: publicId } : {}),
            };
            const uploadStream = cloudinary_1.v2.uploader.upload_stream(options, (error, result) => {
                if (error || !result) {
                    reject(new common_1.InternalServerErrorException(error?.message ?? 'Cloudinary video upload failed'));
                    return;
                }
                resolve(result);
            });
            const readable = new stream_1.Readable();
            readable.push(buffer);
            readable.push(null);
            readable.pipe(uploadStream);
        });
    }
    async deleteVideo(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: 'video' });
        }
        catch {
            console.error(`[Cloudinary] Failed to delete video asset: ${publicId}`);
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);


/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("cloudinary");

/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("stream");

/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProfileDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
class UpdateProfileDto {
    name;
    phone;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Budi Santoso',
        description: 'Full name of the user',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+6281234567890',
        description: 'Phone number in Indonesian format',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 20),
    (0, class_validator_1.Matches)(/^(\+62|62|0)[0-9]{7,15}$/, {
        message: 'Phone number must be a valid Indonesian phone number',
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryModule = void 0;
const common_1 = __webpack_require__(3);
const cloudinary_service_1 = __webpack_require__(43);
let CloudinaryModule = class CloudinaryModule {
};
exports.CloudinaryModule = CloudinaryModule;
exports.CloudinaryModule = CloudinaryModule = __decorate([
    (0, common_1.Module)({
        providers: [cloudinary_service_1.CloudinaryService],
        exports: [cloudinary_service_1.CloudinaryService],
    })
], CloudinaryModule);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellerModule = void 0;
const common_1 = __webpack_require__(3);
const seller_controller_1 = __webpack_require__(49);
const seller_service_1 = __webpack_require__(50);
const prisma_module_1 = __webpack_require__(33);
let SellerModule = class SellerModule {
};
exports.SellerModule = SellerModule;
exports.SellerModule = SellerModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [seller_controller_1.SellerController],
        providers: [seller_service_1.SellerService],
        exports: [seller_service_1.SellerService],
    })
], SellerModule);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellerController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const seller_service_1 = __webpack_require__(50);
const register_seller_dto_1 = __webpack_require__(51);
const update_seller_dto_1 = __webpack_require__(52);
const simulate_approve_dto_1 = __webpack_require__(53);
let SellerController = class SellerController {
    sellerService;
    constructor(sellerService) {
        this.sellerService = sellerService;
    }
    getSellerMe(session) {
        return this.sellerService.getSellerMe(session.user.id);
    }
    updateSellerSettings(session, dto) {
        return this.sellerService.updateSellerSettings(session.user.id, dto);
    }
    registerSeller(session, dto) {
        return this.sellerService.registerSeller(session.user.id, dto);
    }
    getDashboard(session) {
        return this.sellerService.getDashboard(session.user.id);
    }
    simulateApprove(session, dto) {
        return this.sellerService.simulateApprove(session.user.id, dto);
    }
    getStoreBySlug(slug) {
        return this.sellerService.getStoreBySlug(slug);
    }
};
exports.SellerController = SellerController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current user seller profile status',
        description: 'Fetch lightweight details of the seller profile associated with the logged-in user.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller profile retrieved successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Seller profile does not exist' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Not authenticated' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "getSellerMe", null);
__decorate([
    (0, common_1.Patch)('settings'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update seller store profile settings',
        description: 'Update store name, slug, phone, location, logo, or description for the logged-in seller.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller profile updated successfully' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Not authenticated' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof update_seller_dto_1.UpdateSellerDto !== "undefined" && update_seller_dto_1.UpdateSellerDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "updateSellerSettings", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register as a seller',
        description: 'Initiate seller registration. Sets store status to PENDING approval.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Seller profile created successfully' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Duplicate seller profile or store slug already taken' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Not authenticated' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof register_seller_dto_1.RegisterSellerDto !== "undefined" && register_seller_dto_1.RegisterSellerDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "registerSeller", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get seller dashboard analytics',
        description: 'Fetches metrics and listings for the active seller. Requires ACTIVE status.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard analytics retrieved successfully' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Seller profile does not exist or status is not ACTIVE' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Not authenticated' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('simulate-approve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Simulate seller status change (Dev/Demo only)',
        description: 'Bypasses administrative approval in dev/demo mode to update seller status. Locked in production.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller status updated successfully' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Simulation disabled in production environment' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Seller profile not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Not authenticated' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof simulate_approve_dto_1.SimulateApproveDto !== "undefined" && simulate_approve_dto_1.SimulateApproveDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "simulateApprove", null);
__decorate([
    (0, common_1.Get)('store/:slug'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get public seller storefront details by store slug',
        description: 'Fetch public details of a seller store. Endpoint is publicly accessible.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Store profile retrieved successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Store not found or not active' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "getStoreBySlug", null);
exports.SellerController = SellerController = __decorate([
    (0, swagger_1.ApiTags)('Seller'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('seller'),
    __metadata("design:paramtypes", [typeof (_a = typeof seller_service_1.SellerService !== "undefined" && seller_service_1.SellerService) === "function" ? _a : Object])
], SellerController);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellerService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
let SellerService = class SellerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSellerMe(userId) {
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { userId },
            include: {
                socialMedia: true,
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Seller profile not found');
        }
        const activeProductsCount = await this.prisma.product.count({
            where: { sellerId: userId, status: 'ACTIVE' },
        });
        return {
            ...profile,
            impactStats: {
                wasteProcessedKg: 0,
                organicProductsCount: activeProductsCount,
                farmersHelpedCount: 0,
                isUpcomingFeature: true,
            },
        };
    }
    async updateSellerSettings(userId, dto) {
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Seller profile not found');
        }
        if (dto.storeSlug && dto.storeSlug !== profile.storeSlug) {
            const existingSlug = await this.prisma.sellerProfile.findFirst({
                where: {
                    storeSlug: dto.storeSlug.toLowerCase(),
                    id: { not: profile.id },
                },
            });
            if (existingSlug) {
                throw new common_1.ConflictException('Store URL slug is already taken by another store');
            }
        }
        return this.prisma.$transaction(async (tx) => {
            if (dto.socialMedia && Array.isArray(dto.socialMedia)) {
                await tx.sellerSocialMedia.deleteMany({
                    where: { sellerId: profile.id },
                });
                const validSocials = dto.socialMedia.filter((item) => item.url && item.url.trim().length > 0);
                if (validSocials.length > 0) {
                    await tx.sellerSocialMedia.createMany({
                        data: validSocials.map((item) => ({
                            sellerId: profile.id,
                            platform: item.platform,
                            url: item.url.trim(),
                        })),
                    });
                }
            }
            return tx.sellerProfile.update({
                where: { userId },
                data: {
                    ...(dto.storeName && { storeName: dto.storeName }),
                    ...(dto.storeSlug && { storeSlug: dto.storeSlug.toLowerCase() }),
                    ...(dto.description !== undefined && { description: dto.description }),
                    ...(dto.province !== undefined && { province: dto.province }),
                    ...(dto.city !== undefined && { city: dto.city }),
                    ...(dto.address !== undefined && { address: dto.address }),
                    ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
                    ...(dto.phone !== undefined && { phone: dto.phone }),
                    ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
                    ...(dto.bannerUrl !== undefined && { bannerUrl: dto.bannerUrl }),
                },
                include: {
                    socialMedia: true,
                },
            });
        }, {
            timeout: 15000,
            maxWait: 5000,
        });
    }
    async registerSeller(userId, dto) {
        const existingProfile = await this.prisma.sellerProfile.findUnique({
            where: { userId },
        });
        if (existingProfile) {
            throw new common_1.ConflictException('User is already registered as a seller');
        }
        const slugLower = dto.storeSlug.trim().toLowerCase();
        const existingSlug = await this.prisma.sellerProfile.findFirst({
            where: { storeSlug: slugLower },
        });
        if (existingSlug) {
            throw new common_1.ConflictException('Store slug is already taken');
        }
        return this.prisma.$transaction(async (tx) => {
            const profile = await tx.sellerProfile.create({
                data: {
                    userId,
                    storeName: dto.storeName.trim(),
                    storeSlug: slugLower,
                    description: dto.description?.trim(),
                    province: dto.province?.trim(),
                    city: dto.city?.trim(),
                    address: dto.address?.trim(),
                    postalCode: dto.postalCode?.trim(),
                    phone: dto.phone?.trim(),
                    status: client_1.SellerStatus.PENDING,
                },
            });
            return profile;
        });
    }
    async getDashboard(userId) {
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.ForbiddenException('Seller profile does not exist. Please register first.');
        }
        if (profile.status !== client_1.SellerStatus.ACTIVE) {
            throw new common_1.ForbiddenException(`Seller dashboard is inaccessible because store status is ${profile.status}`);
        }
        const totalProducts = await this.prisma.product.count({
            where: { sellerId: userId },
        });
        const activeProducts = await this.prisma.product.count({
            where: { sellerId: userId, status: 'ACTIVE' },
        });
        const lowStockProducts = await this.prisma.product.findMany({
            where: {
                sellerId: userId,
                stock: { lt: 5 },
            },
            select: {
                id: true,
                title: true,
                stock: true,
                price: true,
            },
        });
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const sellerOrders = await this.prisma.order.findMany({
            where: { sellerId: userId },
            include: {
                buyer: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        let todayRevenue = 0;
        let monthlyRevenue = 0;
        sellerOrders.forEach((o) => {
            const orderDate = new Date(o.createdAt);
            const amount = Number(o.grandTotal || 0);
            if (orderDate >= startOfToday) {
                todayRevenue += amount;
            }
            if (orderDate >= startOfMonth) {
                monthlyRevenue += amount;
            }
        });
        const recentOrders = sellerOrders.slice(0, 5).map((o) => ({
            id: o.id,
            buyer: o.shippingRecipientName || o.buyer?.name || 'Pembeli',
            total: Number(o.grandTotal || 0),
            status: o.orderStatus,
            date: o.createdAt.toISOString(),
        }));
        const chartSeries = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayOrders = sellerOrders.filter((o) => {
                const oDateStr = new Date(o.createdAt).toISOString().split('T')[0];
                return oDateStr === dateStr;
            });
            const dayRevenue = dayOrders.reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);
            chartSeries.push({
                date: dateStr,
                revenue: dayRevenue,
                orders: dayOrders.length,
            });
        }
        const stats = {
            todayRevenue,
            monthlyRevenue,
            ordersCount: sellerOrders.length,
            visitorsCount: Math.max(0, sellerOrders.length * 5 + activeProducts * 3),
            conversionRate: sellerOrders.length > 0 ? '8.5%' : '0.0%',
            totalProducts,
            activeProducts,
            lowStockCount: lowStockProducts.length,
            lowStockProducts: lowStockProducts.map(p => ({
                id: p.id,
                title: p.title,
                stock: p.stock,
                price: Number(p.price),
            })),
            recentOrders,
            chartSeries,
        };
        return stats;
    }
    async simulateApprove(userId, dto) {
        const isDemo = process.env.ENABLE_DEMO_MODE === 'true';
        const isDev = process.env.NODE_ENV !== 'production';
        if (!isDemo && !isDev) {
            throw new common_1.ForbiddenException('Simulation endpoints are disabled in production mode.');
        }
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Seller profile not found to simulate approval');
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedProfile = await tx.sellerProfile.update({
                where: { userId },
                data: { status: dto.status },
            });
            if (dto.status === client_1.SellerStatus.ACTIVE) {
                await tx.userRole.upsert({
                    where: {
                        userId_role: { userId, role: client_1.Role.SELLER },
                    },
                    create: { userId, role: client_1.Role.SELLER },
                    update: {},
                });
            }
            else {
                await tx.userRole.deleteMany({
                    where: { userId, role: client_1.Role.SELLER },
                });
            }
            return updatedProfile;
        });
    }
    async getStoreBySlug(slug) {
        const slugLower = slug.trim().toLowerCase();
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { storeSlug: slugLower },
            include: {
                socialMedia: true,
                user: {
                    select: {
                        name: true,
                        image: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!profile || profile.status !== client_1.SellerStatus.ACTIVE) {
            throw new common_1.NotFoundException('Toko tidak ditemukan atau sedang tidak aktif');
        }
        const activeProducts = await this.prisma.product.findMany({
            where: {
                sellerId: profile.userId,
                status: 'ACTIVE',
            },
            select: {
                sellerRating: true,
                totalReview: true,
            },
        });
        const totalProducts = activeProducts.length;
        const totalReview = activeProducts.reduce((sum, p) => sum + p.totalReview, 0);
        const averageRating = totalReview > 0
            ? Number((activeProducts.reduce((sum, p) => sum + p.sellerRating, 0) / totalProducts).toFixed(1))
            : null;
        return {
            id: profile.id,
            userId: profile.userId,
            storeName: profile.storeName,
            storeSlug: profile.storeSlug,
            description: profile.description,
            province: profile.province,
            city: profile.city,
            address: profile.address,
            postalCode: profile.postalCode,
            phone: profile.phone,
            logoUrl: profile.logoUrl,
            bannerUrl: profile.bannerUrl,
            socialMedia: profile.socialMedia,
            status: profile.status,
            createdAt: profile.createdAt,
            user: {
                name: profile.user.name,
                image: profile.user.image,
                joinedAt: profile.user.createdAt,
            },
            stats: {
                totalProducts,
                totalReview,
                averageRating,
            },
            impactStats: {
                wasteProcessedKg: 0,
                organicProductsCount: totalProducts,
                farmersHelpedCount: 0,
                isUpcomingFeature: true,
            },
        };
    }
};
exports.SellerService = SellerService;
exports.SellerService = SellerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SellerService);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterSellerDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
class RegisterSellerDto {
    storeName;
    storeSlug;
    phone;
    province;
    city;
    postalCode;
    address;
    description;
}
exports.RegisterSellerDto = RegisterSellerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Toko Hijau',
        description: 'Store display name',
        maxLength: 80,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterSellerDto.prototype, "storeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'toko-hijau',
        description: 'URL-safe store slug. Lowercase letters, numbers, and hyphens only.',
        maxLength: 60,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(60),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Store slug must be lowercase and contain only letters, numbers, and hyphens. It cannot start or end with a hyphen.',
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    __metadata("design:type", String)
], RegisterSellerDto.prototype, "storeSlug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+6281234567890',
        description: 'Store contact phone number',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 20),
    (0, class_validator_1.Matches)(/^(\+62|62|0)[0-9]{7,15}$/, {
        message: 'Phone number must be a valid Indonesian phone number',
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterSellerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jawa Barat', description: 'Province' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterSellerDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bandung', description: 'City' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterSellerDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '40123', description: 'Postal code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[0-9]{5}$/, { message: 'Postal code must be 5 digits' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterSellerDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Jl. Merdeka No. 10',
        description: 'Store address',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterSellerDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Kami menjual hasil pertanian organik berkualitas tinggi.',
        description: 'Store description',
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterSellerDto.prototype, "description", void 0);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateSellerDto = exports.SocialMediaItemDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
const client_1 = __webpack_require__(9);
class SocialMediaItemDto {
    platform;
    url;
}
exports.SocialMediaItemDto = SocialMediaItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.SocialPlatform }),
    (0, class_validator_1.IsEnum)(client_1.SocialPlatform),
    __metadata("design:type", typeof (_a = typeof client_1.SocialPlatform !== "undefined" && client_1.SocialPlatform) === "function" ? _a : Object)
], SocialMediaItemDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://instagram.com/tanimakmur' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocialMediaItemDto.prototype, "url", void 0);
class UpdateSellerDto {
    storeName;
    storeSlug;
    phone;
    province;
    city;
    postalCode;
    address;
    description;
    logoUrl;
    bannerUrl;
    socialMedia;
}
exports.UpdateSellerDto = UpdateSellerDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Toko Hijau',
        description: 'Nama tampilan toko',
        maxLength: 80,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "storeName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'toko-hijau',
        description: 'URL Slug toko',
        maxLength: 60,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Store slug must be lowercase and contain only letters, numbers, and hyphens.',
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "storeSlug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+6281234567890',
        description: 'Nomor WhatsApp / telepon toko',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 20),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jawa Barat', description: 'Provinsi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bandung', description: 'Kota' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '40123', description: 'Kode pos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jl. Merdeka No. 10', description: 'Alamat toko' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Deskripsi toko...', description: 'Deskripsi toko' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'data:image/png;base64,...', description: 'Logo toko (URL or Base64)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'data:image/png;base64,...', description: 'Banner toko (URL or Base64)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSellerDto.prototype, "bannerUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [SocialMediaItemDto], description: 'Daftar media sosial toko' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SocialMediaItemDto),
    __metadata("design:type", Array)
], UpdateSellerDto.prototype, "socialMedia", void 0);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimulateApproveDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const client_1 = __webpack_require__(9);
class SimulateApproveDto {
    status;
}
exports.SimulateApproveDto = SimulateApproveDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.SellerStatus,
        example: 'ACTIVE',
        description: 'Status baru untuk simulasi approval seller',
    }),
    (0, class_validator_1.IsEnum)(client_1.SellerStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof client_1.SellerStatus !== "undefined" && client_1.SellerStatus) === "function" ? _a : Object)
], SimulateApproveDto.prototype, "status", void 0);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KnowledgeModule = void 0;
const common_1 = __webpack_require__(3);
const knowledge_controller_1 = __webpack_require__(55);
const knowledge_service_1 = __webpack_require__(56);
const cloudinary_module_1 = __webpack_require__(47);
let KnowledgeModule = class KnowledgeModule {
};
exports.KnowledgeModule = KnowledgeModule;
exports.KnowledgeModule = KnowledgeModule = __decorate([
    (0, common_1.Module)({
        imports: [cloudinary_module_1.CloudinaryModule],
        controllers: [knowledge_controller_1.KnowledgeController],
        providers: [knowledge_service_1.KnowledgeService],
        exports: [knowledge_service_1.KnowledgeService],
    })
], KnowledgeModule);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KnowledgeController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const platform_express_1 = __webpack_require__(41);
const knowledge_service_1 = __webpack_require__(56);
const create_content_dto_1 = __webpack_require__(57);
const complete_content_dto_1 = __webpack_require__(58);
const get_contents_dto_1 = __webpack_require__(59);
const cloudinary_service_1 = __webpack_require__(43);
let KnowledgeController = class KnowledgeController {
    knowledgeService;
    cloudinaryService;
    constructor(knowledgeService, cloudinaryService) {
        this.knowledgeService = knowledgeService;
        this.cloudinaryService = cloudinaryService;
    }
    create(session, dto) {
        return this.knowledgeService.create(session.user.id, dto);
    }
    findAll(dto) {
        return this.knowledgeService.findAll(dto);
    }
    getProgress(contentId, session) {
        return this.knowledgeService.getProgress(contentId, session.user.id);
    }
    async uploadVideo(session, file) {
        const userRole = session.user.role === 'ADMIN' ||
            (Array.isArray(session.user.role) && session.user.role.includes('ADMIN'));
        if (!userRole) {
            throw new common_1.ForbiddenException('Hanya Admin yang diperbolehkan mengupload video.');
        }
        if (!file) {
            throw new common_1.BadRequestException('File video harus disertakan.');
        }
        const folder = `loop-tani/videos/${session.user.id}`;
        const result = await this.cloudinaryService.uploadVideo(file.buffer, folder);
        const secureUrl = result.secure_url;
        const duration = result.duration ? Math.round(result.duration) : 0;
        const thumbnailUrl = secureUrl.substring(0, secureUrl.lastIndexOf('.')) + '.jpg';
        return {
            secure_url: secureUrl,
            public_id: result.public_id,
            duration,
            thumbnail: thumbnailUrl,
        };
    }
    complete(contentId, session, dto) {
        return this.knowledgeService.complete(contentId, session.user.id, dto);
    }
    claim(contentId, session) {
        return this.knowledgeService.claim(contentId, session.user.id);
    }
    findOne(idOrSlug, session) {
        return this.knowledgeService.findOne(idOrSlug, session?.user?.id);
    }
    remove(id, session) {
        return this.knowledgeService.remove(id, session.user.id);
    }
};
exports.KnowledgeController = KnowledgeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Buat konten panduan tani baru',
        description: 'Membuat artikel/video panduan tani baru. Memerlukan autentikasi.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Konten berhasil dibuat' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof create_content_dto_1.CreateContentDto !== "undefined" && create_content_dto_1.CreateContentDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], KnowledgeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar konten panduan tani (publik)',
        description: 'Mengambil daftar konten panduan tani aktif (artikel/video) dengan pagination dan filter.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar konten ditemukan' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof get_contents_dto_1.GetContentsDto !== "undefined" && get_contents_dto_1.GetContentsDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], KnowledgeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':contentId/progress'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ambil progress belajar user untuk suatu konten',
        description: 'Mendapatkan data detail scroll/watch progress belajar user saat ini.',
    }),
    (0, swagger_1.ApiParam)({ name: 'contentId', description: 'UUID konten panduan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress ditemukan' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('contentId', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KnowledgeController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Post)('upload-video'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload video panduan ke Cloudinary (Admin only)',
        description: 'Mengupload file video (mp4, mkv, dll) ke Cloudinary dan mengembalikan metadata detail.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Video berhasil diupload ke Cloudinary' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof Express !== "undefined" && (_e = Express.Multer) !== void 0 && _e.File) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Post)(':contentId/complete'),
    (0, swagger_1.ApiOperation)({
        summary: 'Laporkan progress/selesai belajar konten',
        description: 'Mengirimkan progress belajar (scroll/waktu aktif/watch) ke server. Server memvalidasi thresholds.',
    }),
    (0, swagger_1.ApiParam)({ name: 'contentId', description: 'UUID konten panduan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress berhasil diverifikasi' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('contentId', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_g = typeof complete_content_dto_1.CompleteContentDto !== "undefined" && complete_content_dto_1.CompleteContentDto) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], KnowledgeController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':contentId/claim'),
    (0, swagger_1.ApiOperation)({
        summary: 'Klaim LoopPoints reward setelah menyelesaikan konten',
        description: 'Mengklaim poin reward. Menambahkan ke balance user melalui transaksi database aman.',
    }),
    (0, swagger_1.ApiParam)({ name: 'contentId', description: 'UUID konten panduan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'LoopPoints berhasil diklaim' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('contentId', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KnowledgeController.prototype, "claim", null);
__decorate([
    (0, common_1.Get)(':idOrSlug'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Detail konten panduan tani',
        description: 'Mengambil detail lengkap satu artikel/video panduan tani berdasarkan ID atau slug.',
    }),
    (0, swagger_1.ApiParam)({ name: 'idOrSlug', description: 'UUID atau slug konten panduan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detail konten ditemukan' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Konten tidak ditemukan' }),
    __param(0, (0, common_1.Param)('idOrSlug')),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KnowledgeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Hapus konten panduan tani',
        description: 'Menghapus konten secara permanen. Hanya admin atau pembuat konten yang berwenang.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID konten panduan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Konten berhasil dihapus' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KnowledgeController.prototype, "remove", null);
exports.KnowledgeController = KnowledgeController = __decorate([
    (0, swagger_1.ApiTags)('Knowledge'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('knowledge'),
    __metadata("design:paramtypes", [typeof (_a = typeof knowledge_service_1.KnowledgeService !== "undefined" && knowledge_service_1.KnowledgeService) === "function" ? _a : Object, typeof (_b = typeof cloudinary_service_1.CloudinaryService !== "undefined" && cloudinary_service_1.CloudinaryService) === "function" ? _b : Object])
], KnowledgeController);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KnowledgeService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
let KnowledgeService = class KnowledgeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateUniqueSlug(title) {
        const baseSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        let slug = baseSlug;
        let counter = 0;
        while (true) {
            const existing = await this.prisma.knowledgeContent.findUnique({
                where: { slug },
                select: { id: true },
            });
            if (!existing)
                break;
            counter++;
            slug = `${baseSlug}-${counter}`;
        }
        return slug;
    }
    calculateEstimatedReadingTime(content) {
        const words = content.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    }
    async create(userId, dto) {
        const userRole = await this.prisma.userRole.findFirst({
            where: { userId },
        });
        const slug = await this.generateUniqueSlug(dto.title);
        let estimatedReadingMinutes = dto.estimatedReadingMinutes;
        if (dto.type === client_1.ContentType.ARTICLE && !estimatedReadingMinutes) {
            estimatedReadingMinutes = this.calculateEstimatedReadingTime(dto.content);
        }
        let status = dto.status ?? client_1.ContentStatus.DRAFT;
        if (userRole?.role === 'SELLER') {
            status = client_1.ContentStatus.PENDING_REVIEW;
            if (dto.type === client_1.ContentType.VIDEO) {
                throw new common_1.ForbiddenException('Seller tidak diperbolehkan mengupload video.');
            }
        }
        const content = await this.prisma.knowledgeContent.create({
            data: {
                type: dto.type,
                title: dto.title,
                slug,
                content: dto.content,
                category: dto.category,
                difficulty: dto.difficulty,
                imageUrl: dto.imageUrl,
                rewardPoint: dto.rewardPoint ?? 20,
                estimatedReadingMinutes,
                videoDuration: dto.videoDuration,
                cloudinaryPublicId: dto.cloudinaryPublicId,
                secureUrl: dto.secureUrl,
                thumbnailUrl: dto.thumbnailUrl,
                status,
                authorId: userId,
            },
            include: {
                author: {
                    select: { id: true, name: true, image: true, roles: { select: { role: true } } },
                },
            },
        });
        return this.serializeContent(content);
    }
    async findAll(dto) {
        const { page, limit, search, type, category, difficulty } = dto;
        const skip = (page - 1) * limit;
        const where = {
            status: client_1.ContentStatus.PUBLISHED,
            ...(type && { type }),
            ...(category && { category }),
            ...(difficulty && { difficulty }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.knowledgeContent.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, name: true, image: true, roles: { select: { role: true } } },
                    },
                },
            }),
            this.prisma.knowledgeContent.count({ where }),
        ]);
        return {
            data: data.map((item) => this.serializeContent(item)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(idOrSlug, userId) {
        const content = await this.prisma.knowledgeContent.findFirst({
            where: {
                OR: [
                    { id: idOrSlug },
                    { slug: idOrSlug },
                ],
            },
            include: {
                author: {
                    select: { id: true, name: true, image: true, roles: { select: { role: true } } },
                },
            },
        });
        if (!content) {
            throw new common_1.NotFoundException('Konten panduan tani tidak ditemukan.');
        }
        let progress = null;
        if (userId) {
            progress = await this.prisma.learningProgress.findUnique({
                where: {
                    userId_contentId: {
                        userId,
                        contentId: content.id,
                    },
                },
            });
        }
        return {
            ...this.serializeContent(content),
            progress: progress
                ? {
                    scrollPercentage: progress.scrollPercentage,
                    activeReadingSeconds: progress.activeReadingSeconds,
                    watchedPercentage: progress.watchedPercentage,
                    completed: progress.completed,
                    rewardClaimed: progress.rewardClaimed,
                    completedAt: progress.completedAt,
                }
                : null,
        };
    }
    async complete(contentId, userId, dto) {
        const content = await this.prisma.knowledgeContent.findUnique({
            where: { id: contentId },
        });
        if (!content) {
            throw new common_1.NotFoundException('Konten panduan tani tidak ditemukan.');
        }
        let progress = await this.prisma.learningProgress.findUnique({
            where: {
                userId_contentId: {
                    userId,
                    contentId,
                },
            },
        });
        if (progress?.completed) {
            return {
                completed: true,
                canClaim: !progress.rewardClaimed,
            };
        }
        let meetsThreshold = false;
        if (content.type === client_1.ContentType.ARTICLE) {
            const scrollPercentage = dto.scrollPercentage ?? 0;
            const activeReadingSeconds = dto.activeReadingSeconds ?? 0;
            const estimatedSecs = (content.estimatedReadingMinutes ?? 5) * 60;
            const requiredReadingSecs = estimatedSecs * 0.7;
            if (scrollPercentage >= 90 && activeReadingSeconds >= requiredReadingSecs) {
                meetsThreshold = true;
            }
        }
        else if (content.type === client_1.ContentType.VIDEO) {
            const watchedPercentage = dto.watchedPercentage ?? 0;
            if (watchedPercentage >= 80) {
                meetsThreshold = true;
            }
        }
        progress = await this.prisma.learningProgress.upsert({
            where: {
                userId_contentId: {
                    userId,
                    contentId,
                },
            },
            create: {
                userId,
                contentId,
                scrollPercentage: dto.scrollPercentage ?? 0,
                activeReadingSeconds: dto.activeReadingSeconds ?? 0,
                watchedPercentage: dto.watchedPercentage ?? 0,
                completed: meetsThreshold,
                completedAt: meetsThreshold ? new Date() : null,
            },
            update: {
                scrollPercentage: Math.max(progress?.scrollPercentage ?? 0, dto.scrollPercentage ?? 0),
                activeReadingSeconds: Math.max(progress?.activeReadingSeconds ?? 0, dto.activeReadingSeconds ?? 0),
                watchedPercentage: Math.max(progress?.watchedPercentage ?? 0, dto.watchedPercentage ?? 0),
                ...(meetsThreshold && !progress?.completed
                    ? {
                        completed: true,
                        completedAt: new Date(),
                    }
                    : {}),
            },
        });
        return {
            completed: progress.completed,
            canClaim: progress.completed && !progress.rewardClaimed,
        };
    }
    async claim(contentId, userId) {
        const content = await this.prisma.knowledgeContent.findUnique({
            where: { id: contentId },
        });
        if (!content) {
            throw new common_1.NotFoundException('Konten panduan tani tidak ditemukan.');
        }
        const progress = await this.prisma.learningProgress.findUnique({
            where: {
                userId_contentId: {
                    userId,
                    contentId,
                },
            },
        });
        if (!progress) {
            throw new common_1.BadRequestException('Progress belajar tidak ditemukan.');
        }
        if (!progress.completed) {
            throw new common_1.BadRequestException('Selesaikan membaca/menonton konten terlebih dahulu sebelum klaim.');
        }
        if (progress.rewardClaimed) {
            throw new common_1.ConflictException('Reward poin untuk konten ini sudah diklaim.');
        }
        const rewardPoint = content.rewardPoint;
        const transactionResult = await this.prisma.$transaction(async (tx) => {
            await tx.learningProgress.update({
                where: {
                    userId_contentId: {
                        userId,
                        contentId,
                    },
                },
                data: {
                    rewardClaimed: true,
                },
            });
            await tx.pointTransaction.create({
                data: {
                    userId,
                    amount: rewardPoint,
                    type: client_1.PointTransactionType.EARN,
                    description: `Klaim poin dari ${content.type === client_1.ContentType.ARTICLE ? 'Artikel' : 'Video'}: ${content.title}`,
                    sourceId: contentId,
                    sourceType: 'KNOWLEDGE_CONTENT',
                },
            });
            const pointAccount = await tx.userPointAccount.upsert({
                where: { userId },
                create: {
                    userId,
                    totalPoint: rewardPoint,
                    lifetimePoint: rewardPoint,
                    tier: this.calculateTier(rewardPoint),
                },
                update: {
                    totalPoint: { increment: rewardPoint },
                    lifetimePoint: { increment: rewardPoint },
                },
            });
            const updatedTier = this.calculateTier(pointAccount.lifetimePoint);
            const finalAccount = await tx.userPointAccount.update({
                where: { userId },
                data: { tier: updatedTier },
            });
            return finalAccount;
        });
        return {
            pointsEarned: rewardPoint,
            totalPoints: transactionResult.totalPoint,
            tier: transactionResult.tier,
        };
    }
    async getProgress(contentId, userId) {
        const progress = await this.prisma.learningProgress.findUnique({
            where: {
                userId_contentId: {
                    userId,
                    contentId,
                },
            },
        });
        return progress ?? {
            scrollPercentage: 0,
            activeReadingSeconds: 0,
            watchedPercentage: 0,
            completed: false,
            rewardClaimed: false,
        };
    }
    async remove(id, userId) {
        const content = await this.prisma.knowledgeContent.findUnique({
            where: { id },
        });
        if (!content) {
            throw new common_1.NotFoundException('Konten tidak ditemukan.');
        }
        const userRole = await this.prisma.userRole.findFirst({
            where: { userId },
        });
        if (userRole?.role !== 'ADMIN' && content.authorId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak berwenang menghapus konten ini.');
        }
        await this.prisma.knowledgeContent.delete({ where: { id } });
        return { message: 'Konten berhasil dihapus.' };
    }
    calculateTier(lifetimePoints) {
        if (lifetimePoints >= 2500)
            return client_1.PointTier.PLATINUM;
        if (lifetimePoints >= 1000)
            return client_1.PointTier.GOLD;
        if (lifetimePoints >= 300)
            return client_1.PointTier.SILVER;
        return client_1.PointTier.BRONZE;
    }
    serializeContent(item) {
        const authorRole = item.author?.roles?.[0]?.role ?? 'BUYER';
        let roleLabel = 'Petani Mitra';
        if (authorRole === 'ADMIN')
            roleLabel = 'Admin LoopTani';
        else if (authorRole === 'SELLER')
            roleLabel = 'Petani Ahli';
        return {
            id: item.id,
            slug: item.slug,
            type: item.type === client_1.ContentType.ARTICLE ? 'artikel' : 'video',
            title: item.title,
            category: item.category,
            difficulty: item.difficulty,
            imageUrl: item.imageUrl,
            points: item.rewardPoint,
            duration: item.type === client_1.ContentType.ARTICLE
                ? `${item.estimatedReadingMinutes} menit baca`
                : this.formatVideoDuration(item.videoDuration),
            content: item.content,
            youtubeId: item.type === client_1.ContentType.VIDEO ? item.secureUrl : undefined,
            cloudinaryPublicId: item.cloudinaryPublicId,
            secureUrl: item.secureUrl,
            thumbnailUrl: item.thumbnailUrl,
            status: item.status,
            createdAt: item.createdAt,
            uploader: {
                id: item.author.id,
                name: item.author.name,
                avatarUrl: item.author.image,
                role: roleLabel,
            },
        };
    }
    formatVideoDuration(seconds) {
        if (!seconds)
            return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};
exports.KnowledgeService = KnowledgeService;
exports.KnowledgeService = KnowledgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], KnowledgeService);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateContentDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const client_1 = __webpack_require__(9);
class CreateContentDto {
    type;
    title;
    content;
    category;
    difficulty;
    imageUrl;
    rewardPoint;
    estimatedReadingMinutes;
    videoDuration;
    cloudinaryPublicId;
    secureUrl;
    thumbnailUrl;
    status;
}
exports.CreateContentDto = CreateContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ContentType,
        example: client_1.ContentType.ARTICLE,
        description: 'Tipe konten (ARTICLE / VIDEO)',
    }),
    (0, class_validator_1.IsEnum)(client_1.ContentType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof client_1.ContentType !== "undefined" && client_1.ContentType) === "function" ? _a : Object)
], CreateContentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Cara Mengolah Jerami Padi Menjadi Briket',
        description: 'Judul konten',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Isi lengkap artikel tentang briket...',
        description: 'Isi teks/deskripsi konten',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ContentCategory,
        example: client_1.ContentCategory.OLAHAN,
        description: 'Kategori konten',
    }),
    (0, class_validator_1.IsEnum)(client_1.ContentCategory),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_b = typeof client_1.ContentCategory !== "undefined" && client_1.ContentCategory) === "function" ? _b : Object)
], CreateContentDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ContentDifficulty,
        example: client_1.ContentDifficulty.PEMULA,
        description: 'Tingkat kesulitan',
    }),
    (0, class_validator_1.IsEnum)(client_1.ContentDifficulty),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_c = typeof client_1.ContentDifficulty !== "undefined" && client_1.ContentDifficulty) === "function" ? _c : Object)
], CreateContentDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://res.cloudinary.com/demo/image/upload/cover.jpg',
        description: 'URL gambar cover/thumbnail',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 20,
        description: 'Poin reward yang didapatkan',
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateContentDto.prototype, "rewardPoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 5,
        description: 'Estimasi waktu membaca dalam menit (untuk artikel)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateContentDto.prototype, "estimatedReadingMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 360,
        description: 'Durasi video dalam detik (untuk video)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateContentDto.prototype, "videoDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'loop-tani/videos/123456',
        description: 'Cloudinary Public ID (untuk video)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "cloudinaryPublicId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://res.cloudinary.com/demo/video/upload/video.mp4',
        description: 'Cloudinary Secure URL (untuk video)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "secureUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://res.cloudinary.com/demo/video/upload/video.jpg',
        description: 'Cloudinary Video Thumbnail URL (untuk video)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.ContentStatus,
        example: client_1.ContentStatus.DRAFT,
        description: 'Status publikasi konten',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ContentStatus),
    __metadata("design:type", typeof (_d = typeof client_1.ContentStatus !== "undefined" && client_1.ContentStatus) === "function" ? _d : Object)
], CreateContentDto.prototype, "status", void 0);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompleteContentDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class CompleteContentDto {
    scrollPercentage;
    activeReadingSeconds;
    watchedPercentage;
}
exports.CompleteContentDto = CompleteContentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 95.5,
        description: 'Persentase scroll halaman (0-100)',
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CompleteContentDto.prototype, "scrollPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 120,
        description: 'Durasi aktif membaca dalam detik',
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CompleteContentDto.prototype, "activeReadingSeconds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 85.0,
        description: 'Persentase video yang ditonton (0-100)',
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CompleteContentDto.prototype, "watchedPercentage", void 0);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetContentsDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_transformer_1 = __webpack_require__(14);
const class_validator_1 = __webpack_require__(15);
const client_1 = __webpack_require__(9);
class GetContentsDto {
    page = 1;
    limit = 10;
    search;
    type;
    category;
    difficulty;
}
exports.GetContentsDto = GetContentsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        default: 1,
        minimum: 1,
        description: 'Halaman ke-n',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetContentsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100,
        description: 'Jumlah konten per halaman',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetContentsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'jerami',
        description: 'Pencarian kata kunci judul/isi konten',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetContentsDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.ContentType,
        description: 'Filter berdasarkan tipe konten (ARTICLE / VIDEO)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ContentType),
    __metadata("design:type", typeof (_a = typeof client_1.ContentType !== "undefined" && client_1.ContentType) === "function" ? _a : Object)
], GetContentsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.ContentCategory,
        description: 'Filter berdasarkan kategori konten',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ContentCategory),
    __metadata("design:type", typeof (_b = typeof client_1.ContentCategory !== "undefined" && client_1.ContentCategory) === "function" ? _b : Object)
], GetContentsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.ContentDifficulty,
        description: 'Filter berdasarkan tingkat kesulitan',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ContentDifficulty),
    __metadata("design:type", typeof (_c = typeof client_1.ContentDifficulty !== "undefined" && client_1.ContentDifficulty) === "function" ? _c : Object)
], GetContentsDto.prototype, "difficulty", void 0);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointsModule = void 0;
const common_1 = __webpack_require__(3);
const points_controller_1 = __webpack_require__(61);
const points_service_1 = __webpack_require__(62);
let PointsModule = class PointsModule {
};
exports.PointsModule = PointsModule;
exports.PointsModule = PointsModule = __decorate([
    (0, common_1.Module)({
        controllers: [points_controller_1.PointsController],
        providers: [points_service_1.PointsService],
        exports: [points_service_1.PointsService],
    })
], PointsModule);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointsController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const points_service_1 = __webpack_require__(62);
const get_transactions_dto_1 = __webpack_require__(63);
let PointsController = class PointsController {
    pointsService;
    constructor(pointsService) {
        this.pointsService = pointsService;
    }
    getAccount(session) {
        return this.pointsService.getAccount(session.user.id);
    }
    getTransactions(session, dto) {
        return this.pointsService.getTransactions(session.user.id, dto);
    }
};
exports.PointsController = PointsController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Dapatkan saldo LoopPoints user saat ini',
        description: 'Mengembalikan detail saldo poin, poin seumur hidup, dan tier member user yang sedang login.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Informasi LoopPoints berhasil didapatkan' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Riwayat transaksi LoopPoints (paginated)',
        description: 'Mengambil daftar riwayat perolehan/penggunaan LoopPoints user yang sedang login.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Riwayat transaksi berhasil didapatkan' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof get_transactions_dto_1.GetTransactionsDto !== "undefined" && get_transactions_dto_1.GetTransactionsDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "getTransactions", null);
exports.PointsController = PointsController = __decorate([
    (0, swagger_1.ApiTags)('Points'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('points'),
    __metadata("design:paramtypes", [typeof (_a = typeof points_service_1.PointsService !== "undefined" && points_service_1.PointsService) === "function" ? _a : Object])
], PointsController);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
let PointsService = class PointsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAccount(userId) {
        return this.prisma.userPointAccount.upsert({
            where: { userId },
            create: {
                userId,
                totalPoint: 0,
                lifetimePoint: 0,
                tier: client_1.PointTier.BRONZE,
            },
            update: {},
        });
    }
    async getTransactions(userId, dto) {
        const { page, limit } = dto;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.pointTransaction.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.pointTransaction.count({
                where: { userId },
            }),
        ]);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.PointsService = PointsService;
exports.PointsService = PointsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PointsService);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetTransactionsDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_transformer_1 = __webpack_require__(14);
const class_validator_1 = __webpack_require__(15);
class GetTransactionsDto {
    page = 1;
    limit = 10;
}
exports.GetTransactionsDto = GetTransactionsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        default: 1,
        minimum: 1,
        description: 'Halaman ke-n',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetTransactionsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100,
        description: 'Jumlah transaksi per halaman',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetTransactionsDto.prototype, "limit", void 0);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(3);
const admin_controller_1 = __webpack_require__(65);
const admin_service_1 = __webpack_require__(66);
const prisma_module_1 = __webpack_require__(33);
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const admin_service_1 = __webpack_require__(66);
const update_user_status_dto_1 = __webpack_require__(67);
const update_user_roles_dto_1 = __webpack_require__(68);
const verify_seller_dto_1 = __webpack_require__(69);
const create_category_dto_1 = __webpack_require__(70);
const create_knowledge_dto_1 = __webpack_require__(71);
const create_reward_dto_1 = __webpack_require__(72);
const create_notification_dto_1 = __webpack_require__(73);
const client_1 = __webpack_require__(9);
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboard(session) {
        return this.adminService.getDashboard(session.user.id);
    }
    getUsers(session, page, limit, search) {
        return this.adminService.getUsers(session.user.id, page ?? 1, limit ?? 10, search);
    }
    updateUserStatus(session, targetUserId, dto) {
        return this.adminService.updateUserStatus(session.user.id, targetUserId, dto);
    }
    updateUserRoles(session, targetUserId, dto) {
        return this.adminService.updateUserRoles(session.user.id, targetUserId, dto);
    }
    getSellers(session, status) {
        return this.adminService.getSellers(session.user.id, status);
    }
    verifySeller(session, targetSellerUserId, dto) {
        return this.adminService.verifySeller(session.user.id, targetSellerUserId, dto);
    }
    getCategories(session) {
        return this.adminService.getCategories(session.user.id);
    }
    createCategory(session, dto) {
        return this.adminService.createCategory(session.user.id, dto);
    }
    updateCategory(session, id, dto) {
        return this.adminService.updateCategory(session.user.id, id, dto);
    }
    deleteCategory(session, id) {
        return this.adminService.deleteCategory(session.user.id, id);
    }
    getKnowledge(session) {
        return this.adminService.getKnowledge(session.user.id);
    }
    createKnowledge(session, dto) {
        return this.adminService.createKnowledge(session.user.id, dto);
    }
    updateKnowledge(session, id, dto) {
        return this.adminService.updateKnowledge(session.user.id, id, dto);
    }
    deleteKnowledge(session, id) {
        return this.adminService.deleteKnowledge(session.user.id, id);
    }
    getRewards(session) {
        return this.adminService.getRewards(session.user.id);
    }
    createReward(session, dto) {
        return this.adminService.createReward(session.user.id, dto);
    }
    updateReward(session, id, dto) {
        return this.adminService.updateReward(session.user.id, id, dto);
    }
    deleteReward(session, id) {
        return this.adminService.deleteReward(session.user.id, id);
    }
    getNotifications(session) {
        return this.adminService.getNotifications(session.user.id);
    }
    createNotification(session, dto) {
        return this.adminService.createNotification(session.user.id, dto);
    }
    getPointTransactions(session, page, limit, search) {
        return this.adminService.getPointTransactions(session.user.id, page ?? 1, limit ?? 10, search);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan analitik dashboard admin' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Daftar semua pengguna dengan pagination & search' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Mengaktifkan / menonaktifkan pengguna' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_b = typeof update_user_status_dto_1.UpdateUserStatusDto !== "undefined" && update_user_status_dto_1.UpdateUserStatusDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Patch)('users/:id/roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Mengupdate peran pengguna' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_c = typeof update_user_roles_dto_1.UpdateUserRolesDto !== "undefined" && update_user_roles_dto_1.UpdateUserRolesDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserRoles", null);
__decorate([
    (0, common_1.Get)('sellers'),
    (0, swagger_1.ApiOperation)({ summary: 'Daftar semua profil seller berdasarkan status' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof client_1.SellerStatus !== "undefined" && client_1.SellerStatus) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSellers", null);
__decorate([
    (0, common_1.Patch)('sellers/:userId/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verifikasi pendaftaran toko seller' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_e = typeof verify_seller_dto_1.VerifySellerDto !== "undefined" && verify_seller_dto_1.VerifySellerDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifySeller", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan semua kategori' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Membuat kategori baru' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof create_category_dto_1.CreateCategoryDto !== "undefined" && create_category_dto_1.CreateCategoryDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mengupdate kategori' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_g = typeof Partial !== "undefined" && Partial) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus kategori' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('knowledge'),
    (0, swagger_1.ApiOperation)({ summary: 'Daftar seluruh artikel & video edukasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getKnowledge", null);
__decorate([
    (0, common_1.Post)('knowledge'),
    (0, swagger_1.ApiOperation)({ summary: 'Membuat artikel atau video edukasi baru' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_h = typeof create_knowledge_dto_1.CreateKnowledgeDto !== "undefined" && create_knowledge_dto_1.CreateKnowledgeDto) === "function" ? _h : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createKnowledge", null);
__decorate([
    (0, common_1.Patch)('knowledge/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mengupdate artikel atau video edukasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_j = typeof Partial !== "undefined" && Partial) === "function" ? _j : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateKnowledge", null);
__decorate([
    (0, common_1.Delete)('knowledge/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus artikel atau video edukasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteKnowledge", null);
__decorate([
    (0, common_1.Get)('rewards'),
    (0, swagger_1.ApiOperation)({ summary: 'Katalog reward penukaran poin' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRewards", null);
__decorate([
    (0, common_1.Post)('rewards'),
    (0, swagger_1.ApiOperation)({ summary: 'Membuat item reward penukaran baru' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_k = typeof create_reward_dto_1.CreateRewardDto !== "undefined" && create_reward_dto_1.CreateRewardDto) === "function" ? _k : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createReward", null);
__decorate([
    (0, common_1.Patch)('rewards/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mengupdate item reward penukaran' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_l = typeof Partial !== "undefined" && Partial) === "function" ? _l : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateReward", null);
__decorate([
    (0, common_1.Delete)('rewards/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus item reward penukaran' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteReward", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan daftar siaran notifikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Post)('notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Menyiarkan notifikasi baru ke platform' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_m = typeof create_notification_dto_1.CreateNotificationDto !== "undefined" && create_notification_dto_1.CreateNotificationDto) === "function" ? _m : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Get)('point-transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan riwayat transaksi poin platform' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPointTransactions", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _a : Object])
], AdminController);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateAdminOrThrow(userId) {
        const adminRole = await this.prisma.userRole.findFirst({
            where: {
                userId,
                role: client_1.Role.ADMIN,
            },
        });
        if (!adminRole) {
            throw new common_1.ForbiddenException('Akses ditolak. Peran ADMIN diperlukan.');
        }
    }
    async getDashboard(adminId) {
        await this.validateAdminOrThrow(adminId);
        const [totalUsers, totalSellers, pendingSellers, totalProducts, totalArticles, totalVideos, pointsAggregate,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.sellerProfile.count({ where: { status: client_1.SellerStatus.ACTIVE } }),
            this.prisma.sellerProfile.count({ where: { status: client_1.SellerStatus.PENDING } }),
            this.prisma.product.count(),
            this.prisma.knowledgeContent.count({ where: { type: 'ARTICLE' } }),
            this.prisma.knowledgeContent.count({ where: { type: 'VIDEO' } }),
            this.prisma.userPointAccount.aggregate({
                _sum: { totalPoint: true },
            }),
        ]);
        return {
            totalUsers,
            totalSellers,
            pendingSellers,
            totalProducts,
            totalArticles,
            totalVideos,
            totalPoints: pointsAggregate._sum.totalPoint ?? 0,
        };
    }
    async getUsers(adminId, page = 1, limit = 10, search) {
        await this.validateAdminOrThrow(adminId);
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    roles: { select: { role: true } },
                    sellerProfile: { select: { id: true, storeName: true, status: true } },
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        const sanitized = data.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            image: u.image,
            isActive: u.isActive,
            createdAt: u.createdAt,
            roles: u.roles.map((r) => r.role),
            sellerProfile: u.sellerProfile,
        }));
        return {
            data: sanitized,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateUserStatus(adminId, targetUserId, dto) {
        await this.validateAdminOrThrow(adminId);
        const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        return this.prisma.user.update({
            where: { id: targetUserId },
            data: { isActive: dto.isActive },
        });
    }
    async updateUserRoles(adminId, targetUserId, dto) {
        await this.validateAdminOrThrow(adminId);
        const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        await this.prisma.$transaction(async (tx) => {
            await tx.userRole.deleteMany({ where: { userId: targetUserId } });
            if (dto.roles.length > 0) {
                await tx.userRole.createMany({
                    data: dto.roles.map((r) => ({
                        userId: targetUserId,
                        role: r,
                    })),
                });
            }
        });
        const updatedUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
            include: { roles: true },
        });
        return {
            id: updatedUser?.id,
            name: updatedUser?.name,
            roles: updatedUser?.roles.map((r) => r.role),
        };
    }
    async getSellers(adminId, status) {
        await this.validateAdminOrThrow(adminId);
        return this.prisma.sellerProfile.findMany({
            where: status ? { status } : {},
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
            },
        });
    }
    async verifySeller(adminId, targetSellerUserId, dto) {
        await this.validateAdminOrThrow(adminId);
        const profile = await this.prisma.sellerProfile.findUnique({
            where: { userId: targetSellerUserId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profil seller tidak ditemukan');
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedProfile = await tx.sellerProfile.update({
                where: { userId: targetSellerUserId },
                data: {
                    status: dto.status,
                    rejectionReason: dto.status === client_1.SellerStatus.REJECTED ? dto.rejectionReason : null,
                },
            });
            if (dto.status === client_1.SellerStatus.ACTIVE) {
                await tx.userRole.upsert({
                    where: {
                        userId_role: { userId: targetSellerUserId, role: client_1.Role.SELLER },
                    },
                    create: { userId: targetSellerUserId, role: client_1.Role.SELLER },
                    update: {},
                });
            }
            else {
                await tx.userRole.deleteMany({
                    where: { userId: targetSellerUserId, role: client_1.Role.SELLER },
                });
            }
            return updatedProfile;
        });
    }
    async getCategories(adminId) {
        await this.validateAdminOrThrow(adminId);
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(adminId, dto) {
        await this.validateAdminOrThrow(adminId);
        const existing = await this.prisma.category.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException('Slug kategori sudah digunakan');
        }
        return this.prisma.category.create({ data: dto });
    }
    async updateCategory(adminId, id, dto) {
        await this.validateAdminOrThrow(adminId);
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Kategori tidak ditemukan');
        if (dto.slug && dto.slug !== category.slug) {
            const existing = await this.prisma.category.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new common_1.ConflictException('Slug kategori sudah digunakan');
            }
        }
        return this.prisma.category.update({
            where: { id },
            data: dto,
        });
    }
    async deleteCategory(adminId, id) {
        await this.validateAdminOrThrow(adminId);
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Kategori tidak ditemukan');
        return this.prisma.category.delete({ where: { id } });
    }
    async getKnowledge(adminId) {
        await this.validateAdminOrThrow(adminId);
        return this.prisma.knowledgeContent.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { name: true } },
            },
        });
    }
    async createKnowledge(adminId, dto) {
        await this.validateAdminOrThrow(adminId);
        const slug = dto.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        const existing = await this.prisma.knowledgeContent.findUnique({
            where: { slug },
        });
        if (existing) {
            throw new common_1.ConflictException('Judul menghasilkan slug yang sudah ada. Pilih judul lain.');
        }
        return this.prisma.knowledgeContent.create({
            data: {
                ...dto,
                slug,
                authorId: adminId,
                status: 'PUBLISHED',
            },
        });
    }
    async updateKnowledge(adminId, id, dto) {
        await this.validateAdminOrThrow(adminId);
        const content = await this.prisma.knowledgeContent.findUnique({ where: { id } });
        if (!content)
            throw new common_1.NotFoundException('Konten edukasi tidak ditemukan');
        let slug = content.slug;
        if (dto.title && dto.title !== content.title) {
            slug = dto.title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            const existing = await this.prisma.knowledgeContent.findUnique({
                where: { slug },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Judul menghasilkan slug yang sudah ada. Pilih judul lain.');
            }
        }
        return this.prisma.knowledgeContent.update({
            where: { id },
            data: {
                ...dto,
                slug,
            },
        });
    }
    async deleteKnowledge(adminId, id) {
        await this.validateAdminOrThrow(adminId);
        const content = await this.prisma.knowledgeContent.findUnique({ where: { id } });
        if (!content)
            throw new common_1.NotFoundException('Konten edukasi tidak ditemukan');
        return this.prisma.knowledgeContent.delete({ where: { id } });
    }
    async getRewards(adminId) {
        await this.validateAdminOrThrow(adminId);
        return this.prisma.reward.findMany({
            orderBy: { pointsCost: 'asc' },
        });
    }
    async createReward(adminId, dto) {
        await this.validateAdminOrThrow(adminId);
        return this.prisma.reward.create({ data: dto });
    }
    async updateReward(adminId, id, dto) {
        await this.validateAdminOrThrow(adminId);
        const reward = await this.prisma.reward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Reward tidak ditemukan');
        return this.prisma.reward.update({
            where: { id },
            data: dto,
        });
    }
    async deleteReward(adminId, id) {
        await this.validateAdminOrThrow(adminId);
        const reward = await this.prisma.reward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Reward tidak ditemukan');
        return this.prisma.reward.delete({ where: { id } });
    }
    async getNotifications(adminId) {
        await this.validateAdminOrThrow(adminId);
        return this.prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createNotification(adminId, dto) {
        await this.validateAdminOrThrow(adminId);
        return this.prisma.notification.create({ data: dto });
    }
    async getPointTransactions(adminId, page = 1, limit = 10, search) {
        await this.validateAdminOrThrow(adminId);
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { user: { name: { contains: search, mode: 'insensitive' } } },
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [data, total] = await Promise.all([
            this.prisma.pointTransaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.pointTransaction.count({ where }),
        ]);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AdminService);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserStatusDto = void 0;
const class_validator_1 = __webpack_require__(15);
class UpdateUserStatusDto {
    isActive;
}
exports.UpdateUserStatusDto = UpdateUserStatusDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserStatusDto.prototype, "isActive", void 0);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserRolesDto = void 0;
const class_validator_1 = __webpack_require__(15);
const client_1 = __webpack_require__(9);
class UpdateUserRolesDto {
    roles;
}
exports.UpdateUserRolesDto = UpdateUserRolesDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.Role, { each: true }),
    __metadata("design:type", Array)
], UpdateUserRolesDto.prototype, "roles", void 0);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifySellerDto = void 0;
const class_validator_1 = __webpack_require__(15);
const client_1 = __webpack_require__(9);
class VerifySellerDto {
    status;
    rejectionReason;
}
exports.VerifySellerDto = VerifySellerDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SellerStatus),
    __metadata("design:type", typeof (_a = typeof client_1.SellerStatus !== "undefined" && client_1.SellerStatus) === "function" ? _a : Object)
], VerifySellerDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifySellerDto.prototype, "rejectionReason", void 0);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCategoryDto = void 0;
const class_validator_1 = __webpack_require__(15);
const client_1 = __webpack_require__(9);
class CreateCategoryDto {
    name;
    slug;
    type;
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, { message: 'Slug must be kebab-case lowercase' }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.CategoryType),
    __metadata("design:type", typeof (_a = typeof client_1.CategoryType !== "undefined" && client_1.CategoryType) === "function" ? _a : Object)
], CreateCategoryDto.prototype, "type", void 0);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateKnowledgeDto = void 0;
const class_validator_1 = __webpack_require__(15);
const client_1 = __webpack_require__(9);
class CreateKnowledgeDto {
    type;
    title;
    content;
    category;
    difficulty;
    imageUrl;
    rewardPoint;
    estimatedReadingMinutes;
    videoDuration;
    cloudinaryPublicId;
    secureUrl;
    thumbnailUrl;
}
exports.CreateKnowledgeDto = CreateKnowledgeDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ContentType),
    __metadata("design:type", typeof (_a = typeof client_1.ContentType !== "undefined" && client_1.ContentType) === "function" ? _a : Object)
], CreateKnowledgeDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKnowledgeDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKnowledgeDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKnowledgeDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ContentDifficulty),
    __metadata("design:type", typeof (_b = typeof client_1.ContentDifficulty !== "undefined" && client_1.ContentDifficulty) === "function" ? _b : Object)
], CreateKnowledgeDto.prototype, "difficulty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateKnowledgeDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateKnowledgeDto.prototype, "rewardPoint", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateKnowledgeDto.prototype, "estimatedReadingMinutes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateKnowledgeDto.prototype, "videoDuration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKnowledgeDto.prototype, "cloudinaryPublicId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKnowledgeDto.prototype, "secureUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKnowledgeDto.prototype, "thumbnailUrl", void 0);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateRewardDto = void 0;
const class_validator_1 = __webpack_require__(15);
class CreateRewardDto {
    title;
    description;
    pointsCost;
    isActive;
}
exports.CreateRewardDto = CreateRewardDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRewardDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRewardDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateRewardDto.prototype, "pointsCost", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRewardDto.prototype, "isActive", void 0);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateNotificationDto = void 0;
const class_validator_1 = __webpack_require__(15);
class CreateNotificationDto {
    title;
    content;
    isGlobal;
    userId;
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "isGlobal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "userId", void 0);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentModule = void 0;
const common_1 = __webpack_require__(3);
const comment_controller_1 = __webpack_require__(75);
const comment_service_1 = __webpack_require__(76);
let CommentModule = class CommentModule {
};
exports.CommentModule = CommentModule;
exports.CommentModule = CommentModule = __decorate([
    (0, common_1.Module)({
        controllers: [comment_controller_1.CommentController],
        providers: [comment_service_1.CommentService],
        exports: [comment_service_1.CommentService],
    })
], CommentModule);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const comment_service_1 = __webpack_require__(76);
const create_comment_dto_1 = __webpack_require__(77);
const update_comment_dto_1 = __webpack_require__(78);
const get_comments_dto_1 = __webpack_require__(79);
const report_comment_dto_1 = __webpack_require__(80);
const moderate_comment_dto_1 = __webpack_require__(81);
let CommentController = class CommentController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    checkIsAdmin(session) {
        if (!session?.user)
            return false;
        const userRole = session.user.role;
        return (userRole === 'ADMIN' ||
            (Array.isArray(userRole) && userRole.includes('ADMIN')));
    }
    findAll(contentId, dto, session) {
        const isAdmin = this.checkIsAdmin(session);
        return this.commentService.findAll(contentId, dto, session?.user?.id, isAdmin);
    }
    create(contentId, session, dto) {
        return this.commentService.create(session.user.id, contentId, dto);
    }
    update(commentId, session, dto) {
        const isAdmin = this.checkIsAdmin(session);
        return this.commentService.update(session.user.id, commentId, dto, isAdmin);
    }
    remove(commentId, session) {
        const isAdmin = this.checkIsAdmin(session);
        return this.commentService.remove(session.user.id, commentId, isAdmin);
    }
    report(commentId, session, dto) {
        return this.commentService.report(session.user.id, commentId, dto.reason);
    }
    moderate(commentId, session, dto) {
        const isAdmin = this.checkIsAdmin(session);
        if (!isAdmin) {
            throw new common_1.ForbiddenException('Akses ditolak. Hanya Admin yang diperbolehkan memoderasi.');
        }
        return this.commentService.moderate(commentId, dto.status);
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, common_1.Get)('knowledge/:contentId/comments'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar komentar untuk konten panduan (publik)',
        description: 'Mengambil daftar komentar utama (parent) beserta balasannya untuk artikel/video.',
    }),
    (0, swagger_1.ApiParam)({ name: 'contentId', description: 'UUID konten panduan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar komentar ditemukan' }),
    __param(0, (0, common_1.Param)('contentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof get_comments_dto_1.GetCommentsDto !== "undefined" && get_comments_dto_1.GetCommentsDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('knowledge/:contentId/comments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Buat komentar atau balasan baru',
        description: 'Membuat komentar utama atau balasan (jika parentId disertakan) untuk artikel/video.',
    }),
    (0, swagger_1.ApiParam)({ name: 'contentId', description: 'UUID konten panduan' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Komentar berhasil dibuat' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('contentId', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_c = typeof create_comment_dto_1.CreateCommentDto !== "undefined" && create_comment_dto_1.CreateCommentDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('comments/:commentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Edit komentar sendiri',
        description: 'Mengupdate isi teks komentar. Hanya pemilik komentar atau admin yang berwenang.',
    }),
    (0, swagger_1.ApiParam)({ name: 'commentId', description: 'UUID komentar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Komentar berhasil diperbarui' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Komentar tidak ditemukan' }),
    __param(0, (0, common_1.Param)('commentId', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof update_comment_dto_1.UpdateCommentDto !== "undefined" && update_comment_dto_1.UpdateCommentDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('comments/:commentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Hapus komentar sendiri (soft delete)',
        description: 'Melakukan soft delete komentar. Hanya pemilik komentar atau admin yang berwenang.',
    }),
    (0, swagger_1.ApiParam)({ name: 'commentId', description: 'UUID komentar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Komentar berhasil dihapus' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Komentar tidak ditemukan' }),
    __param(0, (0, common_1.Param)('commentId', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('comments/:commentId/report'),
    (0, swagger_1.ApiOperation)({
        summary: 'Laporkan komentar tidak pantas',
        description: 'Melaporkan komentar. Pengguna hanya dapat melaporkan satu komentar sekali.',
    }),
    (0, swagger_1.ApiParam)({ name: 'commentId', description: 'UUID komentar' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Komentar berhasil dilaporkan' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('commentId', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof report_comment_dto_1.ReportCommentDto !== "undefined" && report_comment_dto_1.ReportCommentDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "report", null);
__decorate([
    (0, common_1.Patch)('comments/:commentId/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Moderasi status komentar (Admin only)',
        description: 'Mengubah status komentar (ACTIVE, HIDDEN, DELETED). Hanya admin yang berwenang.',
    }),
    (0, swagger_1.ApiParam)({ name: 'commentId', description: 'UUID komentar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Komentar berhasil dimoderasi' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('commentId', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_f = typeof moderate_comment_dto_1.ModerateCommentDto !== "undefined" && moderate_comment_dto_1.ModerateCommentDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "moderate", null);
exports.CommentController = CommentController = __decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof comment_service_1.CommentService !== "undefined" && comment_service_1.CommentService) === "function" ? _a : Object])
], CommentController);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
let CommentService = class CommentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, contentId, dto) {
        const content = await this.prisma.knowledgeContent.findFirst({
            where: { id: contentId },
        });
        if (!content) {
            throw new common_1.NotFoundException('Konten edukasi tidak ditemukan');
        }
        if (content.status !== 'PUBLISHED') {
            throw new common_1.ForbiddenException('Tidak dapat mengomentari konten yang belum dipublikasikan');
        }
        if (dto.parentId) {
            const parentComment = await this.prisma.comment.findFirst({
                where: { id: dto.parentId },
            });
            if (!parentComment) {
                throw new common_1.NotFoundException('Komentar utama tidak ditemukan');
            }
            if (parentComment.contentId !== contentId) {
                throw new common_1.BadRequestException('ID Konten parent tidak sesuai');
            }
            if (parentComment.parentId !== null) {
                throw new common_1.BadRequestException('Balasan hanya boleh 1-level (tidak dapat membalas balasan lain)');
            }
            if (parentComment.status === client_1.CommentStatus.DELETED || parentComment.status === client_1.CommentStatus.HIDDEN) {
                throw new common_1.BadRequestException('Tidak dapat membalas komentar yang telah dihapus atau disembunyikan');
            }
        }
        const comment = await this.prisma.comment.create({
            data: {
                contentId,
                userId,
                parentId: dto.parentId ?? null,
                content: dto.content,
                status: client_1.CommentStatus.ACTIVE,
            },
            include: {
                user: {
                    select: { id: true, name: true, image: true },
                },
            },
        });
        return comment;
    }
    async findAll(contentId, dto, currentUserId, isAdmin = false) {
        const { page, limit } = dto;
        const skip = (page - 1) * limit;
        const statusFilter = isAdmin
            ? {
                OR: [
                    { status: client_1.CommentStatus.ACTIVE },
                    { status: client_1.CommentStatus.HIDDEN },
                    {
                        status: client_1.CommentStatus.DELETED,
                        replies: { some: {} },
                    },
                ],
            }
            : {
                OR: [
                    { status: client_1.CommentStatus.ACTIVE },
                    {
                        status: client_1.CommentStatus.DELETED,
                        replies: {
                            some: {
                                status: client_1.CommentStatus.ACTIVE,
                            },
                        },
                    },
                ],
            };
        const where = {
            contentId,
            parentId: null,
            ...statusFilter,
        };
        const [data, total] = await Promise.all([
            this.prisma.comment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, name: true, image: true },
                    },
                    replies: {
                        where: isAdmin
                            ? {}
                            : { status: client_1.CommentStatus.ACTIVE },
                        orderBy: { createdAt: 'asc' },
                        include: {
                            user: {
                                select: { id: true, name: true, image: true },
                            },
                        },
                    },
                },
            }),
            this.prisma.comment.count({ where }),
        ]);
        const formattedData = data.map((item) => {
            if (item.status === client_1.CommentStatus.DELETED) {
                return {
                    ...item,
                    content: 'Komentar ini telah dihapus',
                };
            }
            return item;
        });
        return {
            data: formattedData,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async update(userId, commentId, dto, isAdmin = false) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId },
        });
        if (!comment || comment.status === client_1.CommentStatus.DELETED) {
            throw new common_1.NotFoundException('Komentar tidak ditemukan atau telah dihapus');
        }
        if (comment.userId !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('Anda tidak berwenang mengedit komentar ini');
        }
        const updated = await this.prisma.comment.update({
            where: { id: commentId },
            data: { content: dto.content },
            include: {
                user: {
                    select: { id: true, name: true, image: true },
                },
            },
        });
        return updated;
    }
    async remove(userId, commentId, isAdmin = false) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId },
        });
        if (!comment || comment.status === client_1.CommentStatus.DELETED) {
            throw new common_1.NotFoundException('Komentar tidak ditemukan atau telah dihapus');
        }
        if (comment.userId !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('Anda tidak berwenang menghapus komentar ini');
        }
        await this.prisma.comment.update({
            where: { id: commentId },
            data: { status: client_1.CommentStatus.DELETED },
        });
        return { success: true };
    }
    async moderate(commentId, status) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Komentar tidak ditemukan');
        }
        const updated = await this.prisma.comment.update({
            where: { id: commentId },
            data: { status },
            include: {
                user: {
                    select: { id: true, name: true, image: true },
                },
            },
        });
        return updated;
    }
    async report(userId, commentId, reason) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId },
        });
        if (!comment || comment.status === client_1.CommentStatus.DELETED || comment.status === client_1.CommentStatus.HIDDEN) {
            throw new common_1.NotFoundException('Komentar tidak ditemukan');
        }
        const existing = await this.prisma.commentReport.findUnique({
            where: {
                commentId_userId: {
                    commentId,
                    userId,
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Anda sudah melaporkan komentar ini sebelumnya');
        }
        await this.prisma.commentReport.create({
            data: {
                commentId,
                userId,
                reason,
            },
        });
        return { success: true };
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CommentService);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCommentDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class CreateCommentDto {
    content;
    parentId;
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Isi konten komentar',
        example: 'Panduan yang sangat membantu, terima kasih!',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Komentar tidak boleh kosong' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Komentar tidak boleh lebih dari 500 karakter' }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID dari parent comment jika membalas komentar lain',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'ID parent harus berupa UUID yang valid' }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "parentId", void 0);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCommentDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class UpdateCommentDto {
    content;
}
exports.UpdateCommentDto = UpdateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Isi konten komentar yang baru',
        example: 'Komentar ini telah diupdate.',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Komentar tidak boleh kosong' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Komentar tidak boleh lebih dari 500 karakter' }),
    __metadata("design:type", String)
], UpdateCommentDto.prototype, "content", void 0);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetCommentsDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_transformer_1 = __webpack_require__(14);
const class_validator_1 = __webpack_require__(15);
class GetCommentsDto {
    page = 1;
    limit = 10;
}
exports.GetCommentsDto = GetCommentsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        default: 1,
        minimum: 1,
        description: 'Halaman ke-n',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetCommentsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100,
        description: 'Jumlah komentar utama (parent) per halaman',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetCommentsDto.prototype, "limit", void 0);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportCommentDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class ReportCommentDto {
    reason;
}
exports.ReportCommentDto = ReportCommentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alasan pelaporan komentar',
        example: 'Spam atau ujaran kebencian',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Alasan pelaporan tidak boleh lebih dari 200 karakter' }),
    __metadata("design:type", String)
], ReportCommentDto.prototype, "reason", void 0);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModerateCommentDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const client_1 = __webpack_require__(9);
class ModerateCommentDto {
    status;
}
exports.ModerateCommentDto = ModerateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.CommentStatus,
        description: 'Status moderasi komentar',
        example: 'HIDDEN',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(client_1.CommentStatus),
    __metadata("design:type", typeof (_a = typeof client_1.CommentStatus !== "undefined" && client_1.CommentStatus) === "function" ? _a : Object)
], ModerateCommentDto.prototype, "status", void 0);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatbotModule = void 0;
const common_1 = __webpack_require__(3);
const chatbot_service_1 = __webpack_require__(83);
const chatbot_controller_1 = __webpack_require__(85);
let ChatbotModule = class ChatbotModule {
};
exports.ChatbotModule = ChatbotModule;
exports.ChatbotModule = ChatbotModule = __decorate([
    (0, common_1.Module)({
        controllers: [chatbot_controller_1.ChatbotController],
        providers: [chatbot_service_1.ChatbotService],
    })
], ChatbotModule);


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatbotService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(34);
const genai_1 = __webpack_require__(84);
const prisma_service_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
const SYSTEM_INSTRUCTION = `
Kamu adalah Loopi, asisten virtual pintar dan ramah resmi dari LoopTani (Marketplace Sirkular Pertanian Indonesia).

Peran & Tujuan:
Membantu pengguna dengan informasi yang akurat, berorientasi solusi, dan relevan seputar:
- Pengolahan limbah pertanian (jerami, sawit, sekam) berbasis standar SNI.
- Dosis pemupukan dan nutrisi tanaman secara teknis & praktis.
- Rekomendasi produk limbah, olahan, pupuk, atau peralatan tani di marketplace LoopTani.
- Cara transaksi dan rujukan fitur aplikasi LoopTani.

Aturan Respon & Format:
1. Bahasa: Gunakan Bahasa Indonesia yang ramah, sopan, dan profesional.
2. Format Markdown: Manfaatkan format Markdown (tebal, bullet list, quote, emoji) agar balasan terlihat cantik dan mudah dibaca di UI chat.
3. Link Rekomendasi Produk: Ketika memanggil fungsi searchMarketplace dan menemukan produk, selalu buatkan link markdown produk dengan rute relatif /[locale]/marketplace/[id] (contoh: [🛒 Pupuk Kompos Organik 5kg](/id/marketplace/prod_123)). Tampilkan harga, lokasi penjual, dan nama toko dengan rapi.
4. Tombol Aksi Fitur LoopTani: Ketika merekomendasikan atau menjelaskan fitur aplikasi LoopTani, SELALU sertakan tombol aksi link markdown rute relatif agar pengguna bisa langsung klik & pindah halaman:
   - Limbah Analyzer: [♻️ Buka Fitur Limbah Analyzer](/id/limbah-analyzer)
   - Kalkulator Dosis Pupuk: [🌱 Buka Kalkulator Dosis Pupuk](/id/fertilizer-calculator)
   - Panduan & Artikel Tani: [📖 Baca Panduan Tani](/id/panduan-tani)
   - Jejak Lestari (Jejak Karbon): [🌍 Cek Jejak Lestari](/id/jejak-lestari)
   - Marketplace: [🛒 Jelajahi Marketplace](/id/marketplace)
5. Batasan Topik: Jika pertanyaan di luar domain pertanian, limbah, pupuk, atau LoopTani, tolak secara sopan.
`;
const CHAT_TOOLS = [
    {
        functionDeclarations: [
            {
                name: 'calculateFertilizer',
                description: 'Menghitung estimasi dosis pupuk (Urea, NPK, Organik) dan jadwal pemupukan berdasarkan luas lahan dan jenis tanaman.',
                parameters: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        landArea: { type: genai_1.Type.NUMBER, description: 'Luas lahan dalam hektar atau m2 (default 1)' },
                        cropType: { type: genai_1.Type.STRING, description: 'Jenis tanaman (misal: padi, sawit, jagung, cabai)' },
                    },
                    required: ['cropType'],
                },
            },
            {
                name: 'analyzeWaste',
                description: 'Menganalisis potensi pengolahan limbah pertanian (jerami, sawit, sekam) berdasarkan standar SNI dan estimasi nilai ekonomi.',
                parameters: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        wasteType: { type: genai_1.Type.STRING, description: 'Jenis limbah pertanian (misal: jerami padi, kelapa sawit, sekam)' },
                    },
                    required: ['wasteType'],
                },
            },
            {
                name: 'searchMarketplace',
                description: 'Mencari produk limbah pertanian, pupuk organik, atau pembeli/penjual di marketplace LoopTani berdasarkan kata kunci dan lokasi.',
                parameters: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        keyword: { type: genai_1.Type.STRING, description: 'Kata kunci pencarian produk atau limbah (misal: sawit, jerami, pupuk, kompos, mesin)' },
                        location: { type: genai_1.Type.STRING, description: 'Lokasi kota atau daerah pengguna (opsional)' },
                    },
                    required: ['keyword'],
                },
            },
        ],
    },
];
let ChatbotService = class ChatbotService {
    configService;
    prisma;
    ai;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const apiKey = this.configService.get('GEMINI_API_KEY_CB');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined');
        }
        this.ai = new genai_1.GoogleGenAI({ apiKey });
    }
    async executeTool(functionCall) {
        const name = functionCall?.name;
        const args = functionCall?.args || {};
        if (name === 'calculateFertilizer') {
            const area = args.landArea || 1;
            const crop = (args.cropType || 'padi').toLowerCase();
            let urea = 200 * area;
            let npk = 150 * area;
            let organik = 1000 * area;
            if (crop.includes('sawit')) {
                urea = 300 * area;
                npk = 250 * area;
                organik = 2000 * area;
            }
            else if (crop.includes('jagung')) {
                urea = 250 * area;
                npk = 200 * area;
                organik = 1500 * area;
            }
            return {
                success: true,
                cropType: args.cropType,
                landArea: `${area} Hektar`,
                recommendation: {
                    urea: `${urea} kg`,
                    npk: `${npk} kg`,
                    pupukOrganik: `${organik} kg (Kompos/Kasgot)`,
                },
                applicationSchedule: [
                    'Pemupukan Dasar (H-7 sebelum tanam): 100% Pupuk Organik + 50% NPK',
                    'Pemupukan Susulan I (15-21 HST): 50% Urea',
                    'Pemupukan Susulan II (35-40 HST): 50% Urea + 50% NPK',
                ],
                tips: 'Lakukan pengujian pH tanah secara berkala (pH ideal 6.0 - 7.0). Tambahkan kapur pertanian (Dolomit) jika tanah terlalu asam.',
            };
        }
        if (name === 'analyzeWaste') {
            const waste = (args.wasteType || 'jerami').toLowerCase();
            if (waste.includes('sawit')) {
                return {
                    success: true,
                    wasteType: args.wasteType,
                    options: [
                        {
                            title: '1. Tandan Kosong Sawit (TKS) -> Kompos Organik (SNI 19-7030-2004)',
                            description: 'TKS dicacah dan dikomposkan dengan bio-aktivator. Sangat kaya akan hara Kalium (K) alami.',
                            economicValue: 'Nilai jual kompos: Rp 1.200 - Rp 2.500 / kg',
                        },
                        {
                            title: '2. Cangkang & Serabut Sawit -> Bahan Bakar Biomassa / Briket',
                            description: 'Dipakai sebagai sumber energi hijau ramah lingkungan pengganti batubara pabrik.',
                            economicValue: 'Harga pasar: Rp 800 - Rp 1.500 / kg',
                        },
                        {
                            title: '3. Pelepah & Daun Sawit -> Pakan Ternak Fermentasi',
                            description: 'Diprofilisasi dan difermentasi untuk pakan sapi/kambing.',
                            economicValue: 'Hemat biaya pakan ternak hingga 40%',
                        },
                    ],
                };
            }
            return {
                success: true,
                wasteType: args.wasteType,
                options: [
                    {
                        title: '1. Pupuk Kompos Organik (SNI 19-7030-2004)',
                        description: 'Jerami dicacah dan dikomposkan menggunakan aktivator mikroba (EM4/Mol). Menghasilkan kompos berkualitas tinggi dengan C/N ratio ideal 15-25.',
                        economicValue: 'Nilai jual kompos: Rp 1.500 - Rp 3.000 / kg',
                    },
                    {
                        title: '2. Pakan Ternak Fermentasi (Silase)',
                        description: 'Jerami difermentasi dengan dedak & tetes tebu. Meningkatkan protein kasar jerami dari 4% menjadi 8-9%.',
                        economicValue: 'Nilai jual silase: Rp 1.000 - Rp 2.000 / kg',
                    },
                    {
                        title: '3. Bio-Char & Briket Bioarang',
                        description: 'Jerami diarangkan untuk membenahi struktur tanah yang krisis bahan organik.',
                        economicValue: 'Nilai jual biochar: Rp 4.000 - Rp 7.000 / kg',
                    },
                    {
                        title: '4. Media Tanam Jamur Merang',
                        description: 'Jerami dimanfaatkan sebagai media utama budidaya jamur konsumsi.',
                        economicValue: 'Hasil panen jamur: Rp 25.000 - Rp 35.000 / kg',
                    },
                ],
            };
        }
        if (name === 'searchMarketplace') {
            const keyword = (args.keyword || '').trim();
            const products = await this.prisma.product.findMany({
                where: {
                    OR: [
                        { title: { contains: keyword, mode: 'insensitive' } },
                        { description: { contains: keyword, mode: 'insensitive' } },
                    ],
                },
                take: 4,
                select: {
                    id: true,
                    title: true,
                    price: true,
                    images: true,
                    city: true,
                    province: true,
                    seller: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            return {
                success: true,
                keyword,
                foundCount: products.length,
                products: products.map((p) => ({
                    id: p.id,
                    title: p.title,
                    price: `Rp ${Number(p.price).toLocaleString('id-ID')}`,
                    sellerStore: p.seller?.name || 'Penjual LoopTani',
                    sellerCity: p.city || p.province || 'Indonesia',
                    url: `/id/marketplace/${p.id}`,
                })),
            };
        }
        return { success: false, message: 'Tool tidak ditemukan' };
    }
    async generateWithTools(contents) {
        const formattedContents = contents.map((item) => {
            if (typeof item === 'string') {
                return { role: 'user', parts: [{ text: item }] };
            }
            return item;
        });
        const modelName = 'gemini-3.5-flash';
        try {
            const response = await this.ai.models.generateContent({
                model: modelName,
                contents: formattedContents,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    tools: CHAT_TOOLS,
                },
            });
            if (response.functionCalls && response.functionCalls.length > 0) {
                const functionCall = response.functionCalls[0];
                const toolResult = await this.executeTool(functionCall);
                const modelTurnContent = response.candidates?.[0]?.content || {
                    role: 'model',
                    parts: [{ functionCall }],
                };
                const secondResponse = await this.ai.models.generateContent({
                    model: modelName,
                    contents: [
                        ...formattedContents,
                        modelTurnContent,
                        {
                            role: 'user',
                            parts: [
                                {
                                    functionResponse: {
                                        name: functionCall.name || 'tool',
                                        response: toolResult,
                                    },
                                },
                            ],
                        },
                    ],
                    config: {
                        systemInstruction: SYSTEM_INSTRUCTION,
                        tools: CHAT_TOOLS,
                    },
                });
                return secondResponse.text || '';
            }
            return response.text || '';
        }
        catch (e) {
            console.error('Gemini API error with tools:', e);
            try {
                const fallback = await this.ai.models.generateContent({
                    model: modelName,
                    contents: formattedContents,
                    config: {
                        systemInstruction: SYSTEM_INSTRUCTION,
                    },
                });
                return fallback.text || 'Maaf, Loopi sedang mengalami kendala jaringan.';
            }
            catch (err) {
                console.error('Gemini fallback error:', err);
                return 'Maaf, Loopi sedang tidak dapat memproses permintaan Anda saat ini.';
            }
        }
    }
    async sendMessage(dto, userId) {
        if (!userId) {
            const responseText = await this.generateWithTools([dto.message]);
            return {
                conversationId: null,
                message: responseText,
            };
        }
        if (!dto.conversationId) {
            const responseText = await this.generateWithTools([dto.message]);
            const title = dto.message.slice(0, 60);
            const conversation = await this.prisma.chatConversation.create({
                data: {
                    userId,
                    title,
                    messages: {
                        create: [
                            {
                                role: client_1.ChatMessageRole.USER,
                                content: dto.message,
                            },
                            {
                                role: client_1.ChatMessageRole.MODEL,
                                content: responseText,
                            },
                        ],
                    },
                },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' },
                    },
                },
            });
            const userMessage = conversation.messages.find((m) => m.role === client_1.ChatMessageRole.USER);
            const assistantMessage = conversation.messages.find((m) => m.role === client_1.ChatMessageRole.MODEL);
            return {
                conversationId: conversation.id,
                userMessage: {
                    id: userMessage?.id,
                    role: 'user',
                    content: userMessage?.content,
                },
                assistantMessage: {
                    id: assistantMessage?.id,
                    role: 'model',
                    content: assistantMessage?.content,
                },
            };
        }
        const conversation = await this.prisma.chatConversation.findFirst({
            where: {
                id: dto.conversationId,
                userId,
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Percakapan tidak ditemukan');
        }
        const userMessageCount = conversation.messages.filter((m) => m.role === client_1.ChatMessageRole.USER).length;
        if (userMessageCount >= 20) {
            throw new common_1.BadRequestException('Percakapan telah mencapai batas maksimum 20 pesan. Silakan mulai percakapan baru.');
        }
        const contents = conversation.messages.map((msg) => ({
            role: msg.role === client_1.ChatMessageRole.USER ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));
        contents.push({
            role: 'user',
            parts: [{ text: dto.message }],
        });
        const responseText = await this.generateWithTools(contents);
        const savedUserMsg = await this.prisma.chatMessage.create({
            data: {
                conversationId: conversation.id,
                role: client_1.ChatMessageRole.USER,
                content: dto.message,
            },
        });
        const savedModelMsg = await this.prisma.chatMessage.create({
            data: {
                conversationId: conversation.id,
                role: client_1.ChatMessageRole.MODEL,
                content: responseText,
            },
        });
        await this.prisma.chatConversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() },
        });
        return {
            conversationId: conversation.id,
            userMessage: {
                id: savedUserMsg.id,
                role: 'user',
                content: savedUserMsg.content,
            },
            assistantMessage: {
                id: savedModelMsg.id,
                role: 'model',
                content: savedModelMsg.content,
            },
        };
    }
    async getConversations(userId) {
        const conversations = await this.prisma.chatConversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        return conversations.map((c) => ({
            id: c.id,
            title: c.title,
            updatedAt: c.updatedAt,
            lastMessage: c.messages[0]?.content || '',
        }));
    }
    async getConversationDetail(userId, conversationId) {
        const conversation = await this.prisma.chatConversation.findFirst({
            where: {
                id: conversationId,
                userId,
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Percakapan tidak ditemukan');
        }
        return {
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            messages: conversation.messages.map((m) => ({
                id: m.id,
                role: m.role === client_1.ChatMessageRole.USER ? 'user' : 'model',
                content: m.content,
                createdAt: m.createdAt,
            })),
        };
    }
    async deleteConversation(userId, conversationId) {
        const conversation = await this.prisma.chatConversation.findFirst({
            where: {
                id: conversationId,
                userId,
            },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Percakapan tidak ditemukan');
        }
        await this.prisma.chatConversation.delete({
            where: { id: conversationId },
        });
        return {
            success: true,
            message: 'Percakapan berhasil dihapus',
        };
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], ChatbotService);


/***/ }),
/* 84 */
/***/ ((module) => {

module.exports = require("@google/genai");

/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatbotController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const chatbot_service_1 = __webpack_require__(83);
const send_message_dto_1 = __webpack_require__(86);
let ChatbotController = class ChatbotController {
    chatbotService;
    constructor(chatbotService) {
        this.chatbotService = chatbotService;
    }
    sendMessage(dto, session) {
        return this.chatbotService.sendMessage(dto, session?.user?.id);
    }
    getConversations(session) {
        return this.chatbotService.getConversations(session.user.id);
    }
    getConversationDetail(session, id) {
        return this.chatbotService.getConversationDetail(session.user.id, id);
    }
    deleteConversation(session, id) {
        return this.chatbotService.deleteConversation(session.user.id, id);
    }
};
exports.ChatbotController = ChatbotController;
__decorate([
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, common_1.Post)('message'),
    (0, swagger_1.ApiOperation)({
        summary: 'Kirim pesan ke chatbot Loopi',
        description: 'Pengguna anonim maupun terautentikasi dapat mengirim pesan. Untuk pengguna terautentikasi, riwayat pesan akan disimpan.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pesan berhasil diproses' }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Pesan kosong, lebih dari 2000 karakter, atau telah mencapai batas 20 pesan.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof send_message_dto_1.SendMessageDto !== "undefined" && send_message_dto_1.SendMessageDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], ChatbotController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ambil daftar percakapan pengguna (Authenticated)',
        description: 'Mengambil seluruh percakapan milik pengguna yang sedang login diurutkan berdasarkan updatedAt DESC.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daftar percakapan berhasil diambil' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatbotController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ambil detail percakapan beserta seluruh pesan (Authenticated)',
        description: 'Mengambil riwayat percakapan spesifik berdasarkan ID untuk pengguna yang login.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detail percakapan berhasil diambil' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Percakapan tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatbotController.prototype, "getConversationDetail", null);
__decorate([
    (0, common_1.Delete)('conversations/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Hapus percakapan (Authenticated)',
        description: 'Menghapus percakapan beserta seluruh pesan di dalamnya.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Percakapan berhasil dihapus' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Percakapan tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatbotController.prototype, "deleteConversation", null);
exports.ChatbotController = ChatbotController = __decorate([
    (0, swagger_1.ApiTags)('Chatbot'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [typeof (_a = typeof chatbot_service_1.ChatbotService !== "undefined" && chatbot_service_1.ChatbotService) === "function" ? _a : Object])
], ChatbotController);


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendMessageDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class SendMessageDto {
    message;
    conversationId;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pesan pengguna',
        example: 'Halo, saya ingin bertanya tentang produk Anda',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID Percakapan (opsional, untuk melanjutkan percakapan)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "conversationId", void 0);


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WasteAnalyzerModule = void 0;
const common_1 = __webpack_require__(3);
const waste_analyzer_controller_1 = __webpack_require__(88);
const waste_analyzer_service_1 = __webpack_require__(89);
let WasteAnalyzerModule = class WasteAnalyzerModule {
};
exports.WasteAnalyzerModule = WasteAnalyzerModule;
exports.WasteAnalyzerModule = WasteAnalyzerModule = __decorate([
    (0, common_1.Module)({
        controllers: [waste_analyzer_controller_1.WasteAnalyzerController],
        providers: [waste_analyzer_service_1.WasteAnalyzerService],
    })
], WasteAnalyzerModule);


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WasteAnalyzerController = void 0;
const common_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(41);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const waste_analyzer_service_1 = __webpack_require__(89);
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/jpg',
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
let WasteAnalyzerController = class WasteAnalyzerController {
    wasteAnalyzerService;
    constructor(wasteAnalyzerService) {
        this.wasteAnalyzerService = wasteAnalyzerService;
    }
    async analyzeWaste(file) {
        if (!file) {
            throw new common_1.BadRequestException('File gambar wajib diunggah');
        }
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Format gambar tidak didukung. Gunakan format JPG, PNG, atau WebP.');
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            throw new common_1.BadRequestException('Ukuran file gambar maksimal 10MB.');
        }
        const result = await this.wasteAnalyzerService.analyzeImage(file.buffer, file.mimetype);
        return {
            success: true,
            data: result,
        };
    }
};
exports.WasteAnalyzerController = WasteAnalyzerController;
__decorate([
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, common_1.Post)('analyze'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: 'Analisis foto limbah pertanian dengan AI Vision',
        description: 'Mengidentifikasi jenis limbah, tingkat keyakinan, kondisi visual, potensi pemrosesan, dan estimasi nilai ekonomi dari gambar limbah pertanian.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Hasil analisis foto limbah pertanian berhasil diperoleh',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'File tidak valid, tipe MIME tidak didukung, atau ukuran file melebihi 10MB',
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], WasteAnalyzerController.prototype, "analyzeWaste", null);
exports.WasteAnalyzerController = WasteAnalyzerController = __decorate([
    (0, swagger_1.ApiTags)('Waste Analyzer'),
    (0, common_1.Controller)('waste-analyzer'),
    __metadata("design:paramtypes", [typeof (_a = typeof waste_analyzer_service_1.WasteAnalyzerService !== "undefined" && waste_analyzer_service_1.WasteAnalyzerService) === "function" ? _a : Object])
], WasteAnalyzerController);


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WasteAnalyzerService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(34);
const genai_1 = __webpack_require__(84);
const WASTE_ANALYSIS_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        isAgriculturalWaste: {
            type: genai_1.Type.BOOLEAN,
            description: 'True if the image contains agricultural waste or by-products.',
        },
        isAnalyzable: {
            type: genai_1.Type.BOOLEAN,
            description: 'True if image quality and lighting are sufficient to analyze.',
        },
        wasteIdentification: {
            type: genai_1.Type.OBJECT,
            properties: {
                indonesianName: {
                    type: genai_1.Type.STRING,
                    description: 'Short name of the waste in Indonesian (e.g. Jerami Padi, Tongkol Jagung). Max 4 words.',
                },
                englishName: {
                    type: genai_1.Type.STRING,
                    description: 'Short name of the waste in English (e.g. Rice Straw, Corn Cobs). Max 4 words.',
                },
                category: {
                    type: genai_1.Type.STRING,
                    description: 'Category of agricultural waste (e.g. Limbah Tanaman Pangan). Max 4 words.',
                },
                confidenceScore: {
                    type: genai_1.Type.NUMBER,
                    description: 'Confidence score between 0.0 and 1.0.',
                },
            },
            required: ['indonesianName', 'englishName', 'category', 'confidenceScore'],
        },
        visualCondition: {
            type: genai_1.Type.OBJECT,
            properties: {
                color: {
                    type: genai_1.Type.STRING,
                    description: 'Short visual color description (e.g. Cokelat Kehitaman). Max 3 words.',
                },
                state: {
                    type: genai_1.Type.STRING,
                    description: 'Short visual condition state (e.g. Membusuk & Lembab, Segar, Kering). Max 4 words.',
                },
                environment: {
                    type: genai_1.Type.STRING,
                    description: 'Short environment context (e.g. Lahan Pertanian Terbuka). Max 4 words.',
                },
            },
            required: ['color', 'state', 'environment'],
        },
        processingPotential: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.STRING,
            },
            minItems: 3,
            description: 'List of 3 to 5 potential uses or processing recommendations.',
        },
        economicEstimation: {
            type: genai_1.Type.OBJECT,
            properties: {
                potentialValue: {
                    type: genai_1.Type.STRING,
                    description: 'Estimated monetary value range in Rupiah (e.g. Rp 150.000 - Rp 300.000 / ton).',
                },
                marketOpportunity: {
                    type: genai_1.Type.STRING,
                    description: 'Market demand or opportunity level (e.g. Sedang, Tinggi).',
                },
                notes: {
                    type: genai_1.Type.STRING,
                    description: 'Detailed analysis notes or disclaimers regarding waste condition and economic value.',
                },
            },
            required: ['potentialValue', 'marketOpportunity', 'notes'],
        },
    },
    required: [
        'isAgriculturalWaste',
        'isAnalyzable',
        'wasteIdentification',
        'visualCondition',
        'processingPotential',
        'economicEstimation',
    ],
};
const SYSTEM_INSTRUCTION = `
You are Limbah Analyzer, an AI computer vision assistant for agricultural waste analysis.

Your task is to analyze uploaded images of agricultural waste.

You must follow these rules:

1. Only analyze agricultural waste and agricultural by-products.
2. Do not identify humans, personal identity, faces, or unrelated objects.
3. If the image does not contain agricultural waste, set \`isAgriculturalWaste\` to false.
4. Do not hallucinate a waste type when the image is unclear.
5. If the image quality is insufficient, set \`isAnalyzable\` to false.
6. Only return the fields defined in the response schema.
7. Do not return markdown.
8. Do not return explanations outside the JSON structure.
9. The response must always be valid JSON according to the schema.
10. The analysis is an estimate and must not be treated as a guaranteed market price.
11. Use Indonesian language for textual descriptions (indonesianName, category, color, state, environment, processingPotential items, potentialValue, marketOpportunity, notes) and English for englishName.
12. Be conservative when identifying waste. If uncertain, set values to "Tidak Diketahui" / "Unknown" or empty strings/arrays.
13. \`confidenceScore\` must be a number between 0.0 and 1.0 (e.g. 0.95 for 95% confidence).
14. \`processingPotential\` must be a non-empty array of 3 to 5 actionable processing recommendations.
15. IMPORTANT: Keep \`indonesianName\`, \`category\`, \`color\`, \`state\`, and \`environment\` concise (2 to 4 words max). Place any detailed explanations in \`economicEstimation.notes\`.
`;
const USER_PROMPT = `
Analisis gambar ini sebagai limbah pertanian.

Identifikasi hanya objek limbah pertanian yang terlihat jelas.

Jangan menebak jika gambar tidak cukup jelas.

Berikan hasil hanya dalam format JSON sesuai response schema.

Fokus pada:
- wasteIdentification (indonesianName [ringkas 2-4 kata], englishName, category, confidenceScore)
- visualCondition (color [ringkas], state [ringkas 2-4 kata], environment [ringkas])
- processingPotential (array 3-5 item potensi pemrosesan/rekomendasi)
- economicEstimation (potentialValue, marketOpportunity, notes [penjelasan detail])

Jika gambar bukan limbah pertanian, kembalikan isAgriculturalWaste=false.
`;
let WasteAnalyzerService = class WasteAnalyzerService {
    configService;
    ai;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY_CV');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined');
        }
        this.ai = new genai_1.GoogleGenAI({ apiKey });
    }
    cleanShortLabel(text, defaultVal, maxLen = 40) {
        if (!text)
            return defaultVal;
        const trimmed = String(text).trim();
        if (trimmed.length <= maxLen)
            return trimmed;
        const firstClause = trimmed.split(/[,.;]/)[0].trim();
        if (firstClause.length > 0 && firstClause.length <= maxLen) {
            return firstClause;
        }
        return trimmed.substring(0, maxLen).trim() + '...';
    }
    normalizeResponse(parsed) {
        const rawName = parsed.wasteIdentification?.indonesianName ||
            parsed.wasteType ||
            parsed.wasteAnalysis?.primaryWasteType ||
            parsed.detectedWaste?.[0]?.name ||
            'Limbah Pertanian';
        const rawCategory = parsed.wasteIdentification?.category ||
            parsed.category ||
            parsed.wasteAnalysis?.categories?.[0] ||
            parsed.detectedWaste?.[0]?.category ||
            'Limbah Pertanian';
        const rawColor = parsed.visualCondition?.color ||
            parsed.color ||
            'Alami';
        const rawState = parsed.visualCondition?.state ||
            parsed.condition ||
            parsed.detectedWaste?.[0]?.visualCondition ||
            'Sedang';
        const rawEnv = parsed.visualCondition?.environment ||
            parsed.environment ||
            'Lahan Pertanian';
        const wasteIdentification = {
            indonesianName: this.cleanShortLabel(rawName, 'Limbah Pertanian', 45),
            englishName: String(parsed.wasteIdentification?.englishName ||
                parsed.englishName ||
                'Agricultural Waste'),
            category: this.cleanShortLabel(rawCategory, 'Limbah Pertanian', 35),
            confidenceScore: Number(parsed.wasteIdentification?.confidenceScore ||
                parsed.confidence ||
                parsed.confidenceScore ||
                parsed.detectedWaste?.[0]?.confidence ||
                0.85),
        };
        const visualCondition = {
            color: this.cleanShortLabel(rawColor, 'Alami', 30),
            state: this.cleanShortLabel(rawState, 'Sedang', 35),
            environment: this.cleanShortLabel(rawEnv, 'Lahan Pertanian', 35),
        };
        let rawProcessing = [];
        if (Array.isArray(parsed.processingPotential) && parsed.processingPotential.length > 0) {
            rawProcessing = parsed.processingPotential;
        }
        else if (Array.isArray(parsed.wasteAnalysis?.processingPotential) && parsed.wasteAnalysis.processingPotential.length > 0) {
            rawProcessing = parsed.wasteAnalysis.processingPotential;
        }
        else if (Array.isArray(parsed.detectedWaste?.[0]?.potentialProcessing) && parsed.detectedWaste[0].potentialProcessing.length > 0) {
            rawProcessing = parsed.detectedWaste[0].potentialProcessing;
        }
        else if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
            rawProcessing = parsed.recommendations;
        }
        else if (Array.isArray(parsed.wasteAnalysis?.recommendations) && parsed.wasteAnalysis.recommendations.length > 0) {
            rawProcessing = parsed.wasteAnalysis.recommendations;
        }
        let processingPotential = rawProcessing.map((p) => typeof p === 'string'
            ? p
            : p.type && p.description
                ? `${p.type}: ${p.description}`
                : typeof p === 'object'
                    ? Object.values(p).join(' - ')
                    : String(p));
        if (processingPotential.length === 0) {
            processingPotential = [
                'Pengomposan secara aerobik/anaerobik untuk pupuk organik berkualitas',
                'Pemanfaatan sebagai pakan ternak (sapi/kambing) setelah pencacahan',
                'Bahan baku briket biomassa atau bahan bakar energi alternatif',
            ];
        }
        const initialNotes = parsed.economicEstimation?.notes ||
            parsed.economicPotential?.notes ||
            parsed.economicPotential?.description ||
            parsed.economicPotential?.disclaimer ||
            '';
        let finalNotes = initialNotes;
        if (rawState.length > 35 && !finalNotes.includes(rawState)) {
            finalNotes = `Kondisi fisik: ${rawState}. ${finalNotes}`.trim();
        }
        if (!finalNotes) {
            finalNotes = 'Potensi nilai ekonomi bergantung pada kadar air, kebersihan, dan pengolahan limbah.';
        }
        const economicEstimation = {
            potentialValue: String(parsed.economicEstimation?.potentialValue ||
                parsed.economicPotential?.potentialValue ||
                parsed.economicPotential?.estimatedValue ||
                parsed.detectedWaste?.[0]?.estimatedEconomicValue ||
                parsed.economicPotential?.level ||
                'Rp 150.000 - Rp 350.000 / ton'),
            marketOpportunity: String(parsed.economicEstimation?.marketOpportunity ||
                parsed.economicPotential?.marketOpportunity ||
                parsed.economicPotential?.level ||
                'Tinggi (Permintaan Lokal)'),
            notes: finalNotes,
        };
        return {
            isAgriculturalWaste: parsed.isAgriculturalWaste ?? true,
            isAnalyzable: parsed.isAnalyzable ?? true,
            wasteIdentification,
            visualCondition,
            processingPotential,
            economicEstimation,
        };
    }
    extractJsonString(rawText) {
        const firstBrace = rawText.indexOf('{');
        const lastBrace = rawText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            return rawText.substring(firstBrace, lastBrace + 1);
        }
        return rawText.replace(/```json\n?|\n?```/g, '').trim();
    }
    async analyzeImage(fileBuffer, mimeType) {
        const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash'];
        const imagePart = {
            inlineData: {
                data: fileBuffer.toString('base64'),
                mimeType,
            },
        };
        let lastError = null;
        for (const model of modelsToTry) {
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    const response = await this.ai.models.generateContent({
                        model,
                        contents: [USER_PROMPT, imagePart],
                        config: {
                            systemInstruction: SYSTEM_INSTRUCTION,
                            responseMimeType: 'application/json',
                            responseSchema: WASTE_ANALYSIS_SCHEMA,
                        },
                    });
                    const rawText = response.text || '';
                    const cleanedJsonText = this.extractJsonString(rawText);
                    const parsed = JSON.parse(cleanedJsonText);
                    const normalized = this.normalizeResponse(parsed);
                    console.log('Normalized Waste Analysis Result:', normalized);
                    return normalized;
                }
                catch (e) {
                    lastError = e;
                    console.warn(`Gemini Vision API warning (model: ${model}, attempt: ${attempt}):`, e?.message || e);
                    if (attempt < 2) {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
            }
        }
        console.error('Gemini Vision API error after all retries and fallbacks:', lastError);
        throw new common_1.InternalServerErrorException('Analisis limbah sedang mengalami lonjakan beban tinggi di server AI. Silakan coba beberapa saat lagi.');
    }
};
exports.WasteAnalyzerService = WasteAnalyzerService;
exports.WasteAnalyzerService = WasteAnalyzerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], WasteAnalyzerService);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddressModule = void 0;
const common_1 = __webpack_require__(3);
const address_controller_1 = __webpack_require__(91);
const address_service_1 = __webpack_require__(92);
let AddressModule = class AddressModule {
};
exports.AddressModule = AddressModule;
exports.AddressModule = AddressModule = __decorate([
    (0, common_1.Module)({
        controllers: [address_controller_1.AddressController],
        providers: [address_service_1.AddressService],
        exports: [address_service_1.AddressService],
    })
], AddressModule);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddressController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const address_service_1 = __webpack_require__(92);
const create_address_dto_1 = __webpack_require__(93);
const update_address_dto_1 = __webpack_require__(95);
const address_response_dto_1 = __webpack_require__(96);
let AddressController = class AddressController {
    addressService;
    constructor(addressService) {
        this.addressService = addressService;
    }
    async findAll(session) {
        const addresses = await this.addressService.findAll(session.user.id);
        return address_response_dto_1.AddressResponseDto.fromEntities(addresses);
    }
    async findDefault(session) {
        const address = await this.addressService.findDefault(session.user.id);
        return address_response_dto_1.AddressResponseDto.fromEntity(address);
    }
    async findOne(id, session) {
        const address = await this.addressService.findOne(id, session.user.id);
        return address_response_dto_1.AddressResponseDto.fromEntity(address);
    }
    async create(session, dto) {
        const address = await this.addressService.create(session.user.id, dto);
        return address_response_dto_1.AddressResponseDto.fromEntity(address);
    }
    async update(id, session, dto) {
        const address = await this.addressService.update(id, session.user.id, dto);
        return address_response_dto_1.AddressResponseDto.fromEntity(address);
    }
    async setDefault(id, session) {
        const address = await this.addressService.setDefault(id, session.user.id);
        return address_response_dto_1.AddressResponseDto.fromEntity(address);
    }
    async delete(id, session) {
        const address = await this.addressService.delete(id, session.user.id);
        return address_response_dto_1.AddressResponseDto.fromEntity(address);
    }
};
exports.AddressController = AddressController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar semua alamat user',
        description: 'Mengambil semua alamat aktif (belum dihapus) milik user yang sedang terautentikasi, diurutkan berdasarkan alamat default terlebih dahulu, kemudian alamat terbaru.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daftar alamat berhasil diambil',
        type: [address_response_dto_1.AddressResponseDto],
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], AddressController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('default'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ambil alamat default',
        description: 'Mengambil satu alamat yang ditandai sebagai alamat pengiriman default/utama milik user.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alamat default berhasil diambil',
        type: address_response_dto_1.AddressResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Alamat default tidak ditemukan' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], AddressController.prototype, "findDefault", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detail alamat',
        description: 'Mengambil detail satu alamat berdasarkan ID alamat.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'UUID dari alamat',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Detail alamat ditemukan',
        type: address_response_dto_1.AddressResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Alamat tidak ditemukan' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Tidak memiliki akses ke alamat ini' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], AddressController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Buat alamat baru',
        description: 'Menambahkan alamat pengiriman baru ke akun user. Jika ini alamat pertama, alamat otomatis dijadikan default.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Alamat berhasil dibuat',
        type: address_response_dto_1.AddressResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validasi input gagal' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_e = typeof create_address_dto_1.CreateAddressDto !== "undefined" && create_address_dto_1.CreateAddressDto) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], AddressController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update alamat',
        description: 'Mengubah informasi rincian alamat (seperti jalan, penerima, nomor HP). Field isDefault tidak bisa diubah lewat endpoint ini.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'UUID dari alamat yang akan diupdate',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alamat berhasil diperbarui',
        type: address_response_dto_1.AddressResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Alamat tidak ditemukan' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Tidak memiliki akses ke alamat ini' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validasi input gagal' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_g = typeof update_address_dto_1.UpdateAddressDto !== "undefined" && update_address_dto_1.UpdateAddressDto) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], AddressController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/set-default'),
    (0, swagger_1.ApiOperation)({
        summary: 'Jadikan alamat default',
        description: 'Mengatur alamat ini sebagai alamat default pengiriman user, dan secara otomatis menonaktifkan status default pada alamat lainnya.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'UUID dari alamat yang akan dijadikan default',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alamat berhasil dijadikan default',
        type: address_response_dto_1.AddressResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Alamat tidak ditemukan' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Tidak memiliki akses ke alamat ini' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], AddressController.prototype, "setDefault", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Hapus alamat (Soft Delete)',
        description: 'Menghapus alamat pengiriman secara soft-delete. Jika alamat yang dihapus sebelumnya adalah default, maka alamat aktif terbaru akan dipromosikan sebagai default baru.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'UUID dari alamat yang akan dihapus',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alamat berhasil dihapus secara soft-delete',
        type: address_response_dto_1.AddressResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Alamat tidak ditemukan' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Tidak memiliki akses ke alamat ini' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, nestjs_better_auth_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], AddressController.prototype, "delete", null);
exports.AddressController = AddressController = __decorate([
    (0, swagger_1.ApiTags)('Address'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('address'),
    __metadata("design:paramtypes", [typeof (_a = typeof address_service_1.AddressService !== "undefined" && address_service_1.AddressService) === "function" ? _a : Object])
], AddressController);


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddressService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
let AddressService = class AddressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        return this.prisma.address.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }
    async findDefault(userId) {
        const defaultAddress = await this.prisma.address.findFirst({
            where: {
                userId,
                isDefault: true,
                deletedAt: null,
            },
        });
        if (!defaultAddress) {
            throw new common_1.NotFoundException('Alamat default tidak ditemukan');
        }
        return defaultAddress;
    }
    async findOne(id, userId) {
        const address = await this.prisma.address.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Alamat tidak ditemukan');
        }
        if (address.userId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke alamat ini');
        }
        return address;
    }
    async create(userId, dto) {
        const count = await this.prisma.address.count({
            where: {
                userId,
                deletedAt: null,
            },
        });
        const shouldBeDefault = count === 0 ? true : !!dto.isDefault;
        const data = {
            user: { connect: { id: userId } },
            type: dto.type,
            label: dto.label ?? null,
            recipientName: dto.recipientName,
            recipientPhone: dto.recipientPhone,
            provinceId: dto.provinceId,
            provinceName: dto.provinceName,
            cityId: dto.cityId,
            cityName: dto.cityName,
            districtId: dto.districtId,
            districtName: dto.districtName,
            subDistrictId: dto.subDistrictId,
            subDistrictName: dto.subDistrictName,
            postalCode: dto.postalCode,
            street: dto.street,
            notes: dto.notes ?? null,
            latitude: dto.latitude !== undefined && dto.latitude !== null ? new client_1.Prisma.Decimal(dto.latitude) : null,
            longitude: dto.longitude !== undefined && dto.longitude !== null ? new client_1.Prisma.Decimal(dto.longitude) : null,
            placeId: dto.placeId ?? null,
            isDefault: shouldBeDefault,
        };
        if (shouldBeDefault && count > 0) {
            return this.prisma.$transaction(async (tx) => {
                await tx.address.updateMany({
                    where: {
                        userId,
                        deletedAt: null,
                        isDefault: true,
                    },
                    data: { isDefault: false },
                });
                return tx.address.create({ data });
            });
        }
        return this.prisma.address.create({ data });
    }
    async update(id, userId, dto) {
        await this.findOne(id, userId);
        const data = {
            ...(dto.type !== undefined && { type: dto.type }),
            ...(dto.label !== undefined && { label: dto.label ?? null }),
            ...(dto.recipientName !== undefined && { recipientName: dto.recipientName }),
            ...(dto.recipientPhone !== undefined && { recipientPhone: dto.recipientPhone }),
            ...(dto.provinceId !== undefined && { provinceId: dto.provinceId }),
            ...(dto.provinceName !== undefined && { provinceName: dto.provinceName }),
            ...(dto.cityId !== undefined && { cityId: dto.cityId }),
            ...(dto.cityName !== undefined && { cityName: dto.cityName }),
            ...(dto.districtId !== undefined && { districtId: dto.districtId }),
            ...(dto.districtName !== undefined && { districtName: dto.districtName }),
            ...(dto.subDistrictId !== undefined && { subDistrictId: dto.subDistrictId }),
            ...(dto.subDistrictName !== undefined && { subDistrictName: dto.subDistrictName }),
            ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
            ...(dto.street !== undefined && { street: dto.street }),
            ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
            ...(dto.latitude !== undefined && {
                latitude: dto.latitude !== null ? new client_1.Prisma.Decimal(dto.latitude) : null,
            }),
            ...(dto.longitude !== undefined && {
                longitude: dto.longitude !== null ? new client_1.Prisma.Decimal(dto.longitude) : null,
            }),
            ...(dto.placeId !== undefined && { placeId: dto.placeId ?? null }),
        };
        return this.prisma.address.update({
            where: { id },
            data,
        });
    }
    async setDefault(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.$transaction(async (tx) => {
            await tx.address.updateMany({
                where: {
                    userId,
                    deletedAt: null,
                    isDefault: true,
                },
                data: { isDefault: false },
            });
            return tx.address.update({
                where: { id },
                data: { isDefault: true },
            });
        });
    }
    async delete(id, userId) {
        const address = await this.findOne(id, userId);
        return this.prisma.$transaction(async (tx) => {
            const deletedAddress = await tx.address.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    isDefault: false,
                },
            });
            if (address.isDefault) {
                const nextDefault = await tx.address.findFirst({
                    where: {
                        userId,
                        deletedAt: null,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
                if (nextDefault) {
                    await tx.address.update({
                        where: { id: nextDefault.id },
                        data: { isDefault: true },
                    });
                }
            }
            return deletedAddress;
        });
    }
};
exports.AddressService = AddressService;
exports.AddressService = AddressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AddressService);


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAddressDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
const client_1 = __webpack_require__(9);
const phone_util_1 = __webpack_require__(94);
class CreateAddressDto {
    type;
    label;
    recipientName;
    recipientPhone;
    provinceId;
    provinceName;
    cityId;
    cityName;
    districtId;
    districtName;
    subDistrictId;
    subDistrictName;
    postalCode;
    street;
    notes;
    latitude;
    longitude;
    placeId;
    isDefault;
}
exports.CreateAddressDto = CreateAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.AddressType,
        example: client_1.AddressType.HOME,
        description: 'Jenis alamat (HOME, OFFICE, atau OTHER)',
    }),
    (0, class_validator_1.IsEnum)(client_1.AddressType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof client_1.AddressType !== "undefined" && client_1.AddressType) === "function" ? _a : Object)
], CreateAddressDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Rumah Utama',
        description: 'Label kustom alamat (misal: Rumah Utama, Kantor Cabang)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Budi Santoso',
        description: 'Nama lengkap penerima',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "recipientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '081234567890',
        description: 'Nomor telepon penerima (akan dinormalisasi otomatis ke format 62xxx)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? (0, phone_util_1.normalizePhone)(value.trim()) : value),
    (0, class_validator_1.Length)(10, 16, {
        message: 'Nomor telepon penerima harus berdurasi antara 10 hingga 16 digit setelah dinormalisasi',
    }),
    (0, class_validator_1.Matches)(/^62\d{8,14}$/, {
        message: 'Format nomor telepon harus berupa nomor telepon Indonesia yang valid (berawalan 62)',
    }),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '32',
        description: 'ID Provinsi dari Master Data',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "provinceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jawa Barat',
        description: 'Nama Provinsi',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "provinceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '3273',
        description: 'ID Kota/Kabupaten dari Master Data',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Kota Bandung',
        description: 'Nama Kota/Kabupaten',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "cityName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '3273250',
        description: 'ID Kecamatan dari Master Data',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Coblong',
        description: 'Nama Kecamatan',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "districtName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '3273250004',
        description: 'ID Kelurahan/Desa dari Master Data',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "subDistrictId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Dago',
        description: 'Nama Kelurahan/Desa',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "subDistrictName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '40135',
        description: 'Kode Pos wilayah',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jl. Ir. H. Juanda No. 123',
        description: 'Nama jalan dan detail alamat fisik',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Pagar hitam sebelah warung kelontong',
        description: 'Catatan tambahan untuk kurir',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: -6.89148,
        description: 'Koordinat garis lintang (latitude) untuk penanda peta',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAddressDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 107.61637,
        description: 'Koordinat garis bujur (longitude) untuk penanda peta',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAddressDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'ChIJs-a21234567890',
        description: 'ID lokasi Google Maps Place',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "placeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: false,
        description: 'Jadikan alamat ini sebagai default utama user',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAddressDto.prototype, "isDefault", void 0);


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizePhone = normalizePhone;
exports.validatePhone = validatePhone;
function normalizePhone(phone) {
    if (!phone)
        return phone;
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.slice(1);
    }
    return cleaned;
}
function validatePhone(phone) {
    if (!phone)
        return false;
    return /^62\d{8,14}$/.test(phone);
}


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAddressDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
const client_1 = __webpack_require__(9);
const phone_util_1 = __webpack_require__(94);
class UpdateAddressDto {
    type;
    label;
    recipientName;
    recipientPhone;
    provinceId;
    provinceName;
    cityId;
    cityName;
    districtId;
    districtName;
    subDistrictId;
    subDistrictName;
    postalCode;
    street;
    notes;
    latitude;
    longitude;
    placeId;
}
exports.UpdateAddressDto = UpdateAddressDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.AddressType,
        example: client_1.AddressType.HOME,
        description: 'Jenis alamat (HOME, OFFICE, atau OTHER)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AddressType),
    __metadata("design:type", typeof (_a = typeof client_1.AddressType !== "undefined" && client_1.AddressType) === "function" ? _a : Object)
], UpdateAddressDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Rumah Utama',
        description: 'Label kustom alamat (misal: Rumah Utama, Kantor Cabang)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Budi Santoso',
        description: 'Nama lengkap penerima',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "recipientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '081234567890',
        description: 'Nomor telepon penerima (akan dinormalisasi otomatis ke format 62xxx)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? (0, phone_util_1.normalizePhone)(value.trim()) : value),
    (0, class_validator_1.Length)(10, 16, {
        message: 'Nomor telepon penerima harus berdurasi antara 10 hingga 16 digit setelah dinormalisasi',
    }),
    (0, class_validator_1.Matches)(/^62\d{8,14}$/, {
        message: 'Format nomor telepon harus berupa nomor telepon Indonesia yang valid (berawalan 62)',
    }),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '32',
        description: 'ID Provinsi dari Master Data',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "provinceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Jawa Barat',
        description: 'Nama Provinsi',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "provinceName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '3273',
        description: 'ID Kota/Kabupaten dari Master Data',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Kota Bandung',
        description: 'Nama Kota/Kabupaten',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "cityName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '3273250',
        description: 'ID Kecamatan dari Master Data',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Coblong',
        description: 'Nama Kecamatan',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "districtName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '3273250004',
        description: 'ID Kelurahan/Desa dari Master Data',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "subDistrictId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Dago',
        description: 'Nama Kelurahan/Desa',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "subDistrictName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '40135',
        description: 'Kode Pos wilayah',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Jl. Ir. H. Juanda No. 123',
        description: 'Nama jalan dan detail alamat fisik',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Pagar hitam sebelah warung kelontong',
        description: 'Catatan tambahan untuk kurir',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: -6.89148,
        description: 'Koordinat garis lintang (latitude) untuk penanda peta',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateAddressDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 107.61637,
        description: 'Koordinat garis bujur (longitude) untuk penanda peta',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateAddressDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'ChIJs-a21234567890',
        description: 'ID lokasi Google Maps Place',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "placeId", void 0);


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddressResponseDto = void 0;
class AddressResponseDto {
    id;
    userId;
    type;
    label;
    recipientName;
    recipientPhone;
    provinceId;
    provinceName;
    cityId;
    cityName;
    districtId;
    districtName;
    subDistrictId;
    subDistrictName;
    postalCode;
    street;
    notes;
    latitude;
    longitude;
    placeId;
    isDefault;
    createdAt;
    updatedAt;
    static fromEntity(entity) {
        return {
            id: entity.id,
            userId: entity.userId,
            type: entity.type,
            label: entity.label,
            recipientName: entity.recipientName,
            recipientPhone: entity.recipientPhone,
            provinceId: entity.provinceId,
            provinceName: entity.provinceName,
            cityId: entity.cityId,
            cityName: entity.cityName,
            districtId: entity.districtId,
            districtName: entity.districtName,
            subDistrictId: entity.subDistrictId,
            subDistrictName: entity.subDistrictName,
            postalCode: entity.postalCode,
            street: entity.street,
            notes: entity.notes,
            latitude: entity.latitude ? entity.latitude.toNumber() : null,
            longitude: entity.longitude ? entity.longitude.toNumber() : null,
            placeId: entity.placeId,
            isDefault: entity.isDefault,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    static fromEntities(entities) {
        return entities.map((entity) => this.fromEntity(entity));
    }
}
exports.AddressResponseDto = AddressResponseDto;


/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegionModule = void 0;
const common_1 = __webpack_require__(3);
const region_controller_1 = __webpack_require__(98);
const region_service_1 = __webpack_require__(99);
let RegionModule = class RegionModule {
};
exports.RegionModule = RegionModule;
exports.RegionModule = RegionModule = __decorate([
    (0, common_1.Module)({
        controllers: [region_controller_1.RegionController],
        providers: [region_service_1.RegionService],
        exports: [region_service_1.RegionService],
    })
], RegionModule);


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegionController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const region_service_1 = __webpack_require__(99);
const get_regencies_dto_1 = __webpack_require__(101);
const get_districts_dto_1 = __webpack_require__(102);
const get_villages_dto_1 = __webpack_require__(103);
const search_region_dto_1 = __webpack_require__(104);
const province_response_dto_1 = __webpack_require__(105);
const regency_response_dto_1 = __webpack_require__(106);
const district_response_dto_1 = __webpack_require__(107);
const village_response_dto_1 = __webpack_require__(108);
const region_search_response_dto_1 = __webpack_require__(100);
let RegionController = class RegionController {
    regionService;
    constructor(regionService) {
        this.regionService = regionService;
    }
    async getProvinces() {
        return this.regionService.getProvinces();
    }
    async getRegencies(query) {
        return this.regionService.getRegencies(query.provinceId);
    }
    async getDistricts(query) {
        return this.regionService.getDistricts(query.regencyId);
    }
    async getVillages(query) {
        return this.regionService.getVillages(query.districtId);
    }
    async searchRegions(query) {
        return this.regionService.searchRegions(query.keyword);
    }
};
exports.RegionController = RegionController;
__decorate([
    (0, common_1.Get)('provinces'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar semua provinsi',
        description: 'Mengambil daftar seluruh provinsi di Indonesia, diurutkan berdasarkan nama secara ascending. **Endpoint publik.**',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Daftar provinsi berhasil diambil',
        type: [province_response_dto_1.ProvinceResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], RegionController.prototype, "getProvinces", null);
__decorate([
    (0, common_1.Get)('regencies'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar kabupaten/kota berdasarkan provinceId',
        description: 'Mengambil daftar kabupaten/kota milik provinsi tertentu. Parameter `provinceId` wajib diisi. **Endpoint publik.**',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'provinceId',
        description: 'ID Provinsi (kode Kemendagri)',
        example: '14',
        required: true,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Daftar kabupaten/kota berhasil diambil',
        type: [regency_response_dto_1.RegencyResponseDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof get_regencies_dto_1.GetRegenciesDto !== "undefined" && get_regencies_dto_1.GetRegenciesDto) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], RegionController.prototype, "getRegencies", null);
__decorate([
    (0, common_1.Get)('districts'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar kecamatan berdasarkan regencyId',
        description: 'Mengambil daftar kecamatan milik kabupaten/kota tertentu. Parameter `regencyId` wajib diisi. **Endpoint publik.**',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'regencyId',
        description: 'ID Kabupaten/Kota (kode Kemendagri)',
        example: '1401',
        required: true,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Daftar kecamatan berhasil diambil',
        type: [district_response_dto_1.DistrictResponseDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof get_districts_dto_1.GetDistrictsDto !== "undefined" && get_districts_dto_1.GetDistrictsDto) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], RegionController.prototype, "getDistricts", null);
__decorate([
    (0, common_1.Get)('villages'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar kelurahan/desa berdasarkan districtId',
        description: 'Mengambil daftar kelurahan/desa milik kecamatan tertentu. Parameter `districtId` wajib diisi. **Endpoint publik.**',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'districtId',
        description: 'ID Kecamatan (kode Kemendagri)',
        example: '140101',
        required: true,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Daftar kelurahan/desa berhasil diambil',
        type: [village_response_dto_1.VillageResponseDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof get_villages_dto_1.GetVillagesDto !== "undefined" && get_villages_dto_1.GetVillagesDto) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], RegionController.prototype, "getVillages", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Pencarian autocomplete wilayah',
        description: 'Mencari wilayah (Provinsi, Kabupaten/Kota, Kecamatan, Kelurahan/Desa) berdasarkan kata kunci nama. Minimal 3 karakter. Maksimal 20 data. **Endpoint publik.**',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'keyword',
        description: 'Kata kunci pencarian nama wilayah',
        example: 'bandung',
        required: true,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Hasil pencarian wilayah berhasil diambil',
        type: [region_search_response_dto_1.RegionSearchItemDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof search_region_dto_1.SearchRegionDto !== "undefined" && search_region_dto_1.SearchRegionDto) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], RegionController.prototype, "searchRegions", null);
exports.RegionController = RegionController = __decorate([
    (0, swagger_1.ApiTags)('Regions'),
    (0, common_1.Controller)('regions'),
    __metadata("design:paramtypes", [typeof (_a = typeof region_service_1.RegionService !== "undefined" && region_service_1.RegionService) === "function" ? _a : Object])
], RegionController);


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegionService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const region_search_response_dto_1 = __webpack_require__(100);
let RegionService = class RegionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProvinces() {
        return this.prisma.province.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async getRegencies(provinceId) {
        return this.prisma.regency.findMany({
            where: {
                provinceId,
            },
            select: {
                id: true,
                provinceId: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async getDistricts(regencyId) {
        return this.prisma.district.findMany({
            where: {
                regencyId,
            },
            select: {
                id: true,
                regencyId: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async getVillages(districtId) {
        return this.prisma.village.findMany({
            where: {
                districtId,
            },
            select: {
                id: true,
                districtId: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async searchRegions(keyword) {
        if (!keyword || keyword.trim().length < 3) {
            return [];
        }
        const term = keyword.trim();
        const results = [];
        const LIMIT = 20;
        const provinces = await this.prisma.province.findMany({
            where: {
                name: {
                    contains: term,
                    mode: 'insensitive',
                },
            },
            select: { id: true, name: true },
            take: LIMIT,
            orderBy: { name: 'asc' },
        });
        for (const prov of provinces) {
            results.push({
                id: prov.id,
                name: prov.name,
                type: region_search_response_dto_1.RegionType.PROVINCE,
                fullName: prov.name,
            });
        }
        if (results.length >= LIMIT) {
            return results.slice(0, LIMIT);
        }
        const remainingAfterProv = LIMIT - results.length;
        const regencies = await this.prisma.regency.findMany({
            where: {
                name: {
                    contains: term,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                name: true,
                province: {
                    select: { name: true },
                },
            },
            take: remainingAfterProv,
            orderBy: { name: 'asc' },
        });
        for (const reg of regencies) {
            results.push({
                id: reg.id,
                name: reg.name,
                type: region_search_response_dto_1.RegionType.REGENCY,
                fullName: `${reg.name}, ${reg.province.name}`,
            });
        }
        if (results.length >= LIMIT) {
            return results.slice(0, LIMIT);
        }
        const remainingAfterReg = LIMIT - results.length;
        const districts = await this.prisma.district.findMany({
            where: {
                name: {
                    contains: term,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                name: true,
                regency: {
                    select: {
                        name: true,
                        province: {
                            select: { name: true },
                        },
                    },
                },
            },
            take: remainingAfterReg,
            orderBy: { name: 'asc' },
        });
        for (const dist of districts) {
            results.push({
                id: dist.id,
                name: dist.name,
                type: region_search_response_dto_1.RegionType.DISTRICT,
                fullName: `Kec. ${dist.name}, ${dist.regency.name}, ${dist.regency.province.name}`,
            });
        }
        if (results.length >= LIMIT) {
            return results.slice(0, LIMIT);
        }
        const remainingAfterDist = LIMIT - results.length;
        const villages = await this.prisma.village.findMany({
            where: {
                name: {
                    contains: term,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                name: true,
                district: {
                    select: {
                        name: true,
                        regency: {
                            select: {
                                name: true,
                                province: {
                                    select: { name: true },
                                },
                            },
                        },
                    },
                },
            },
            take: remainingAfterDist,
            orderBy: { name: 'asc' },
        });
        for (const vil of villages) {
            results.push({
                id: vil.id,
                name: vil.name,
                type: region_search_response_dto_1.RegionType.VILLAGE,
                fullName: `${vil.name}, Kec. ${vil.district.name}, ${vil.district.regency.name}, ${vil.district.regency.province.name}`,
            });
        }
        return results.slice(0, LIMIT);
    }
};
exports.RegionService = RegionService;
exports.RegionService = RegionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], RegionService);


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegionSearchItemDto = exports.RegionType = void 0;
const swagger_1 = __webpack_require__(13);
var RegionType;
(function (RegionType) {
    RegionType["PROVINCE"] = "PROVINCE";
    RegionType["REGENCY"] = "REGENCY";
    RegionType["DISTRICT"] = "DISTRICT";
    RegionType["VILLAGE"] = "VILLAGE";
})(RegionType || (exports.RegionType = RegionType = {}));
class RegionSearchItemDto {
    id;
    name;
    type;
    fullName;
}
exports.RegionSearchItemDto = RegionSearchItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1401' }),
    __metadata("design:type", String)
], RegionSearchItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KABUPATEN KAMPAR' }),
    __metadata("design:type", String)
], RegionSearchItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: RegionType, example: RegionType.REGENCY }),
    __metadata("design:type", String)
], RegionSearchItemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KABUPATEN KAMPAR, RIAU' }),
    __metadata("design:type", String)
], RegionSearchItemDto.prototype, "fullName", void 0);


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetRegenciesDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class GetRegenciesDto {
    provinceId;
}
exports.GetRegenciesDto = GetRegenciesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID Provinsi (kode Kemendagri)',
        example: '14',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'provinceId wajib diisi' }),
    (0, class_validator_1.IsString)({ message: 'provinceId harus berupa string' }),
    __metadata("design:type", String)
], GetRegenciesDto.prototype, "provinceId", void 0);


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetDistrictsDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class GetDistrictsDto {
    regencyId;
}
exports.GetDistrictsDto = GetDistrictsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID Kabupaten/Kota (kode Kemendagri)',
        example: '1401',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'regencyId wajib diisi' }),
    (0, class_validator_1.IsString)({ message: 'regencyId harus berupa string' }),
    __metadata("design:type", String)
], GetDistrictsDto.prototype, "regencyId", void 0);


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetVillagesDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class GetVillagesDto {
    districtId;
}
exports.GetVillagesDto = GetVillagesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID Kecamatan (kode Kemendagri)',
        example: '140101',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'districtId wajib diisi' }),
    (0, class_validator_1.IsString)({ message: 'districtId harus berupa string' }),
    __metadata("design:type", String)
], GetVillagesDto.prototype, "districtId", void 0);


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchRegionDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class SearchRegionDto {
    keyword;
}
exports.SearchRegionDto = SearchRegionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Kata kunci pencarian nama wilayah (minimal 3 karakter)',
        example: 'bandung',
        minLength: 3,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'keyword wajib diisi' }),
    (0, class_validator_1.IsString)({ message: 'keyword harus berupa string' }),
    (0, class_validator_1.MinLength)(3, { message: 'keyword minimal 3 karakter' }),
    __metadata("design:type", String)
], SearchRegionDto.prototype, "keyword", void 0);


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProvinceResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class ProvinceResponseDto {
    id;
    name;
}
exports.ProvinceResponseDto = ProvinceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '14' }),
    __metadata("design:type", String)
], ProvinceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'RIAU' }),
    __metadata("design:type", String)
], ProvinceResponseDto.prototype, "name", void 0);


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegencyResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class RegencyResponseDto {
    id;
    provinceId;
    name;
}
exports.RegencyResponseDto = RegencyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1401' }),
    __metadata("design:type", String)
], RegencyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '14' }),
    __metadata("design:type", String)
], RegencyResponseDto.prototype, "provinceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KABUPATEN KAMPAR' }),
    __metadata("design:type", String)
], RegencyResponseDto.prototype, "name", void 0);


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DistrictResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class DistrictResponseDto {
    id;
    regencyId;
    name;
}
exports.DistrictResponseDto = DistrictResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '140101' }),
    __metadata("design:type", String)
], DistrictResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1401' }),
    __metadata("design:type", String)
], DistrictResponseDto.prototype, "regencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BANGKINANG' }),
    __metadata("design:type", String)
], DistrictResponseDto.prototype, "name", void 0);


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VillageResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class VillageResponseDto {
    id;
    districtId;
    name;
}
exports.VillageResponseDto = VillageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1401011001' }),
    __metadata("design:type", String)
], VillageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '140101' }),
    __metadata("design:type", String)
], VillageResponseDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'LANGGINI' }),
    __metadata("design:type", String)
], VillageResponseDto.prototype, "name", void 0);


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutModule = void 0;
const common_1 = __webpack_require__(3);
const checkout_controller_1 = __webpack_require__(110);
const checkout_service_1 = __webpack_require__(111);
const prisma_module_1 = __webpack_require__(33);
let CheckoutModule = class CheckoutModule {
};
exports.CheckoutModule = CheckoutModule;
exports.CheckoutModule = CheckoutModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [checkout_controller_1.CheckoutController],
        providers: [checkout_service_1.CheckoutService],
        exports: [checkout_service_1.CheckoutService],
    })
], CheckoutModule);


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const checkout_service_1 = __webpack_require__(111);
const buy_now_checkout_dto_1 = __webpack_require__(112);
const cart_checkout_dto_1 = __webpack_require__(113);
const checkout_response_dto_1 = __webpack_require__(114);
let CheckoutController = class CheckoutController {
    checkoutService;
    constructor(checkoutService) {
        this.checkoutService = checkoutService;
    }
    checkoutBuyNow(session, dto) {
        return this.checkoutService.checkoutBuyNow(session.user.id, dto);
    }
    checkoutCart(session, dto) {
        return this.checkoutService.checkoutCart(session.user.id, dto);
    }
};
exports.CheckoutController = CheckoutController;
__decorate([
    (0, common_1.Post)('buy-now'),
    (0, swagger_1.ApiOperation)({
        summary: 'Preview checkout Beli Sekarang',
        description: 'Menghasilkan kalkulasi preview ringkasan checkout untuk pembelian langsung 1 produk tanpa membuat pesanan (stateless).',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Preview checkout berhasil dihasilkan',
        type: checkout_response_dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Produk sendiri, stok tidak mencukupi, atau produk tidak aktif',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Produk atau alamat tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof buy_now_checkout_dto_1.BuyNowCheckoutDto !== "undefined" && buy_now_checkout_dto_1.BuyNowCheckoutDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], CheckoutController.prototype, "checkoutBuyNow", null);
__decorate([
    (0, common_1.Post)('cart'),
    (0, swagger_1.ApiOperation)({
        summary: 'Preview checkout dari Keranjang Belanja',
        description: 'Menghasilkan kalkulasi preview ringkasan checkout untuk daftar item pilihan dari keranjang belanja (stateless).',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Preview checkout berhasil dihasilkan',
        type: checkout_response_dto_1.CheckoutResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Keranjang kosong, item tidak valid, stok tidak mencukupi, atau produk sendiri',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Alamat pengiriman tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof cart_checkout_dto_1.CartCheckoutDto !== "undefined" && cart_checkout_dto_1.CartCheckoutDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], CheckoutController.prototype, "checkoutCart", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, swagger_1.ApiTags)('Checkout'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('checkout'),
    __metadata("design:paramtypes", [typeof (_a = typeof checkout_service_1.CheckoutService !== "undefined" && checkout_service_1.CheckoutService) === "function" ? _a : Object])
], CheckoutController);


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const client_1 = __webpack_require__(9);
let CheckoutService = class CheckoutService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkoutBuyNow(userId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                    take: 1,
                },
                seller: {
                    include: {
                        sellerProfile: true,
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produk tidak ditemukan');
        }
        this.validateProductStatus(product.status, product.title);
        this.validateStock(product.stock, dto.quantity, product.title);
        if (product.sellerId === userId) {
            throw new common_1.BadRequestException('Anda tidak dapat membeli produk Anda sendiri');
        }
        const address = await this.validateAddress(userId, dto.addressId);
        const storeName = product.seller.sellerProfile?.storeName ||
            product.seller.name ||
            'Toko Tani';
        const storeSlug = product.seller.sellerProfile?.storeSlug || product.sellerId;
        const itemSubtotal = product.price * dto.quantity;
        const itemWeight = product.weight * dto.quantity;
        const itemResponse = {
            id: `buy-now-${product.id}`,
            productId: product.id,
            productName: product.title,
            slug: product.slug,
            image: product.images[0]?.imageUrl || null,
            price: product.price,
            weight: product.weight,
            quantity: dto.quantity,
            subtotal: itemSubtotal,
            sellerId: product.sellerId,
            sellerName: storeName,
        };
        const storeResponse = {
            sellerId: product.sellerId,
            sellerName: storeName,
            storeSlug: storeSlug,
            items: [itemResponse],
            storeSubtotal: itemSubtotal,
            storeWeight: itemWeight,
        };
        return this.buildCheckoutResponse(address, [storeResponse]);
    }
    async checkoutCart(userId, dto) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            throw new common_1.BadRequestException('Keranjang belanja kosong');
        }
        const cartItems = await this.prisma.cartItem.findMany({
            where: {
                id: { in: dto.cartItemIds },
                cartId: cart.id,
            },
            include: {
                product: {
                    include: {
                        images: {
                            orderBy: { order: 'asc' },
                            take: 1,
                        },
                        seller: {
                            include: {
                                sellerProfile: true,
                            },
                        },
                    },
                },
            },
        });
        if (cartItems.length !== dto.cartItemIds.length) {
            throw new common_1.BadRequestException('Satu atau lebih item keranjang tidak ditemukan atau tidak valid');
        }
        for (const item of cartItems) {
            this.validateProductStatus(item.product.status, item.product.title);
            this.validateStock(item.product.stock, item.quantity, item.product.title);
            if (item.product.sellerId === userId) {
                throw new common_1.BadRequestException(`Anda tidak dapat membeli produk Anda sendiri (${item.product.title})`);
            }
        }
        const address = await this.validateAddress(userId, dto.addressId);
        const storeMap = new Map();
        for (const item of cartItems) {
            const p = item.product;
            const sellerId = p.sellerId;
            const storeName = p.seller.sellerProfile?.storeName || p.seller.name || 'Toko Tani';
            const storeSlug = p.seller.sellerProfile?.storeSlug || sellerId;
            const itemSubtotal = p.price * item.quantity;
            const itemWeight = p.weight * item.quantity;
            const itemResponse = {
                id: item.id,
                productId: p.id,
                productName: p.title,
                slug: p.slug,
                image: p.images[0]?.imageUrl || null,
                price: p.price,
                weight: p.weight,
                quantity: item.quantity,
                subtotal: itemSubtotal,
                sellerId: sellerId,
                sellerName: storeName,
            };
            if (!storeMap.has(sellerId)) {
                storeMap.set(sellerId, {
                    sellerId,
                    sellerName: storeName,
                    storeSlug,
                    items: [],
                    storeSubtotal: 0,
                    storeWeight: 0,
                });
            }
            const storeGroup = storeMap.get(sellerId);
            storeGroup.items.push(itemResponse);
            storeGroup.storeSubtotal += itemSubtotal;
            storeGroup.storeWeight += itemWeight;
        }
        const stores = Array.from(storeMap.values());
        return this.buildCheckoutResponse(address, stores);
    }
    validateProductStatus(status, title) {
        if (status !== client_1.ProductStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Produk "${title}" tidak aktif atau tidak dapat dibeli`);
        }
    }
    validateStock(currentStock, requestedQty, title) {
        if (currentStock < requestedQty) {
            throw new common_1.BadRequestException(`Stok produk "${title}" tidak mencukupi (Tersisa ${currentStock})`);
        }
    }
    async validateAddress(userId, addressId) {
        let targetAddress;
        if (addressId) {
            targetAddress = await this.prisma.address.findFirst({
                where: {
                    id: addressId,
                    userId,
                    deletedAt: null,
                },
            });
            if (!targetAddress) {
                throw new common_1.NotFoundException('Alamat pengiriman tidak ditemukan atau telah dihapus');
            }
        }
        else {
            targetAddress = await this.prisma.address.findFirst({
                where: {
                    userId,
                    isDefault: true,
                    deletedAt: null,
                },
            });
            if (!targetAddress) {
                targetAddress = await this.prisma.address.findFirst({
                    where: {
                        userId,
                        deletedAt: null,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
            }
        }
        if (!targetAddress) {
            return null;
        }
        const fullAddress = `${targetAddress.street}, ${targetAddress.subDistrictName}, ${targetAddress.districtName}, ${targetAddress.cityName}, ${targetAddress.provinceName}, ${targetAddress.postalCode}`;
        return {
            id: targetAddress.id,
            recipientName: targetAddress.recipientName,
            recipientPhone: targetAddress.recipientPhone,
            fullAddress,
            province: targetAddress.provinceName,
            city: targetAddress.cityName,
            district: targetAddress.districtName,
            subDistrict: targetAddress.subDistrictName,
            postalCode: targetAddress.postalCode,
            isDefault: targetAddress.isDefault,
        };
    }
    buildCheckoutResponse(address, stores) {
        const subtotal = stores.reduce((sum, store) => sum + store.storeSubtotal, 0);
        const shippingCost = 0;
        const serviceFee = 0;
        const discount = 0;
        const insuranceFee = 0;
        const applicationFee = 0;
        const total = subtotal +
            shippingCost +
            serviceFee +
            insuranceFee +
            applicationFee -
            discount;
        return {
            address,
            stores,
            shipping: {
                courier: null,
                service: null,
                etd: null,
                cost: shippingCost,
            },
            pricing: {
                subtotal,
                shippingCost,
                serviceFee,
                discount,
                insuranceFee,
                applicationFee,
                total,
            },
        };
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CheckoutService);


/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuyNowCheckoutDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
class BuyNowCheckoutDto {
    productId;
    quantity;
    addressId;
}
exports.BuyNowCheckoutDto = BuyNowCheckoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        description: 'ID produk yang akan dibeli langsung',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)('4', { message: 'ID produk harus berformat UUID v4 yang valid' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], BuyNowCheckoutDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Jumlah kuantitas produk yang dibeli',
        default: 1,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Kuantitas harus berupa angka bulat' }),
    (0, class_validator_1.Min)(1, { message: 'Kuantitas minimal 1' }),
    __metadata("design:type", Number)
], BuyNowCheckoutDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'f8e7d6c5-b4a3-2f1e-0d9c-8b7a6f5e4d3c',
        description: 'ID alamat pengiriman terpilih (opsional, jika kosong akan menggunakan alamat default user)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)('4', { message: 'ID alamat harus berformat UUID v4 yang valid' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined),
    __metadata("design:type", String)
], BuyNowCheckoutDto.prototype, "addressId", void 0);


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CartCheckoutDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
class CartCheckoutDto {
    cartItemIds;
    addressId;
}
exports.CartCheckoutDto = CartCheckoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['item-uuid-1', 'item-uuid-2'],
        description: 'Daftar ID item keranjang belanja yang diproses checkout',
    }),
    (0, class_validator_1.IsArray)({ message: 'cartItemIds harus berupa array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Pilih minimal 1 item keranjang untuk checkout' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Setiap ID item keranjang harus berupa string' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Setiap ID item keranjang harus berupa UUID v4 yang valid' }),
    __metadata("design:type", Array)
], CartCheckoutDto.prototype, "cartItemIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'f8e7d6c5-b4a3-2f1e-0d9c-8b7a6f5e4d3c',
        description: 'ID alamat pengiriman terpilih (opsional, jika kosong akan menggunakan alamat default user)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)('4', { message: 'ID alamat harus berformat UUID v4 yang valid' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined),
    __metadata("design:type", String)
], CartCheckoutDto.prototype, "addressId", void 0);


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
const checkout_address_response_dto_1 = __webpack_require__(115);
const checkout_store_response_dto_1 = __webpack_require__(116);
const checkout_shipping_response_dto_1 = __webpack_require__(118);
const checkout_pricing_response_dto_1 = __webpack_require__(119);
class CheckoutResponseDto {
    address;
    stores;
    shipping;
    pricing;
}
exports.CheckoutResponseDto = CheckoutResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: checkout_address_response_dto_1.CheckoutAddressResponseDto, nullable: true, description: 'Alamat pengiriman terpilih' }),
    __metadata("design:type", Object)
], CheckoutResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [checkout_store_response_dto_1.CheckoutStoreResponseDto], description: 'Daftar toko dan barang yang dibeli (dikelompokkan per toko)' }),
    __metadata("design:type", Array)
], CheckoutResponseDto.prototype, "stores", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: checkout_shipping_response_dto_1.CheckoutShippingResponseDto, description: 'Informasi opsi pengiriman' }),
    __metadata("design:type", typeof (_b = typeof checkout_shipping_response_dto_1.CheckoutShippingResponseDto !== "undefined" && checkout_shipping_response_dto_1.CheckoutShippingResponseDto) === "function" ? _b : Object)
], CheckoutResponseDto.prototype, "shipping", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: checkout_pricing_response_dto_1.CheckoutPricingResponseDto, description: 'Rincian kalkulasi harga dan total biaya' }),
    __metadata("design:type", typeof (_c = typeof checkout_pricing_response_dto_1.CheckoutPricingResponseDto !== "undefined" && checkout_pricing_response_dto_1.CheckoutPricingResponseDto) === "function" ? _c : Object)
], CheckoutResponseDto.prototype, "pricing", void 0);


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutAddressResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class CheckoutAddressResponseDto {
    id;
    recipientName;
    recipientPhone;
    fullAddress;
    province;
    city;
    district;
    subDistrict;
    postalCode;
    isDefault;
}
exports.CheckoutAddressResponseDto = CheckoutAddressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f8e7d6c5-b4a3-2f1e-0d9c-8b7a6f5e4d3c', description: 'ID Alamat' }),
    __metadata("design:type", String)
], CheckoutAddressResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Budi Santoso', description: 'Nama penerima' }),
    __metadata("design:type", String)
], CheckoutAddressResponseDto.prototype, "recipientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6281234567890', description: 'Nomor telepon penerima' }),
    __metadata("design:type", String)
], CheckoutAddressResponseDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jl. Ir. H. Juanda No. 123, Dago, Coblong, Kota Bandung, Jawa Barat, 40135',
        description: 'Alamat lengkap gabungan',
    }),
    __metadata("design:type", String)
], CheckoutAddressResponseDto.prototype, "fullAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jawa Barat', description: 'Provinsi' }),
    __metadata("design:type", String)
], CheckoutAddressResponseDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kota Bandung', description: 'Kota/Kabupaten' }),
    __metadata("design:type", String)
], CheckoutAddressResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Coblong', description: 'Kecamatan' }),
    __metadata("design:type", String)
], CheckoutAddressResponseDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dago', description: 'Kelurahan/Desa' }),
    __metadata("design:type", String)
], CheckoutAddressResponseDto.prototype, "subDistrict", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '40135', description: 'Kode pos' }),
    __metadata("design:type", String)
], CheckoutAddressResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Apakah alamat utama user' }),
    __metadata("design:type", Boolean)
], CheckoutAddressResponseDto.prototype, "isDefault", void 0);


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutStoreResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
const checkout_item_response_dto_1 = __webpack_require__(117);
class CheckoutStoreResponseDto {
    sellerId;
    sellerName;
    storeSlug;
    items;
    storeSubtotal;
    storeWeight;
}
exports.CheckoutStoreResponseDto = CheckoutStoreResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'seller-id-123', description: 'ID Penjual / Toko' }),
    __metadata("design:type", String)
], CheckoutStoreResponseDto.prototype, "sellerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Toko Tani Subur', description: 'Nama Toko Penjual' }),
    __metadata("design:type", String)
], CheckoutStoreResponseDto.prototype, "sellerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'toko-tani-subur', description: 'Slug Toko Penjual' }),
    __metadata("design:type", String)
], CheckoutStoreResponseDto.prototype, "storeSlug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [checkout_item_response_dto_1.CheckoutItemResponseDto], description: 'Daftar produk yang dibeli dari toko ini' }),
    __metadata("design:type", Array)
], CheckoutStoreResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100000, description: 'Subtotal harga barang dari toko ini' }),
    __metadata("design:type", Number)
], CheckoutStoreResponseDto.prototype, "storeSubtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000, description: 'Total berat barang dari toko ini dalam gram' }),
    __metadata("design:type", Number)
], CheckoutStoreResponseDto.prototype, "storeWeight", void 0);


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutItemResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class CheckoutItemResponseDto {
    id;
    productId;
    productName;
    slug;
    image;
    price;
    weight;
    quantity;
    subtotal;
    sellerId;
    sellerName;
}
exports.CheckoutItemResponseDto = CheckoutItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cart-item-id-123', description: 'ID item (dari CartItem ID atau temp ID jika Buy Now)' }),
    __metadata("design:type", String)
], CheckoutItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', description: 'ID Produk' }),
    __metadata("design:type", String)
], CheckoutItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pupuk Organik NPK Super 1kg', description: 'Nama Produk' }),
    __metadata("design:type", String)
], CheckoutItemResponseDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pupuk-organik-npk-super-1kg', description: 'Slug Produk' }),
    __metadata("design:type", String)
], CheckoutItemResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/image.jpg', nullable: true, description: 'Gambar utama produk' }),
    __metadata("design:type", Object)
], CheckoutItemResponseDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Harga satuan produk' }),
    __metadata("design:type", Number)
], CheckoutItemResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, description: 'Berat satuan produk dalam gram' }),
    __metadata("design:type", Number)
], CheckoutItemResponseDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Jumlah kuantitas dibeli' }),
    __metadata("design:type", Number)
], CheckoutItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100000, description: 'Subtotal item (price * quantity)' }),
    __metadata("design:type", Number)
], CheckoutItemResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'seller-id-123', description: 'ID Penjual / Toko' }),
    __metadata("design:type", String)
], CheckoutItemResponseDto.prototype, "sellerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Toko Tani Subur', description: 'Nama Toko Penjual' }),
    __metadata("design:type", String)
], CheckoutItemResponseDto.prototype, "sellerName", void 0);


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutShippingResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class CheckoutShippingResponseDto {
    courier;
    service;
    etd;
    cost;
}
exports.CheckoutShippingResponseDto = CheckoutShippingResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, nullable: true, description: 'Kode kurir pengiriman (misal: JNE, POS, TIKI)' }),
    __metadata("design:type", Object)
], CheckoutShippingResponseDto.prototype, "courier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, nullable: true, description: 'Nama layanan pengiriman (misal: REG, YES)' }),
    __metadata("design:type", Object)
], CheckoutShippingResponseDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, nullable: true, description: 'Estimasi hari pengiriman (misal: 2-3 hari)' }),
    __metadata("design:type", Object)
], CheckoutShippingResponseDto.prototype, "etd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Biaya ongkos kirim' }),
    __metadata("design:type", Number)
], CheckoutShippingResponseDto.prototype, "cost", void 0);


/***/ }),
/* 119 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutPricingResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class CheckoutPricingResponseDto {
    subtotal;
    shippingCost;
    serviceFee;
    discount;
    insuranceFee;
    applicationFee;
    total;
}
exports.CheckoutPricingResponseDto = CheckoutPricingResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100000, description: 'Subtotal harga barang' }),
    __metadata("design:type", Number)
], CheckoutPricingResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Total ongkos kirim' }),
    __metadata("design:type", Number)
], CheckoutPricingResponseDto.prototype, "shippingCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Biaya layanan platform' }),
    __metadata("design:type", Number)
], CheckoutPricingResponseDto.prototype, "serviceFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Potongan diskon/voucher' }),
    __metadata("design:type", Number)
], CheckoutPricingResponseDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Biaya asuransi pengiriman' }),
    __metadata("design:type", Number)
], CheckoutPricingResponseDto.prototype, "insuranceFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Biaya aplikasi' }),
    __metadata("design:type", Number)
], CheckoutPricingResponseDto.prototype, "applicationFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100000, description: 'Total akhir pembayaran' }),
    __metadata("design:type", Number)
], CheckoutPricingResponseDto.prototype, "total", void 0);


/***/ }),
/* 120 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderModule = void 0;
const common_1 = __webpack_require__(3);
const order_controller_1 = __webpack_require__(121);
const order_service_1 = __webpack_require__(122);
const prisma_module_1 = __webpack_require__(33);
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [order_controller_1.OrderController],
        providers: [order_service_1.OrderService],
        exports: [order_service_1.OrderService],
    })
], OrderModule);


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const order_service_1 = __webpack_require__(122);
const create_order_dto_1 = __webpack_require__(123);
const get_orders_query_dto_1 = __webpack_require__(124);
const create_order_response_dto_1 = __webpack_require__(125);
const order_response_dto_1 = __webpack_require__(126);
const order_paginated_response_dto_1 = __webpack_require__(128);
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async createOrder(session, dto) {
        return this.orderService.createOrder(session.user.id, dto);
    }
    async getUserOrders(session, queryDto) {
        return this.orderService.getUserOrders(session.user.id, queryDto);
    }
    async getOrderDetail(session, id) {
        return this.orderService.getOrderDetail(session.user.id, id);
    }
    async cancelOrder(session, id) {
        return this.orderService.cancelOrder(session.user.id, id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Buat Pesanan Baru (Unified Endpoint)',
        description: 'Mengubah kalkulasi checkout (BUY_NOW atau CART) menjadi transaksi Order permanen di database dengan snapshot lengkap dan pengurangan stok secara atomic.',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Order berhasil dibuat',
        type: create_order_response_dto_1.CreateOrderResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Validasi gagal, stok produk tidak mencukupi, atau produk tidak aktif',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Sesi tidak terautentikasi' }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Alamat atau item keranjang tidak ditemukan',
    }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_order_dto_1.CreateOrderDto !== "undefined" && create_order_dto_1.CreateOrderDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar Pesanan User (Buyer)',
        description: 'Mengambil daftar pesanan milik pengguna yang sedang login dengan dukungan pagination dan filter status pesanan (terurut createdAt DESC).',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Daftar pesanan berhasil diambil',
        type: order_paginated_response_dto_1.OrderPaginatedResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Sesi tidak terautentikasi' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof get_orders_query_dto_1.GetOrdersQueryDto !== "undefined" && get_orders_query_dto_1.GetOrdersQueryDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], OrderController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detail Pesanan',
        description: 'Mengambil rincian detail pesanan beserta snapshot produk, snapshot alamat, dan pricing snapshot. Hanya dapat diakses oleh buyer atau seller pesanan tersebut.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Detail pesanan berhasil diambil',
        type: order_response_dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Sesi tidak terautentikasi' }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Tidak memiliki akses ke pesanan ini',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Pesanan tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], OrderController.prototype, "getOrderDetail", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Batalkan Pesanan (Buyer)',
        description: 'Membatalkan pesanan yang berstatus PENDING_PAYMENT dan mengembalikan stok produk secara otomatis.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Pesanan berhasil dibatalkan dan stok produk dikembalikan',
        type: order_response_dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Pesanan sudah dibayar atau tidak dapat dibatalkan',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Sesi tidak terautentikasi' }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Tidak memiliki akses ke pesanan ini',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Pesanan tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], OrderController.prototype, "cancelOrder", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [typeof (_a = typeof order_service_1.OrderService !== "undefined" && order_service_1.OrderService) === "function" ? _a : Object])
], OrderController);


/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const create_order_dto_1 = __webpack_require__(123);
const client_1 = __webpack_require__(9);
let OrderService = class OrderService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateOrderNumber(tx) {
        const today = new Date();
        const dateStr = today.getFullYear().toString() +
            String(today.getMonth() + 1).padStart(2, '0') +
            String(today.getDate()).padStart(2, '0');
        let attempts = 0;
        while (attempts < 10) {
            attempts++;
            const randomHex = Math.random()
                .toString(16)
                .substring(2, 8)
                .toUpperCase();
            const candidate = `LT-${dateStr}-${randomHex}`;
            const existing = await tx.order.findUnique({
                where: { orderNumber: candidate },
                select: { id: true },
            });
            if (!existing) {
                return candidate;
            }
        }
        throw new common_1.InternalServerErrorException('Gagal membuat nomor order unik. Silakan coba lagi.');
    }
    async checkAndExpirePendingOrders(userId) {
        const now = new Date();
        const expiredOrders = await this.prisma.order.findMany({
            where: {
                ...(userId ? { buyerId: userId } : {}),
                orderStatus: client_1.OrderStatus.PENDING_PAYMENT,
                expiredAt: {
                    lte: now,
                },
            },
            include: {
                items: true,
            },
        });
        for (const order of expiredOrders) {
            await this.prisma.$transaction(async (tx) => {
                const currentOrder = await tx.order.findUnique({
                    where: { id: order.id },
                    select: { orderStatus: true },
                });
                if (currentOrder?.orderStatus !== client_1.OrderStatus.PENDING_PAYMENT) {
                    return;
                }
                await tx.order.update({
                    where: { id: order.id },
                    data: { orderStatus: client_1.OrderStatus.EXPIRED },
                });
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { increment: item.quantity },
                        },
                    });
                }
            });
        }
    }
    mapToOrderResponseDto(order) {
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            buyerId: order.buyerId,
            seller: {
                sellerId: order.sellerId,
                storeName: order.sellerStoreName,
                storeSlug: order.sellerStoreSlug,
                logoUrl: order.sellerLogo,
            },
            shippingAddress: {
                recipientName: order.shippingRecipientName,
                recipientPhone: order.shippingRecipientPhone,
                provinceId: order.shippingProvinceId,
                provinceName: order.shippingProvinceName,
                cityId: order.shippingCityId,
                cityName: order.shippingCityName,
                districtId: order.shippingDistrictId,
                districtName: order.shippingDistrictName,
                subDistrictId: order.shippingSubDistrictId,
                subDistrictName: order.shippingSubDistrictName,
                postalCode: order.shippingPostalCode,
                street: order.shippingStreet,
                notes: order.shippingNotes,
            },
            pricing: {
                subtotal: Number(order.subtotal),
                shippingCost: Number(order.shippingCost),
                serviceFee: Number(order.serviceFee),
                discount: Number(order.discount),
                insuranceFee: Number(order.insuranceFee),
                applicationFee: Number(order.applicationFee),
                grandTotal: Number(order.grandTotal),
                totalWeight: order.totalWeight,
            },
            orderStatus: order.orderStatus,
            expiredAt: order.expiredAt ? order.expiredAt.toISOString() : null,
            items: (order.items || []).map((item) => ({
                id: item.id,
                productId: item.productId,
                productName: item.productName,
                productSlug: item.productSlug,
                thumbnailUrl: item.thumbnailUrl,
                productPrice: Number(item.productPrice),
                weight: item.weight,
                quantity: item.quantity,
                subtotal: Number(item.subtotal),
                categoryId: item.categoryId,
                categoryName: item.categoryName,
                unit: item.unit,
            })),
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
        };
    }
    async createOrder(userId, dto) {
        const address = await this.prisma.address.findFirst({
            where: {
                id: dto.addressId,
                userId,
                deletedAt: null,
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Alamat pengiriman tidak ditemukan atau tidak aktif');
        }
        if (dto.checkoutType === create_order_dto_1.CheckoutType.BUY_NOW) {
            return this.handleBuyNowOrder(userId, dto, address);
        }
        else {
            return this.handleCartOrder(userId, dto, address);
        }
    }
    async handleBuyNowOrder(userId, dto, address) {
        if (!dto.productId) {
            throw new common_1.BadRequestException('productId wajib diisi untuk checkout BUY_NOW');
        }
        const quantity = dto.quantity || 1;
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
            include: {
                seller: {
                    include: {
                        sellerProfile: true,
                    },
                },
                images: {
                    take: 1,
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!product || product.status !== client_1.ProductStatus.ACTIVE) {
            throw new common_1.BadRequestException('Produk tidak ditemukan atau tidak aktif');
        }
        if (product.stock < quantity) {
            throw new common_1.BadRequestException(`Stok produk "${product.title}" tidak mencukupi (tersedia: ${product.stock})`);
        }
        const priceNumber = Number(product.price);
        const subtotalNumber = priceNumber * quantity;
        const totalWeight = (product.weight || 0) * quantity;
        const thumbnailUrl = product.images?.[0]?.imageUrl || null;
        const storeName = product.seller.sellerProfile?.storeName ||
            product.seller.name ||
            'Toko Tani';
        const storeSlug = product.seller.sellerProfile?.storeSlug || product.seller.id;
        const sellerLogo = product.seller.sellerProfile?.logoUrl || product.seller.image || null;
        const serviceFee = 1000;
        const grandTotal = subtotalNumber + serviceFee;
        const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const createdOrder = await this.prisma.$transaction(async (tx) => {
            const currentProd = await tx.product.findUnique({
                where: { id: product.id },
                select: { stock: true, status: true },
            });
            if (!currentProd || currentProd.status !== client_1.ProductStatus.ACTIVE) {
                throw new common_1.BadRequestException('Produk tidak lagi aktif');
            }
            if (currentProd.stock < quantity) {
                throw new common_1.BadRequestException(`Stok produk "${product.title}" telah habis atau tidak mencukupi`);
            }
            const orderNumber = await this.generateOrderNumber(tx);
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    buyerId: userId,
                    sellerId: product.seller.id,
                    sellerStoreName: storeName,
                    sellerStoreSlug: storeSlug,
                    sellerLogo,
                    shippingRecipientName: address.recipientName,
                    shippingRecipientPhone: address.recipientPhone,
                    shippingProvinceId: address.provinceId,
                    shippingProvinceName: address.provinceName,
                    shippingCityId: address.cityId,
                    shippingCityName: address.cityName,
                    shippingDistrictId: address.districtId,
                    shippingDistrictName: address.districtName,
                    shippingSubDistrictId: address.subDistrictId,
                    shippingSubDistrictName: address.subDistrictName,
                    shippingPostalCode: address.postalCode,
                    shippingStreet: address.street,
                    shippingNotes: address.notes,
                    subtotal: new client_1.Prisma.Decimal(subtotalNumber),
                    shippingCost: new client_1.Prisma.Decimal(0),
                    serviceFee: new client_1.Prisma.Decimal(serviceFee),
                    discount: new client_1.Prisma.Decimal(0),
                    insuranceFee: new client_1.Prisma.Decimal(0),
                    applicationFee: new client_1.Prisma.Decimal(0),
                    grandTotal: new client_1.Prisma.Decimal(grandTotal),
                    totalWeight,
                    orderStatus: client_1.OrderStatus.PENDING_PAYMENT,
                    expiredAt,
                    items: {
                        create: [
                            {
                                productId: product.id,
                                productName: product.title,
                                productSlug: product.slug,
                                thumbnailUrl,
                                productPrice: new client_1.Prisma.Decimal(priceNumber),
                                weight: product.weight || 0,
                                quantity,
                                subtotal: new client_1.Prisma.Decimal(subtotalNumber),
                                categoryId: null,
                                categoryName: product.category || null,
                                unit: 'unit',
                            },
                        ],
                    },
                },
                include: {
                    items: true,
                },
            });
            await tx.product.update({
                where: { id: product.id },
                data: {
                    stock: { decrement: quantity },
                },
            });
            return newOrder;
        });
        return {
            orders: [this.mapToOrderResponseDto(createdOrder)],
            totalOrders: 1,
        };
    }
    async handleCartOrder(userId, dto, address) {
        if (!dto.cartItemIds || dto.cartItemIds.length === 0) {
            throw new common_1.BadRequestException('cartItemIds wajib diisi dan minimal 1 item untuk checkout CART');
        }
        const cartItems = await this.prisma.cartItem.findMany({
            where: {
                id: { in: dto.cartItemIds },
                cart: { userId },
            },
            include: {
                product: {
                    include: {
                        seller: {
                            include: {
                                sellerProfile: true,
                            },
                        },
                        images: {
                            take: 1,
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
        if (cartItems.length === 0) {
            throw new common_1.BadRequestException('Tidak ada item keranjang yang ditemukan untuk diproses');
        }
        for (const item of cartItems) {
            if (!item.product || item.product.status !== client_1.ProductStatus.ACTIVE) {
                throw new common_1.BadRequestException(`Produk "${item.product?.title || 'Item'}" sudah tidak aktif`);
            }
            if (item.product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Stok produk "${item.product.title}" tidak mencukupi (tersedia: ${item.product.stock})`);
            }
        }
        const sellerMap = new Map();
        for (const item of cartItems) {
            const sellerId = item.product.seller.id;
            if (!sellerMap.has(sellerId)) {
                sellerMap.set(sellerId, []);
            }
            sellerMap.get(sellerId).push(item);
        }
        const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const createdOrders = await this.prisma.$transaction(async (tx) => {
            const ordersResult = [];
            for (const [sellerId, sellerItems] of sellerMap.entries()) {
                const firstSeller = sellerItems[0].product.seller;
                const storeName = firstSeller.sellerProfile?.storeName ||
                    firstSeller.name ||
                    'Toko Tani';
                const storeSlug = firstSeller.sellerProfile?.storeSlug || firstSeller.id;
                const sellerLogo = firstSeller.sellerProfile?.logoUrl || firstSeller.image || null;
                let storeSubtotal = 0;
                let storeWeight = 0;
                const itemCreates = [];
                for (const item of sellerItems) {
                    const currentProd = await tx.product.findUnique({
                        where: { id: item.productId },
                        select: { stock: true, status: true },
                    });
                    if (!currentProd || currentProd.status !== client_1.ProductStatus.ACTIVE) {
                        throw new common_1.BadRequestException(`Produk "${item.product.title}" tidak lagi aktif`);
                    }
                    if (currentProd.stock < item.quantity) {
                        throw new common_1.BadRequestException(`Stok produk "${item.product.title}" telah habis atau tidak mencukupi`);
                    }
                    const priceNumber = Number(item.product.price);
                    const itemSubtotal = priceNumber * item.quantity;
                    const itemWeight = (item.product.weight || 0) * item.quantity;
                    storeSubtotal += itemSubtotal;
                    storeWeight += itemWeight;
                    itemCreates.push({
                        productId: item.product.id,
                        productName: item.product.title,
                        productSlug: item.product.slug,
                        thumbnailUrl: item.product.images?.[0]?.imageUrl || null,
                        productPrice: new client_1.Prisma.Decimal(priceNumber),
                        weight: item.product.weight || 0,
                        quantity: item.quantity,
                        subtotal: new client_1.Prisma.Decimal(itemSubtotal),
                        categoryId: null,
                        categoryName: item.product.category || null,
                        unit: 'unit',
                    });
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
                const serviceFee = 1000;
                const grandTotal = storeSubtotal + serviceFee;
                const orderNumber = await this.generateOrderNumber(tx);
                const newOrder = await tx.order.create({
                    data: {
                        orderNumber,
                        buyerId: userId,
                        sellerId,
                        sellerStoreName: storeName,
                        sellerStoreSlug: storeSlug,
                        sellerLogo,
                        shippingRecipientName: address.recipientName,
                        shippingRecipientPhone: address.recipientPhone,
                        shippingProvinceId: address.provinceId,
                        shippingProvinceName: address.provinceName,
                        shippingCityId: address.cityId,
                        shippingCityName: address.cityName,
                        shippingDistrictId: address.districtId,
                        shippingDistrictName: address.districtName,
                        shippingSubDistrictId: address.subDistrictId,
                        shippingSubDistrictName: address.subDistrictName,
                        shippingPostalCode: address.postalCode,
                        shippingStreet: address.street,
                        shippingNotes: address.notes,
                        subtotal: new client_1.Prisma.Decimal(storeSubtotal),
                        shippingCost: new client_1.Prisma.Decimal(0),
                        serviceFee: new client_1.Prisma.Decimal(serviceFee),
                        discount: new client_1.Prisma.Decimal(0),
                        insuranceFee: new client_1.Prisma.Decimal(0),
                        applicationFee: new client_1.Prisma.Decimal(0),
                        grandTotal: new client_1.Prisma.Decimal(grandTotal),
                        totalWeight: storeWeight,
                        orderStatus: client_1.OrderStatus.PENDING_PAYMENT,
                        expiredAt,
                        items: {
                            create: itemCreates,
                        },
                    },
                    include: {
                        items: true,
                    },
                });
                ordersResult.push(newOrder);
            }
            await tx.cartItem.deleteMany({
                where: {
                    id: { in: dto.cartItemIds },
                },
            });
            return ordersResult;
        });
        return {
            orders: createdOrders.map((o) => this.mapToOrderResponseDto(o)),
            totalOrders: createdOrders.length,
        };
    }
    async getUserOrders(userId, queryDto) {
        await this.checkAndExpirePendingOrders(userId);
        const page = queryDto.page || 1;
        const limit = queryDto.limit || 10;
        const skip = (page - 1) * limit;
        const where = {
            buyerId: userId,
            ...(queryDto.status ? { orderStatus: queryDto.status } : {}),
        };
        const [total, orders] = await Promise.all([
            this.prisma.order.count({ where }),
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: true,
                },
            }),
        ]);
        const totalPages = Math.ceil(total / limit) || 1;
        return {
            data: orders.map((o) => this.mapToOrderResponseDto(o)),
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
    async getOrderDetail(userId, orderId) {
        await this.checkAndExpirePendingOrders(userId);
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (order.buyerId !== userId && order.sellerId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke pesanan ini');
        }
        return this.mapToOrderResponseDto(order);
    }
    async cancelOrder(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        if (order.buyerId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak berhak membatalkan pesanan ini');
        }
        if (order.orderStatus !== client_1.OrderStatus.PENDING_PAYMENT) {
            throw new common_1.BadRequestException('Hanya pesanan yang belum dibayar yang dapat dibatalkan');
        }
        const updatedOrder = await this.prisma.$transaction(async (tx) => {
            const cancelled = await tx.order.update({
                where: { id: orderId },
                data: { orderStatus: client_1.OrderStatus.CANCELLED },
                include: { items: true },
            });
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }
            return cancelled;
        });
        return this.mapToOrderResponseDto(updatedOrder);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], OrderService);


/***/ }),
/* 123 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateOrderDto = exports.CheckoutType = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
var CheckoutType;
(function (CheckoutType) {
    CheckoutType["BUY_NOW"] = "BUY_NOW";
    CheckoutType["CART"] = "CART";
})(CheckoutType || (exports.CheckoutType = CheckoutType = {}));
class CreateOrderDto {
    checkoutType;
    addressId;
    productId;
    quantity;
    cartItemIds;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Jenis checkout yang dilakukan',
        enum: CheckoutType,
        example: CheckoutType.BUY_NOW,
    }),
    (0, class_validator_1.IsEnum)(CheckoutType, {
        message: 'checkoutType harus berupa BUY_NOW atau CART',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'checkoutType tidak boleh kosong' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "checkoutType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID Alamat Pengiriman',
        example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'addressId harus berupa UUID v4 valid' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'addressId tidak boleh kosong' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "addressId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID Produk (Wajib jika checkoutType = BUY_NOW)',
        example: 'p1234567-89ab-cdef-0123-456789abcdef',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'productId harus berupa UUID v4 valid' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Jumlah kuantitas (Wajib jika checkoutType = BUY_NOW)',
        example: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'quantity harus berupa angka bulat' }),
    (0, class_validator_1.Min)(1, { message: 'quantity minimal 1' }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Daftar ID CartItem yang akan dibeli (Wajib jika checkoutType = CART)',
        example: ['item-uuid-1', 'item-uuid-2'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'cartItemIds harus berupa array string' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Pilih minimal 1 item keranjang' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Setiap cartItemId harus berupa string' }),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "cartItemIds", void 0);


/***/ }),
/* 124 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetOrdersQueryDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
const client_1 = __webpack_require__(9);
class GetOrdersQueryDto {
    status;
    page = 1;
    limit = 10;
}
exports.GetOrdersQueryDto = GetOrdersQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter berdasarkan status order',
        enum: client_1.OrderStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus, { message: 'status tidak valid' }),
    __metadata("design:type", typeof (_a = typeof client_1.OrderStatus !== "undefined" && client_1.OrderStatus) === "function" ? _a : Object)
], GetOrdersQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Halaman ke berapa',
        default: 1,
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'page harus berupa angka' }),
    (0, class_validator_1.Min)(1, { message: 'page minimal 1' }),
    __metadata("design:type", Number)
], GetOrdersQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Jumlah item per halaman',
        default: 10,
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'limit harus berupa angka' }),
    (0, class_validator_1.Min)(1, { message: 'limit minimal 1' }),
    __metadata("design:type", Number)
], GetOrdersQueryDto.prototype, "limit", void 0);


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateOrderResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
const order_response_dto_1 = __webpack_require__(126);
class CreateOrderResponseDto {
    orders;
    totalOrders;
}
exports.CreateOrderResponseDto = CreateOrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [order_response_dto_1.OrderResponseDto] }),
    __metadata("design:type", Array)
], CreateOrderResponseDto.prototype, "orders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CreateOrderResponseDto.prototype, "totalOrders", void 0);


/***/ }),
/* 126 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderResponseDto = exports.OrderPricingSnapshotDto = exports.OrderAddressSnapshotDto = exports.OrderSellerSnapshotDto = void 0;
const swagger_1 = __webpack_require__(13);
const client_1 = __webpack_require__(9);
const order_item_response_dto_1 = __webpack_require__(127);
class OrderSellerSnapshotDto {
    sellerId;
    storeName;
    storeSlug;
    logoUrl;
}
exports.OrderSellerSnapshotDto = OrderSellerSnapshotDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderSellerSnapshotDto.prototype, "sellerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderSellerSnapshotDto.prototype, "storeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderSellerSnapshotDto.prototype, "storeSlug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], OrderSellerSnapshotDto.prototype, "logoUrl", void 0);
class OrderAddressSnapshotDto {
    recipientName;
    recipientPhone;
    provinceId;
    provinceName;
    cityId;
    cityName;
    districtId;
    districtName;
    subDistrictId;
    subDistrictName;
    postalCode;
    street;
    notes;
}
exports.OrderAddressSnapshotDto = OrderAddressSnapshotDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "recipientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "provinceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "provinceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "cityName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "districtName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "subDistrictId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "subDistrictName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderAddressSnapshotDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], OrderAddressSnapshotDto.prototype, "notes", void 0);
class OrderPricingSnapshotDto {
    subtotal;
    shippingCost;
    serviceFee;
    discount;
    insuranceFee;
    applicationFee;
    grandTotal;
    totalWeight;
}
exports.OrderPricingSnapshotDto = OrderPricingSnapshotDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPricingSnapshotDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPricingSnapshotDto.prototype, "shippingCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPricingSnapshotDto.prototype, "serviceFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPricingSnapshotDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPricingSnapshotDto.prototype, "insuranceFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPricingSnapshotDto.prototype, "applicationFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPricingSnapshotDto.prototype, "grandTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPricingSnapshotDto.prototype, "totalWeight", void 0);
class OrderResponseDto {
    id;
    orderNumber;
    buyerId;
    seller;
    shippingAddress;
    pricing;
    orderStatus;
    expiredAt;
    items;
    createdAt;
    updatedAt;
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "orderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "buyerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: OrderSellerSnapshotDto }),
    __metadata("design:type", OrderSellerSnapshotDto)
], OrderResponseDto.prototype, "seller", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: OrderAddressSnapshotDto }),
    __metadata("design:type", OrderAddressSnapshotDto)
], OrderResponseDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: OrderPricingSnapshotDto }),
    __metadata("design:type", OrderPricingSnapshotDto)
], OrderResponseDto.prototype, "pricing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OrderStatus }),
    __metadata("design:type", typeof (_a = typeof client_1.OrderStatus !== "undefined" && client_1.OrderStatus) === "function" ? _a : Object)
], OrderResponseDto.prototype, "orderStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], OrderResponseDto.prototype, "expiredAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [order_item_response_dto_1.OrderItemResponseDto] }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "updatedAt", void 0);


/***/ }),
/* 127 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderItemResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
class OrderItemResponseDto {
    id;
    productId;
    productName;
    productSlug;
    thumbnailUrl;
    productPrice;
    weight;
    quantity;
    subtotal;
    categoryId;
    categoryName;
    unit;
}
exports.OrderItemResponseDto = OrderItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productSlug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "productPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], OrderItemResponseDto.prototype, "unit", void 0);


/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderPaginatedResponseDto = exports.PaginationMetaDto = void 0;
const swagger_1 = __webpack_require__(13);
const order_response_dto_1 = __webpack_require__(126);
class PaginationMetaDto {
    page;
    limit;
    total;
    totalPages;
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalPages", void 0);
class OrderPaginatedResponseDto {
    data;
    meta;
}
exports.OrderPaginatedResponseDto = OrderPaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [order_response_dto_1.OrderResponseDto] }),
    __metadata("design:type", Array)
], OrderPaginatedResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], OrderPaginatedResponseDto.prototype, "meta", void 0);


/***/ }),
/* 129 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentModule = void 0;
const common_1 = __webpack_require__(3);
const payment_controller_1 = __webpack_require__(130);
const payment_service_1 = __webpack_require__(131);
const prisma_module_1 = __webpack_require__(33);
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [payment_controller_1.PaymentController, payment_controller_1.PaymentWebhookController],
        providers: [payment_service_1.PaymentService],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);


/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentWebhookController = exports.PaymentController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const nestjs_better_auth_1 = __webpack_require__(18);
const payment_service_1 = __webpack_require__(131);
const create_payment_request_dto_1 = __webpack_require__(137);
const payment_response_dto_1 = __webpack_require__(138);
const payment_request_response_dto_1 = __webpack_require__(139);
const xendit_webhook_guard_1 = __webpack_require__(140);
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createPaymentRequest(session, id, dto) {
        return this.paymentService.createPaymentRequest(id, session.user.id, dto);
    }
    async getPaymentById(session, id) {
        return this.paymentService.findById(id, session.user.id);
    }
    async getPaymentByOrderId(session, orderId) {
        return this.paymentService.findByOrderId(orderId, session.user.id);
    }
    async getPaymentByReferenceId(session, referenceId) {
        return this.paymentService.findByReferenceId(referenceId, session.user.id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(':id/create-request'),
    (0, swagger_1.ApiOperation)({
        summary: 'Buat Payment Request ke Xendit (v3 API)',
        description: 'Menghubungi Xendit Payments API v3 untuk membuat sesi pembayaran (QRIS, VA, E-Wallet, dll.). Endpoint bersifat idempotent — jika request sudah ada dan berstatus PENDING, akan mengembalikan cached actions agar frontend dapat melanjutkan pembayaran tanpa request baru ke Xendit.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Payment request berhasil dibuat atau diambil dari cache',
        type: payment_request_response_dto_1.PaymentRequestResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Validasi channelCode gagal atau status Payment bukan PENDING',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Sesi tidak terautentikasi' }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Bukan buyer pemilik pesanan',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Payment tidak ditemukan' }),
    (0, swagger_1.ApiBadGatewayResponse)({
        description: 'Gagal menghubungi layanan Xendit',
    }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_b = typeof create_payment_request_dto_1.CreatePaymentRequestDto !== "undefined" && create_payment_request_dto_1.CreatePaymentRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], PaymentController.prototype, "createPaymentRequest", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detail Payment berdasarkan ID',
        description: 'Mengambil detail payment berdasarkan Payment ID. Hanya bisa diakses oleh buyer atau seller terkait order.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Detail payment berhasil diambil',
        type: payment_response_dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Sesi tidak terautentikasi' }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Tidak memiliki akses ke payment ini',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Payment tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], PaymentController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Get)('order/:orderId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detail Payment berdasarkan Order ID',
        description: 'Mengambil detail payment berdasarkan Order ID. Hanya bisa diakses oleh buyer atau seller terkait order.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Detail payment berhasil diambil',
        type: payment_response_dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Sesi tidak terautentikasi' }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Tidak memiliki akses ke payment ini',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Payment tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], PaymentController.prototype, "getPaymentByOrderId", null);
__decorate([
    (0, common_1.Get)('reference/:referenceId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detail Payment berdasarkan Reference ID',
        description: 'Mengambil detail payment berdasarkan Reference ID internal Loop Tani (format: PAY-YYYYMMDD-XXXXXX). Hanya bisa diakses oleh buyer atau seller terkait order.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Detail payment berhasil diambil',
        type: payment_response_dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Sesi tidak terautentikasi' }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Tidak memiliki akses ke payment ini',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Payment tidak ditemukan' }),
    __param(0, (0, nestjs_better_auth_1.Session)()),
    __param(1, (0, common_1.Param)('referenceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], PaymentController.prototype, "getPaymentByReferenceId", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, swagger_1.ApiCookieAuth)('better-auth.session_token'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [typeof (_a = typeof payment_service_1.PaymentService !== "undefined" && payment_service_1.PaymentService) === "function" ? _a : Object])
], PaymentController);
let PaymentWebhookController = class PaymentWebhookController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async handleWebhook(payload) {
        return this.paymentService.handleXenditWebhook(payload);
    }
};
exports.PaymentWebhookController = PaymentWebhookController;
__decorate([
    (0, common_1.Post)('webhook/xendit'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, common_1.UseGuards)(xendit_webhook_guard_1.XenditWebhookGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Xendit Webhook Callback Handler (Phase 3A)',
        description: 'Endpoint untuk menerima callback webhook dari Xendit. Diverifikasi menggunakan XenditWebhookGuard (header x-callback-token). Menyinkronkan status Payment (SUCCEEDED, FAILED, EXPIRED) secara idempotent.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof Record !== "undefined" && Record) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], PaymentWebhookController.prototype, "handleWebhook", null);
exports.PaymentWebhookController = PaymentWebhookController = __decorate([
    (0, swagger_1.ApiTags)('Payment Webhook'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [typeof (_g = typeof payment_service_1.PaymentService !== "undefined" && payment_service_1.PaymentService) === "function" ? _g : Object])
], PaymentWebhookController);


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(34);
const prisma_service_1 = __webpack_require__(8);
const xendit_service_1 = __webpack_require__(132);
const payment_constant_1 = __webpack_require__(136);
const client_1 = __webpack_require__(9);
let PaymentService = PaymentService_1 = class PaymentService {
    prisma;
    xenditService;
    configService;
    logger = new common_1.Logger(PaymentService_1.name);
    constructor(prisma, xenditService, configService) {
        this.prisma = prisma;
        this.xenditService = xenditService;
        this.configService = configService;
    }
    async createPayment(dto) {
        const order = await this.prisma.order.findUnique({
            where: { id: dto.orderId },
            include: { payment: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order dengan ID ${dto.orderId} tidak ditemukan`);
        }
        if (order.orderStatus !== client_1.OrderStatus.PENDING_PAYMENT) {
            throw new common_1.BadRequestException(`Order tidak dapat dibayar. Status saat ini: ${order.orderStatus}`);
        }
        if (order.payment) {
            throw new common_1.ConflictException(`Order ${dto.orderId} sudah memiliki Payment (ID: ${order.payment.id})`);
        }
        const referenceId = await this.generateReferenceId();
        const payment = await this.prisma.payment.create({
            data: {
                orderId: dto.orderId,
                referenceId,
                amount: new client_1.Prisma.Decimal(dto.amount),
                expiredAt: dto.expiredAt ? new Date(dto.expiredAt) : undefined,
            },
            include: { order: true },
        });
        this.logger.log(`Payment created: ${payment.id} (ref: ${referenceId}) for Order: ${dto.orderId}`);
        return this.toResponseDto(payment);
    }
    async createPaymentRequest(paymentId, userId, dto) {
        let payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                order: {
                    include: { buyer: true },
                },
            },
        });
        if (!payment) {
            payment = await this.prisma.payment.findUnique({
                where: { orderId: paymentId },
                include: {
                    order: {
                        include: { buyer: true },
                    },
                },
            });
        }
        if (!payment) {
            const order = await this.prisma.order.findUnique({
                where: { id: paymentId },
                include: { buyer: true, payment: true },
            });
            if (order && order.orderStatus === client_1.OrderStatus.PENDING_PAYMENT) {
                if (!order.payment) {
                    const referenceId = await this.generateReferenceId();
                    const newPayment = await this.prisma.payment.create({
                        data: {
                            orderId: order.id,
                            referenceId,
                            amount: order.grandTotal,
                            expiredAt: order.expiredAt ?? undefined,
                        },
                    });
                    payment = { ...newPayment, order };
                }
                else {
                    payment = { ...order.payment, order };
                }
            }
        }
        if (!payment) {
            throw new common_1.NotFoundException(`Payment atau Order dengan ID ${paymentId} tidak ditemukan`);
        }
        if (payment.status !== client_1.PaymentStatus.PENDING) {
            throw new common_1.BadRequestException(`Payment sudah tidak dapat diproses. Status saat ini: ${payment.status}`);
        }
        if (payment.order.buyerId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses untuk memproses pembayaran ini');
        }
        if (payment.paymentRequestId) {
            if (!payment.rawResponse) {
                throw new common_1.InternalServerErrorException('Payment request sudah pernah dibuat tetapi cache data response tidak ditemukan');
            }
            this.logger.log(`[Idempotent Resume] Returning cached PaymentRequest for paymentId: ${paymentId}, requestId: ${payment.paymentRequestId}`);
            const cached = payment.rawResponse;
            return {
                paymentId: payment.id,
                paymentRequestId: payment.paymentRequestId,
                referenceId: payment.referenceId,
                paymentStatus: payment.status,
                providerStatus: cached.status || 'REQUIRES_ACTION',
                amount: payment.amount.toNumber(),
                channelCode: dto.channelCode,
                actions: cached.actions,
                expiredAt: payment.expiredAt?.toISOString() ?? null,
            };
        }
        const country = this.configService.get('PAYMENT_COUNTRY', 'ID');
        const currency = this.configService.get('PAYMENT_CURRENCY', 'IDR');
        const nodeEnv = this.configService.get('NODE_ENV', 'development');
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const buyer = payment.order.buyer;
        const payload = {
            reference_id: payment.referenceId,
            type: 'PAY',
            currency,
            amount: payment.amount.toNumber(),
            country,
            channel_code: dto.channelCode,
            channel_properties: {
                success_return_url: `${frontendUrl}/orders/${payment.order.id}?status=success`,
                failure_return_url: `${frontendUrl}/orders/${payment.order.id}?status=failed`,
                ...dto.channelProperties,
            },
            customer: {
                reference_id: buyer.id,
                given_names: buyer.name,
                email: buyer.email,
                mobile_number: buyer.phone ?? undefined,
            },
            description: `Pembayaran Order #${payment.order.orderNumber}`,
            metadata: {
                order_id: payment.order.id,
                order_number: payment.order.orderNumber,
                payment_id: payment.id,
                buyer_id: buyer.id,
                seller_id: payment.order.sellerId,
                environment: nodeEnv,
            },
        };
        const startTime = Date.now();
        let xenditResponse;
        try {
            xenditResponse = await this.xenditService.createPaymentRequest(payload);
        }
        catch (err) {
            const elapsedMs = Date.now() - startTime;
            this.logger.error(`Create Payment Request Failed (elapsed: ${elapsedMs}ms) for paymentId=${paymentId}: ${err.message}`);
            throw new common_1.BadGatewayException(`Gagal menghubungi layanan pembayaran (Xendit): ${err.message}`);
        }
        const elapsedMs = Date.now() - startTime;
        const providerCode = payment_constant_1.PROVIDER_CODE_MAP[dto.channelCode] ?? dto.channelCode;
        const paymentMethod = payment_constant_1.PAYMENT_METHOD_MAP[dto.channelCode] ?? 'OTHER';
        const expiredAt = xenditResponse.expires_at
            ? new Date(xenditResponse.expires_at)
            : null;
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                paymentRequestId: xenditResponse.id,
                providerCode,
                paymentMethod,
                expiredAt,
                rawResponse: xenditResponse,
            },
        });
        this.logger.log(`Create Payment Request Success: paymentId=${updatedPayment.id}, referenceId=${updatedPayment.referenceId}, paymentRequestId=${xenditResponse.id}, channelCode=${dto.channelCode}, elapsedMs=${elapsedMs}ms`);
        return {
            paymentId: updatedPayment.id,
            paymentRequestId: xenditResponse.id,
            referenceId: updatedPayment.referenceId,
            paymentStatus: updatedPayment.status,
            providerStatus: xenditResponse.status || 'REQUIRES_ACTION',
            amount: updatedPayment.amount.toNumber(),
            channelCode: dto.channelCode,
            actions: xenditResponse.actions,
            expiredAt: updatedPayment.expiredAt?.toISOString() ?? null,
        };
    }
    async handleXenditWebhook(payload) {
        const startTime = Date.now();
        if (payload.api_version && payload.api_version !== 'v3') {
            this.logger.warn(`Ignored webhook with unsupported API version: ${payload.api_version}`);
            return {
                success: true,
                message: `Ignored API version: ${payload.api_version}`,
            };
        }
        const event = payload.event;
        const paymentRequestId = payload.data?.payment_request_id || payload.data?.id;
        const referenceId = payload.data?.reference_id;
        let payment = null;
        if (paymentRequestId) {
            payment = await this.prisma.payment.findUnique({
                where: { paymentRequestId },
            });
        }
        if (!payment && referenceId) {
            payment = await this.prisma.payment.findUnique({
                where: { referenceId },
            });
        }
        if (!payment) {
            this.logger.warn(`[Webhook Ignored] Payment not found in DB for event=${event}, requestId=${paymentRequestId}, refId=${referenceId}`);
            return {
                success: true,
                message: 'Payment not found in database, ignored',
            };
        }
        if (payment_constant_1.TERMINAL_PAYMENT_STATUSES.includes(payment.status)) {
            this.logger.log(`[Webhook Idempotent Ignore] Payment ${payment.id} is already in terminal status ${payment.status} (event: ${event})`);
            return {
                success: true,
                message: `Webhook ignored: payment is already ${payment.status}`,
            };
        }
        const targetStatus = payment_constant_1.WEBHOOK_EVENT_STATUS_MAP[event];
        if (!targetStatus) {
            this.logger.warn(`[Webhook Ignored] Unsupported event type: ${event}`);
            return {
                success: true,
                message: `Ignored unsupported event: ${event}`,
            };
        }
        const syncResult = await this.prisma.$transaction(async (tx) => {
            const paymentWithOrder = await tx.payment.findUnique({
                where: { id: payment.id },
                include: {
                    order: {
                        include: { items: true },
                    },
                },
            });
            if (!paymentWithOrder) {
                throw new common_1.NotFoundException('Payment data not found in transaction');
            }
            const oldPaymentStatus = paymentWithOrder.status;
            const oldOrderStatus = paymentWithOrder.order.orderStatus;
            if (payment_constant_1.TERMINAL_ORDER_STATUSES.includes(oldOrderStatus) && oldOrderStatus !== client_1.OrderStatus.PENDING_PAYMENT) {
                this.logger.log(`[Order Idempotent Ignore] Order ${paymentWithOrder.order.id} is already in terminal status ${oldOrderStatus}`);
            }
            let updatedPay;
            switch (event) {
                case payment_constant_1.XENDIT_WEBHOOK_EVENTS.PAYMENT_CAPTURE:
                case payment_constant_1.XENDIT_WEBHOOK_EVENTS.PAYMENT_SUCCEEDED:
                    updatedPay = await this.handleCaptureEvent(tx, paymentWithOrder, payload);
                    break;
                case payment_constant_1.XENDIT_WEBHOOK_EVENTS.PAYMENT_FAILED:
                    updatedPay = await this.handleFailedEvent(tx, paymentWithOrder, payload);
                    break;
                case payment_constant_1.XENDIT_WEBHOOK_EVENTS.PAYMENT_EXPIRED:
                case payment_constant_1.XENDIT_WEBHOOK_EVENTS.INVOICE_EXPIRED:
                    updatedPay = await this.handleExpiredEvent(tx, paymentWithOrder, payload);
                    break;
                default:
                    updatedPay = paymentWithOrder;
            }
            const newOrderStatus = await this.syncOrderStatus(tx, paymentWithOrder, updatedPay.status);
            return {
                updatedPayment: updatedPay,
                oldPaymentStatus,
                oldOrderStatus,
                newOrderStatus,
            };
        });
        const elapsedMs = Date.now() - startTime;
        this.logger.log(`Webhook Sync Success: event=${event}, paymentId=${syncResult.updatedPayment.id}, referenceId=${syncResult.updatedPayment.referenceId}, paymentRequestId=${syncResult.updatedPayment.paymentRequestId ?? 'N/A'}, oldPaymentStatus=${syncResult.oldPaymentStatus}, newPaymentStatus=${syncResult.updatedPayment.status}, oldOrderStatus=${syncResult.oldOrderStatus}, newOrderStatus=${syncResult.newOrderStatus}, updatedAt=${syncResult.updatedPayment.updatedAt.toISOString()}, elapsedMs=${elapsedMs}ms`);
        return {
            success: true,
            message: 'Webhook processed successfully',
        };
    }
    async findById(id, userId) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment dengan ID ${id} tidak ditemukan`);
        }
        this.validateAccess(payment, userId);
        return this.toResponseDto(payment);
    }
    async findByOrderId(orderId, userId) {
        const payment = await this.prisma.payment.findUnique({
            where: { orderId },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment untuk Order ${orderId} tidak ditemukan`);
        }
        this.validateAccess(payment, userId);
        return this.toResponseDto(payment);
    }
    async findByReferenceId(referenceId, userId) {
        const payment = await this.prisma.payment.findUnique({
            where: { referenceId },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment dengan Reference ID ${referenceId} tidak ditemukan`);
        }
        this.validateAccess(payment, userId);
        return this.toResponseDto(payment);
    }
    async findByPaymentRequestId(paymentRequestId) {
        return this.prisma.payment.findUnique({
            where: { paymentRequestId },
            include: { order: true },
        });
    }
    async updatePaymentStatus(id, status, rawResponse) {
        const payment = await this.prisma.payment.update({
            where: { id },
            data: {
                status,
                rawResponse: rawResponse ?? undefined,
            },
            include: { order: true },
        });
        this.logger.log(`Payment ${id} status updated to ${status}`);
        return this.toResponseDto(payment);
    }
    async markAsPaid(id, paymentId, paymentMethod, providerCode, rawResponse) {
        const payment = await this.prisma.payment.update({
            where: { id },
            data: {
                status: client_1.PaymentStatus.SUCCEEDED,
                paymentId: paymentId ?? undefined,
                paymentMethod: paymentMethod ?? undefined,
                providerCode: providerCode ?? undefined,
                paidAt: new Date(),
                webhookReceivedAt: new Date(),
                rawResponse: rawResponse ?? undefined,
            },
            include: { order: true },
        });
        this.logger.log(`Payment ${id} marked as PAID (paymentId: ${paymentId}, method: ${paymentMethod}, provider: ${providerCode})`);
        return this.toResponseDto(payment);
    }
    async markAsExpired(id, failureReason, rawResponse) {
        const payment = await this.prisma.payment.update({
            where: { id },
            data: {
                status: client_1.PaymentStatus.EXPIRED,
                failureReason: failureReason ?? 'Payment expired',
                webhookReceivedAt: new Date(),
                rawResponse: rawResponse ?? undefined,
            },
            include: { order: true },
        });
        this.logger.log(`Payment ${id} marked as EXPIRED: ${failureReason}`);
        return this.toResponseDto(payment);
    }
    async markAsFailed(id, failureReason, rawResponse) {
        const payment = await this.prisma.payment.update({
            where: { id },
            data: {
                status: client_1.PaymentStatus.FAILED,
                failureReason: failureReason ?? 'Payment failed',
                webhookReceivedAt: new Date(),
                rawResponse: rawResponse ?? undefined,
            },
            include: { order: true },
        });
        this.logger.log(`Payment ${id} marked as FAILED: ${failureReason}`);
        return this.toResponseDto(payment);
    }
    async markAsCancelled(id, failureReason, rawResponse) {
        const payment = await this.prisma.payment.update({
            where: { id },
            data: {
                status: client_1.PaymentStatus.CANCELLED,
                failureReason: failureReason ?? 'Payment cancelled',
                rawResponse: rawResponse ?? undefined,
            },
            include: { order: true },
        });
        this.logger.log(`Payment ${id} marked as CANCELLED: ${failureReason}`);
        return this.toResponseDto(payment);
    }
    async syncOrderStatus(tx, payment, newPaymentStatus) {
        const currentOrderStatus = payment.order.orderStatus;
        if (payment_constant_1.TERMINAL_ORDER_STATUSES.includes(currentOrderStatus) &&
            currentOrderStatus !== client_1.OrderStatus.PENDING_PAYMENT) {
            this.logger.log(`[Order Sync Skipped] Order ${payment.order.id} is already in terminal status ${currentOrderStatus}`);
            return currentOrderStatus;
        }
        switch (newPaymentStatus) {
            case client_1.PaymentStatus.SUCCEEDED: {
                await tx.order.update({
                    where: { id: payment.orderId },
                    data: {
                        orderStatus: client_1.OrderStatus.PAID,
                    },
                });
                return client_1.OrderStatus.PAID;
            }
            case client_1.PaymentStatus.EXPIRED: {
                await tx.order.update({
                    where: { id: payment.orderId },
                    data: {
                        orderStatus: client_1.OrderStatus.EXPIRED,
                    },
                });
                for (const item of payment.order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { increment: item.quantity },
                        },
                    });
                }
                return client_1.OrderStatus.EXPIRED;
            }
            case client_1.PaymentStatus.CANCELLED: {
                await tx.order.update({
                    where: { id: payment.orderId },
                    data: {
                        orderStatus: client_1.OrderStatus.CANCELLED,
                    },
                });
                for (const item of payment.order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { increment: item.quantity },
                        },
                    });
                }
                return client_1.OrderStatus.CANCELLED;
            }
            case client_1.PaymentStatus.FAILED:
            default:
                return currentOrderStatus;
        }
    }
    async handleCaptureEvent(tx, payment, payload) {
        const paidAt = this.parseProviderDate(payload.data?.capture_timestamp) ??
            this.parseProviderDate(payload.created) ??
            new Date();
        const providerCode = this.extractProviderCode(payload) ?? payment.providerCode;
        const paymentMethod = this.extractPaymentMethod(payload) ?? payment.paymentMethod;
        return tx.payment.update({
            where: { id: payment.id },
            data: {
                status: client_1.PaymentStatus.SUCCEEDED,
                paymentId: payload.data?.id ?? payment.paymentId,
                paymentMethod,
                providerCode,
                paidAt,
                webhookReceivedAt: new Date(),
                rawResponse: payload,
            },
        });
    }
    async handleFailedEvent(tx, payment, payload) {
        return tx.payment.update({
            where: { id: payment.id },
            data: {
                status: client_1.PaymentStatus.FAILED,
                failureReason: payload.data?.failure_code ?? 'Payment failed',
                webhookReceivedAt: new Date(),
                rawResponse: payload,
            },
        });
    }
    async handleExpiredEvent(tx, payment, payload) {
        const expiredAt = this.parseProviderDate(payload.data?.channel_properties?.expires_at) ??
            payment.expiredAt ??
            new Date();
        return tx.payment.update({
            where: { id: payment.id },
            data: {
                status: client_1.PaymentStatus.EXPIRED,
                failureReason: 'Payment request expired',
                expiredAt,
                webhookReceivedAt: new Date(),
                rawResponse: payload,
            },
        });
    }
    parseProviderDate(value) {
        if (!value)
            return undefined;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? undefined : date;
    }
    extractProviderCode(payload) {
        const channelCode = payload.data?.channel_code ||
            payload.data?.payment_method?.channel_code ||
            payload.data?.payment_method?.card?.channel_code;
        if (!channelCode)
            return undefined;
        return payment_constant_1.PROVIDER_CODE_MAP[channelCode] ?? channelCode;
    }
    extractPaymentMethod(payload) {
        const channelCode = payload.data?.channel_code ||
            payload.data?.payment_method?.channel_code ||
            payload.data?.payment_method?.card?.channel_code;
        if (channelCode && payment_constant_1.PAYMENT_METHOD_MAP[channelCode]) {
            return payment_constant_1.PAYMENT_METHOD_MAP[channelCode];
        }
        if (payload.data?.payment_method?.type) {
            return payload.data.payment_method.type.toUpperCase();
        }
        return undefined;
    }
    async generateReferenceId() {
        const today = new Date();
        const dateStr = today.getFullYear().toString() +
            String(today.getMonth() + 1).padStart(2, '0') +
            String(today.getDate()).padStart(2, '0');
        let attempts = 0;
        while (attempts < 10) {
            attempts++;
            const randomHex = Math.random()
                .toString(16)
                .substring(2, 8)
                .toUpperCase();
            const candidate = `PAY-${dateStr}-${randomHex}`;
            const existing = await this.prisma.payment.findUnique({
                where: { referenceId: candidate },
                select: { id: true },
            });
            if (!existing) {
                return candidate;
            }
        }
        throw new common_1.InternalServerErrorException('Gagal membuat reference ID unik. Silakan coba lagi.');
    }
    validateAccess(payment, userId) {
        if (payment.order.buyerId !== userId &&
            payment.order.sellerId !== userId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke payment ini');
        }
        return payment;
    }
    toResponseDto(payment) {
        return {
            id: payment.id,
            orderId: payment.orderId,
            provider: payment.provider,
            referenceId: payment.referenceId,
            paymentRequestId: payment.paymentRequestId,
            paymentId: payment.paymentId,
            paymentMethod: payment.paymentMethod,
            providerCode: payment.providerCode,
            amount: payment.amount.toNumber(),
            status: payment.status,
            failureReason: payment.failureReason,
            expiredAt: payment.expiredAt?.toISOString() ?? null,
            paidAt: payment.paidAt?.toISOString() ?? null,
            createdAt: payment.createdAt.toISOString(),
            updatedAt: payment.updatedAt.toISOString(),
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof xendit_service_1.XenditService !== "undefined" && xendit_service_1.XenditService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], PaymentService);


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var XenditService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XenditService = void 0;
const common_1 = __webpack_require__(3);
const xendit_client_1 = __webpack_require__(133);
const xendit_constant_1 = __webpack_require__(135);
let XenditService = XenditService_1 = class XenditService {
    client;
    logger = new common_1.Logger(XenditService_1.name);
    constructor(client) {
        this.client = client;
    }
    async createPaymentRequest(payload) {
        this.logger.log(`Creating Xendit Payment Request v3 for Reference ID: ${payload.reference_id}, Channel: ${payload.channel_code}, Amount: ${payload.amount}`);
        return this.client.post('/v3/payment_requests', payload);
    }
    async createInvoice(options) {
        this.logger.log(`Creating Xendit Invoice for External ID: ${options.externalId}, Amount: ${options.amount}`);
        const payload = {
            external_id: options.externalId,
            amount: options.amount,
            payer_email: options.payerEmail,
            description: options.description || `Order #${options.externalId}`,
            invoice_duration: options.invoiceDuration || 86400,
            success_redirect_url: options.successRedirectUrl,
            failure_redirect_url: options.failureRedirectUrl,
            currency: options.currency || 'IDR',
            customer: options.customer
                ? {
                    given_names: options.customer.givenNames,
                    email: options.customer.email,
                    mobile_number: options.customer.mobileNumber,
                }
                : undefined,
            items: options.items?.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                category: item.category,
                url: item.url,
            })),
            fees: options.fees?.map((fee) => ({
                type: fee.type,
                value: fee.value,
            })),
        };
        const response = await this.client.post('/v2/invoices', payload);
        return {
            id: response.id,
            externalId: response.external_id || response.externalId,
            userId: response.user_id || response.userId,
            status: response.status || xendit_constant_1.XenditInvoiceStatus.PENDING,
            merchantName: response.merchant_name || response.merchantName || 'LoopTani',
            amount: response.amount,
            payerEmail: response.payer_email || response.payerEmail,
            description: response.description,
            expiryDate: response.expiry_date || response.expiryDate,
            invoiceUrl: response.invoice_url || response.invoiceUrl,
            customer: options.customer,
            items: options.items,
            fees: options.fees,
            currency: response.currency || 'IDR',
            created: response.created,
            updated: response.updated,
        };
    }
    async getInvoice(invoiceId) {
        const response = await this.client.get(`/v2/invoices/${invoiceId}`);
        return {
            id: response.id,
            externalId: response.external_id || response.externalId,
            userId: response.user_id || response.userId,
            status: response.status || xendit_constant_1.XenditInvoiceStatus.PENDING,
            merchantName: response.merchant_name || response.merchantName,
            amount: response.amount,
            payerEmail: response.payer_email || response.payerEmail,
            description: response.description,
            expiryDate: response.expiry_date || response.expiryDate,
            invoiceUrl: response.invoice_url || response.invoiceUrl,
            currency: response.currency || 'IDR',
            created: response.created,
            updated: response.updated,
        };
    }
    async expireInvoice(invoiceId) {
        const response = await this.client.post(`/v2/invoices/${invoiceId}/expire!`, {});
        return {
            id: response.id,
            externalId: response.external_id || response.externalId,
            userId: response.user_id || response.userId,
            status: xendit_constant_1.XenditInvoiceStatus.EXPIRED,
            merchantName: response.merchant_name || response.merchantName,
            amount: response.amount,
            payerEmail: response.payer_email || response.payerEmail,
            description: response.description,
            expiryDate: response.expiry_date || response.expiryDate,
            invoiceUrl: response.invoice_url || response.invoiceUrl,
            currency: response.currency || 'IDR',
            created: response.created,
            updated: response.updated,
        };
    }
    verifyWebhookToken(tokenHeader) {
        return this.client.verifyWebhookToken(tokenHeader);
    }
};
exports.XenditService = XenditService;
exports.XenditService = XenditService = XenditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof xendit_client_1.XenditClient !== "undefined" && xendit_client_1.XenditClient) === "function" ? _a : Object])
], XenditService);


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var XenditClient_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XenditClient = void 0;
const common_1 = __webpack_require__(3);
const xendit_config_1 = __webpack_require__(134);
const xendit_constant_1 = __webpack_require__(135);
let XenditClient = XenditClient_1 = class XenditClient {
    config;
    logger = new common_1.Logger(XenditClient_1.name);
    constructor(config) {
        this.config = config;
    }
    get authHeader() {
        const authString = `${this.config.secretKey}:`;
        return `Basic ${Buffer.from(authString).toString('base64')}`;
    }
    async post(endpoint, data, timeoutMs = 10000) {
        const url = `${xendit_constant_1.XENDIT_API_BASE_URL}${endpoint}`;
        if (this.config.isSandbox && this.config.secretKey.includes('dummy')) {
            this.logger.log(`[Xendit Dummy Sandbox] POST Request to ${endpoint}: ${JSON.stringify(data)}`);
            return this.mockResponse(endpoint, data);
        }
        let lastError = null;
        const maxRetries = 2;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: this.authHeader,
                        'Content-Type': 'application/json',
                        'api-version': '2022-07-31',
                    },
                    body: JSON.stringify(data),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (!response.ok) {
                    const errorText = await response.text();
                    this.logger.error(`Xendit API POST Error (${response.status}) [Attempt ${attempt}/${maxRetries}]: ${errorText}`);
                    if (response.status >= 500 && attempt < maxRetries) {
                        this.logger.warn(`Retrying Xendit API POST (${attempt}/${maxRetries})...`);
                        await this.delay(500 * attempt);
                        continue;
                    }
                    throw new Error(`Xendit API Error ${response.status}: ${errorText}`);
                }
                return (await response.json());
            }
            catch (err) {
                clearTimeout(timeoutId);
                lastError = err;
                if (err.name === 'AbortError') {
                    this.logger.error(`Xendit API Request Timeout (${timeoutMs}ms) [Attempt ${attempt}/${maxRetries}]`);
                }
                if (attempt < maxRetries && err.name === 'AbortError') {
                    this.logger.warn(`Retrying Xendit API after timeout (${attempt}/${maxRetries})...`);
                    await this.delay(500 * attempt);
                    continue;
                }
                if (this.config.isSandbox) {
                    this.logger.warn(`Failed calling Xendit API, falling back to mock sandbox: ${err.message}`);
                    return this.mockResponse(endpoint, data);
                }
                throw err;
            }
        }
        throw lastError || new Error('Xendit API call failed');
    }
    async get(endpoint, timeoutMs = 10000) {
        const url = `${xendit_constant_1.XENDIT_API_BASE_URL}${endpoint}`;
        if (this.config.isSandbox && this.config.secretKey.includes('dummy')) {
            this.logger.log(`[Xendit Dummy Sandbox] GET Request to ${endpoint}`);
            return { id: 'mock-inv-123', status: 'PENDING' };
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: this.authHeader,
                },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Xendit API GET Error (${response.status}): ${errorText}`);
                throw new Error(`Xendit API Error ${response.status}: ${errorText}`);
            }
            return (await response.json());
        }
        catch (err) {
            clearTimeout(timeoutId);
            this.logger.warn(`Failed calling Xendit API GET: ${err.message}`);
            return { id: 'mock-inv-123', status: 'PENDING' };
        }
    }
    verifyWebhookToken(tokenHeader) {
        if (!tokenHeader)
            return false;
        return (tokenHeader === this.config.webhookVerificationToken ||
            this.config.isSandbox);
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    mockResponse(endpoint, data) {
        if (endpoint.includes('payment_requests')) {
            const prId = `pr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            return {
                id: prId,
                reference_id: data.reference_id || `PAY-${Date.now()}`,
                business_id: 'mock_biz_123',
                type: 'PAY',
                status: 'REQUIRES_ACTION',
                currency: data.currency || 'IDR',
                amount: data.amount || 0,
                country: data.country || 'ID',
                channel_code: data.channel_code || 'ID_BCA',
                channel_properties: data.channel_properties || {},
                actions: [
                    {
                        action: 'PRESENT_TO_CUSTOMER',
                        method: 'GET',
                        url: `https://checkout-staging.xendit.co/v3/pay/${prId}`,
                        url_type: 'WEB',
                        qr_code: data.channel_code === 'QRIS'
                            ? '00020101021226670016COM.XENDIT.WWW0118936009140000000000020300003030045115204581253033605405150005802ID5913LOOP TANI SEED6007JAKARTA61051234562070703A0163041234'
                            : undefined,
                    },
                ],
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                expires_at: new Date(Date.now() + 86400 * 1000).toISOString(),
                metadata: data.metadata,
            };
        }
        const invId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        return {
            id: invId,
            externalId: data.externalId || `ext_${Date.now()}`,
            userId: 'mock_user_123',
            status: 'PENDING',
            merchantName: 'LoopTani Store',
            amount: data.amount || 0,
            payerEmail: data.payerEmail || 'buyer@looptani.id',
            description: data.description || 'Pembelian di LoopTani',
            expiryDate: new Date(Date.now() + 86400 * 1000).toISOString(),
            invoiceUrl: `https://checkout-staging.xendit.co/v2/${invId}`,
            customer: data.customer,
            items: data.items,
            fees: data.fees,
            currency: data.currency || 'IDR',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
        };
    }
};
exports.XenditClient = XenditClient;
exports.XenditClient = XenditClient = XenditClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof xendit_config_1.XenditConfig !== "undefined" && xendit_config_1.XenditConfig) === "function" ? _a : Object])
], XenditClient);


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XenditConfig = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(34);
let XenditConfig = class XenditConfig {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    get secretKey() {
        return (this.configService.get('XENDIT_SECRET_KEY') ||
            'xnd_development_dummy_key_for_sandbox_testing');
    }
    get webhookVerificationToken() {
        return (this.configService.get('XENDIT_WEBHOOK_VERIFICATION_TOKEN') ||
            'xnd_webhook_verification_token_dummy');
    }
    get isSandbox() {
        const key = this.secretKey;
        return key.includes('development') || key.includes('dummy');
    }
};
exports.XenditConfig = XenditConfig;
exports.XenditConfig = XenditConfig = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], XenditConfig);


/***/ }),
/* 135 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XenditCurrency = exports.XenditInvoiceStatus = exports.XENDIT_API_BASE_URL = exports.XENDIT_CLIENT = exports.XENDIT_CONFIG = void 0;
exports.XENDIT_CONFIG = 'XENDIT_CONFIG';
exports.XENDIT_CLIENT = 'XENDIT_CLIENT';
exports.XENDIT_API_BASE_URL = 'https://api.xendit.co';
var XenditInvoiceStatus;
(function (XenditInvoiceStatus) {
    XenditInvoiceStatus["PENDING"] = "PENDING";
    XenditInvoiceStatus["PAID"] = "PAID";
    XenditInvoiceStatus["SETTLED"] = "SETTLED";
    XenditInvoiceStatus["EXPIRED"] = "EXPIRED";
})(XenditInvoiceStatus || (exports.XenditInvoiceStatus = XenditInvoiceStatus = {}));
var XenditCurrency;
(function (XenditCurrency) {
    XenditCurrency["IDR"] = "IDR";
    XenditCurrency["USD"] = "USD";
})(XenditCurrency || (exports.XenditCurrency = XenditCurrency = {}));


/***/ }),
/* 136 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WEBHOOK_EVENT_STATUS_MAP = exports.TERMINAL_ORDER_STATUSES = exports.TERMINAL_PAYMENT_STATUSES = exports.XENDIT_WEBHOOK_EVENTS = exports.PROVIDER_CODE_MAP = exports.PAYMENT_METHOD_MAP = exports.SUPPORTED_CHANNEL_CODES = void 0;
const client_1 = __webpack_require__(9);
exports.SUPPORTED_CHANNEL_CODES = [
    'ID_BCA',
    'ID_BNI',
    'ID_BRI',
    'ID_MANDIRI',
    'ID_PERMATA',
    'ID_BSI',
    'ID_BJB',
    'ID_CIMB',
    'ID_SAHABAT_SAMPOERNA',
    'ID_OVO',
    'ID_DANA',
    'ID_SHOPEEPAY',
    'ID_LINKAJA',
    'ID_ASTRAPAY',
    'ID_JENIUSPAY',
    'QRIS',
    'ID_KREDIVO',
    'ID_AKULAKU',
    'ID_ATOME',
    'CARDS',
];
exports.PAYMENT_METHOD_MAP = {
    ID_BCA: 'VIRTUAL_ACCOUNT',
    ID_BNI: 'VIRTUAL_ACCOUNT',
    ID_BRI: 'VIRTUAL_ACCOUNT',
    ID_MANDIRI: 'VIRTUAL_ACCOUNT',
    ID_PERMATA: 'VIRTUAL_ACCOUNT',
    ID_BSI: 'VIRTUAL_ACCOUNT',
    ID_BJB: 'VIRTUAL_ACCOUNT',
    ID_CIMB: 'VIRTUAL_ACCOUNT',
    ID_SAHABAT_SAMPOERNA: 'VIRTUAL_ACCOUNT',
    ID_OVO: 'EWALLET',
    ID_DANA: 'EWALLET',
    ID_SHOPEEPAY: 'EWALLET',
    ID_LINKAJA: 'EWALLET',
    ID_ASTRAPAY: 'EWALLET',
    ID_JENIUSPAY: 'EWALLET',
    QRIS: 'QRIS',
    ID_KREDIVO: 'PAYLATER',
    ID_AKULAKU: 'PAYLATER',
    ID_ATOME: 'PAYLATER',
    CARDS: 'CREDIT_CARD',
};
exports.PROVIDER_CODE_MAP = {
    ID_BCA: 'BCA',
    ID_BNI: 'BNI',
    ID_BRI: 'BRI',
    ID_MANDIRI: 'MANDIRI',
    ID_PERMATA: 'PERMATA',
    ID_BSI: 'BSI',
    ID_BJB: 'BJB',
    ID_CIMB: 'CIMB',
    ID_SAHABAT_SAMPOERNA: 'SAMPOERNA',
    ID_OVO: 'OVO',
    ID_DANA: 'DANA',
    ID_SHOPEEPAY: 'SHOPEEPAY',
    ID_LINKAJA: 'LINKAJA',
    ID_ASTRAPAY: 'ASTRAPAY',
    ID_JENIUSPAY: 'JENIUSPAY',
    QRIS: 'QRIS',
    ID_KREDIVO: 'KREDIVO',
    ID_AKULAKU: 'AKULAKU',
    ID_ATOME: 'ATOME',
    CARDS: 'CARDS',
};
exports.XENDIT_WEBHOOK_EVENTS = {
    PAYMENT_CAPTURE: 'payment.capture',
    PAYMENT_SUCCEEDED: 'payment.succeeded',
    PAYMENT_FAILED: 'payment.failed',
    PAYMENT_EXPIRED: 'payment_request.expiry',
    INVOICE_EXPIRED: 'invoice.expired',
};
exports.TERMINAL_PAYMENT_STATUSES = [
    client_1.PaymentStatus.SUCCEEDED,
    client_1.PaymentStatus.FAILED,
    client_1.PaymentStatus.EXPIRED,
    client_1.PaymentStatus.CANCELLED,
];
exports.TERMINAL_ORDER_STATUSES = [
    client_1.OrderStatus.PAID,
    client_1.OrderStatus.PROCESSING,
    client_1.OrderStatus.SHIPPED,
    client_1.OrderStatus.DELIVERED,
    client_1.OrderStatus.COMPLETED,
    client_1.OrderStatus.CANCELLED,
    client_1.OrderStatus.EXPIRED,
];
exports.WEBHOOK_EVENT_STATUS_MAP = {
    [exports.XENDIT_WEBHOOK_EVENTS.PAYMENT_CAPTURE]: client_1.PaymentStatus.SUCCEEDED,
    [exports.XENDIT_WEBHOOK_EVENTS.PAYMENT_SUCCEEDED]: client_1.PaymentStatus.SUCCEEDED,
    [exports.XENDIT_WEBHOOK_EVENTS.PAYMENT_FAILED]: client_1.PaymentStatus.FAILED,
    [exports.XENDIT_WEBHOOK_EVENTS.PAYMENT_EXPIRED]: client_1.PaymentStatus.EXPIRED,
    [exports.XENDIT_WEBHOOK_EVENTS.INVOICE_EXPIRED]: client_1.PaymentStatus.EXPIRED,
};


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePaymentRequestDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const payment_constant_1 = __webpack_require__(136);
class CreatePaymentRequestDto {
    channelCode;
    channelProperties;
}
exports.CreatePaymentRequestDto = CreatePaymentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Kode channel pembayaran Xendit',
        example: 'ID_BCA',
        enum: payment_constant_1.SUPPORTED_CHANNEL_CODES,
    }),
    (0, class_validator_1.IsIn)(payment_constant_1.SUPPORTED_CHANNEL_CODES, {
        message: `channelCode harus salah satu dari: ${payment_constant_1.SUPPORTED_CHANNEL_CODES.join(', ')}`,
    }),
    __metadata("design:type", String)
], CreatePaymentRequestDto.prototype, "channelCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Properties spesifik channel (success_return_url, failure_return_url, dll.)',
        example: {
            success_return_url: 'https://looptani.id/orders/123?status=success',
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], CreatePaymentRequestDto.prototype, "channelProperties", void 0);


/***/ }),
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
const client_1 = __webpack_require__(9);
class PaymentResponseDto {
    id;
    orderId;
    provider;
    referenceId;
    paymentRequestId;
    paymentId;
    paymentMethod;
    providerCode;
    amount;
    status;
    failureReason;
    expiredAt;
    paidAt;
    createdAt;
    updatedAt;
}
exports.PaymentResponseDto = PaymentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID Payment',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID Order terkait',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Provider pembayaran',
        enum: client_1.PaymentProvider,
        example: client_1.PaymentProvider.XENDIT,
    }),
    __metadata("design:type", typeof (_a = typeof client_1.PaymentProvider !== "undefined" && client_1.PaymentProvider) === "function" ? _a : Object)
], PaymentResponseDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reference ID internal Loop Tani (format: PAY-YYYYMMDD-XXXXXX)',
        example: 'PAY-20260724-AB12CD',
    }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "referenceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID payment request dari provider (Xendit Payment Request ID). Diisi setelah request ke Xendit.',
        nullable: true,
    }),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "paymentRequestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID pembayaran aktual dari provider. Diisi saat webhook diterima.',
        nullable: true,
    }),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metode pembayaran: QRIS, VIRTUAL_ACCOUNT, EWALLET, CREDIT_CARD, dll.',
        nullable: true,
        example: 'VIRTUAL_ACCOUNT',
    }),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Kode channel spesifik: BCA, BNI, OVO, DANA, SHOPEEPAY, dll.',
        nullable: true,
        example: 'BCA',
    }),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "providerCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Jumlah pembayaran (Rupiah)',
        example: 150000,
    }),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status pembayaran',
        enum: client_1.PaymentStatus,
        example: client_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", typeof (_b = typeof client_1.PaymentStatus !== "undefined" && client_1.PaymentStatus) === "function" ? _b : Object)
], PaymentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alasan kegagalan pembayaran',
        nullable: true,
        example: 'Card declined',
    }),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "failureReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Waktu kadaluarsa pembayaran (ISO 8601)',
        nullable: true,
    }),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "expiredAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Waktu pembayaran berhasil (ISO 8601)',
        nullable: true,
    }),
    __metadata("design:type", Object)
], PaymentResponseDto.prototype, "paidAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Waktu pembuatan record' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Waktu terakhir diperbarui' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "updatedAt", void 0);


/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentRequestResponseDto = void 0;
const swagger_1 = __webpack_require__(13);
const client_1 = __webpack_require__(9);
class PaymentRequestResponseDto {
    paymentId;
    paymentRequestId;
    referenceId;
    paymentStatus;
    providerStatus;
    amount;
    channelCode;
    actions;
    expiredAt;
}
exports.PaymentRequestResponseDto = PaymentRequestResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID Payment di database Loop Tani',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], PaymentRequestResponseDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID payment request dari Xendit (pr-xxx)',
        example: 'pr-90392f42-d98a-49ef-a7f3-abcezas123',
    }),
    __metadata("design:type", String)
], PaymentRequestResponseDto.prototype, "paymentRequestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reference ID internal Loop Tani',
        example: 'PAY-20260724-AB12CD',
    }),
    __metadata("design:type", String)
], PaymentRequestResponseDto.prototype, "referenceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status pembayaran internal Loop Tani',
        enum: client_1.PaymentStatus,
        example: client_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", typeof (_a = typeof client_1.PaymentStatus !== "undefined" && client_1.PaymentStatus) === "function" ? _a : Object)
], PaymentRequestResponseDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status pembayaran dari provider (Xendit)',
        example: 'REQUIRES_ACTION',
    }),
    __metadata("design:type", String)
], PaymentRequestResponseDto.prototype, "providerStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Jumlah pembayaran (Rupiah)',
        example: 150000,
    }),
    __metadata("design:type", Number)
], PaymentRequestResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Kode channel yang dipilih',
        example: 'ID_BCA',
    }),
    __metadata("design:type", String)
], PaymentRequestResponseDto.prototype, "channelCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Daftar action yang dibutuhkan frontend (redirect URL, QR string, VA details, dll.)',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                action: { type: 'string', example: 'PRESENT_TO_CUSTOMER' },
                method: { type: 'string', example: 'GET' },
                url: { type: 'string', example: 'https://checkout.xendit.co/...' },
                qr_code: { type: 'string' },
            },
        },
    }),
    __metadata("design:type", Array)
], PaymentRequestResponseDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Waktu kadaluarsa pembayaran (ISO 8601)',
        nullable: true,
    }),
    __metadata("design:type", Object)
], PaymentRequestResponseDto.prototype, "expiredAt", void 0);


/***/ }),
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XenditWebhookGuard = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(34);
let XenditWebhookGuard = class XenditWebhookGuard {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const tokenHeader = request.headers['x-callback-token'];
        const expectedToken = this.configService.get('XENDIT_WEBHOOK_TOKEN');
        if (!expectedToken) {
            throw new common_1.UnauthorizedException('XENDIT_WEBHOOK_TOKEN belum dikonfigurasi di environment');
        }
        if (!tokenHeader || tokenHeader !== expectedToken) {
            throw new common_1.UnauthorizedException('Token callback tidak valid');
        }
        return true;
    }
};
exports.XenditWebhookGuard = XenditWebhookGuard;
exports.XenditWebhookGuard = XenditWebhookGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], XenditWebhookGuard);


/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XenditModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(34);
const xendit_config_1 = __webpack_require__(134);
const xendit_client_1 = __webpack_require__(133);
const xendit_service_1 = __webpack_require__(132);
const xendit_webhook_guard_1 = __webpack_require__(140);
let XenditModule = class XenditModule {
};
exports.XenditModule = XenditModule;
exports.XenditModule = XenditModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [xendit_config_1.XenditConfig, xendit_client_1.XenditClient, xendit_service_1.XenditService, xendit_webhook_guard_1.XenditWebhookGuard],
        exports: [xendit_config_1.XenditConfig, xendit_client_1.XenditClient, xendit_service_1.XenditService, xendit_webhook_guard_1.XenditWebhookGuard],
    })
], XenditModule);


/***/ }),
/* 142 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShippingModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(34);
const axios_1 = __webpack_require__(143);
const shipping_constants_1 = __webpack_require__(144);
const rajaongkir_client_1 = __webpack_require__(145);
const rajaongkir_module_1 = __webpack_require__(150);
const shipping_service_1 = __webpack_require__(151);
const shipping_controller_1 = __webpack_require__(152);
let ShippingModule = class ShippingModule {
};
exports.ShippingModule = ShippingModule;
exports.ShippingModule = ShippingModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, axios_1.HttpModule, rajaongkir_module_1.RajaOngkirModule],
        controllers: [shipping_controller_1.ShippingController],
        providers: [
            shipping_service_1.ShippingService,
            {
                provide: shipping_constants_1.SHIPPING_PROVIDER,
                useFactory: (config, http) => {
                    const providerName = config.get('SHIPPING_PROVIDER', 'rajaongkir');
                    switch (providerName.toLowerCase()) {
                        case 'rajaongkir':
                        default:
                            return new rajaongkir_client_1.RajaOngkirClient(http, config);
                    }
                },
                inject: [config_1.ConfigService, axios_1.HttpService],
            },
        ],
        exports: [shipping_service_1.ShippingService],
    })
], ShippingModule);


/***/ }),
/* 143 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 144 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SHIPPING_PROVIDER = void 0;
exports.SHIPPING_PROVIDER = Symbol('SHIPPING_PROVIDER');


/***/ }),
/* 145 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RajaOngkirClient_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RajaOngkirClient = void 0;
const axios_1 = __webpack_require__(143);
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(34);
const rxjs_1 = __webpack_require__(146);
const rajaongkir_constant_1 = __webpack_require__(147);
const destination_mapper_1 = __webpack_require__(148);
const cost_mapper_1 = __webpack_require__(149);
let RajaOngkirClient = RajaOngkirClient_1 = class RajaOngkirClient {
    httpService;
    configService;
    providerName = 'rajaongkir';
    logger = new common_1.Logger(RajaOngkirClient_1.name);
    apiKey;
    baseUrl;
    timeoutMs;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.apiKey = this.configService.get('RAJAONGKIR_API_KEY', '');
        this.baseUrl = this.configService
            .get('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1')
            .replace(/\/+$/, '');
        this.timeoutMs = Number(this.configService.get('RAJAONGKIR_TIMEOUT', 10000));
    }
    get headers() {
        return {
            key: this.apiKey,
            key_id: this.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        };
    }
    async searchDestination(keyword) {
        const startTime = Date.now();
        const endpoint = rajaongkir_constant_1.RAJAONGKIR_ENDPOINTS.DESTINATION;
        const url = `${this.baseUrl}${endpoint}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService
                .get(url, {
                params: { search: keyword },
                headers: this.headers,
            })
                .pipe((0, rxjs_1.timeout)(this.timeoutMs), (0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => err))));
            const elapsedMs = Date.now() - startTime;
            this.logger.log(`Shipping Request: provider=${this.providerName} endpoint=${endpoint} search="${keyword}" status=${response.status} elapsedMs=${elapsedMs}ms`);
            const rawData = response.data?.data ?? response.data?.results ?? response.data;
            const mapped = (0, destination_mapper_1.mapRajaOngkirDestinations)(rawData);
            if (mapped.length > 0)
                return mapped;
        }
        catch (error) {
            const elapsedMs = Date.now() - startTime;
            this.logger.warn(`Shipping Request Failed or Empty: provider=${this.providerName} endpoint=${endpoint} search="${keyword}" elapsedMs=${elapsedMs}ms error=${error.message}`);
        }
        return this.getFallbackDestinations(keyword);
    }
    async calculateCost(originId, destinationId, weight, courier) {
        const startTime = Date.now();
        const courierLower = courier.toLowerCase();
        const endpointsToTry = [
            rajaongkir_constant_1.RAJAONGKIR_ENDPOINTS.COST,
            rajaongkir_constant_1.RAJAONGKIR_ENDPOINTS.CALCULATE_DOMESTIC,
            rajaongkir_constant_1.RAJAONGKIR_ENDPOINTS.CALCULATE,
        ];
        let lastError = null;
        for (const endpoint of endpointsToTry) {
            const url = `${this.baseUrl}${endpoint}`;
            const payload = new URLSearchParams({
                origin: String(originId),
                destination: String(destinationId),
                weight: String(weight),
                courier: courierLower,
            }).toString();
            try {
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService
                    .post(url, payload, {
                    headers: this.headers,
                })
                    .pipe((0, rxjs_1.timeout)(this.timeoutMs), (0, rxjs_1.catchError)((err) => (0, rxjs_1.throwError)(() => err))));
                if (response.status === 200) {
                    const elapsedMs = Date.now() - startTime;
                    this.logger.log(`Shipping Cost Request Success: provider=${this.providerName} endpoint=${endpoint} originId=${originId} destinationId=${destinationId} courier=${courierLower} weight=${weight} status=${response.status} elapsedMs=${elapsedMs}ms`);
                    const rawData = response.data?.rajaongkir?.results ??
                        response.data?.data ??
                        response.data;
                    const costs = (0, cost_mapper_1.mapRajaOngkirCosts)(rawData, courierLower);
                    if (costs && costs.length > 0) {
                        return costs;
                    }
                }
            }
            catch (err) {
                lastError = err;
                if (err?.response?.status === 404) {
                    continue;
                }
                break;
            }
        }
        this.logger.warn(`RajaOngkir API endpoint returned error for courier=${courierLower}. Returning fallback rates. Error=${lastError?.message || '404 Not Found'}`);
        return this.getFallbackCosts(courierLower, weight);
    }
    async calculateMultiCourierCost(originId, destinationId, weight, couriers) {
        const list = couriers && couriers.length > 0
            ? couriers
            : ['jne', 'pos', 'tiki', 'sicepat', 'jnt'];
        const concurrencyLimit = 3;
        const flatResults = [];
        for (let i = 0; i < list.length; i += concurrencyLimit) {
            const batch = list.slice(i, i + concurrencyLimit);
            const batchResults = await Promise.allSettled(batch.map((c) => this.calculateCost(originId, destinationId, weight, c)));
            for (const res of batchResults) {
                if (res.status === 'fulfilled' && Array.isArray(res.value)) {
                    flatResults.push(...res.value);
                }
            }
        }
        return (0, cost_mapper_1.groupShippingCostsByCourier)(flatResults);
    }
    getFallbackCosts(courier, weight) {
        const courierUpper = courier.toUpperCase();
        const weightKg = Math.max(1, Math.ceil(weight / 1000));
        const baseRates = {
            JNE: [
                {
                    serviceCode: 'REG',
                    serviceName: 'Layanan Reguler',
                    etd: '2-3',
                    baseCost: 18000,
                    isReg: true,
                },
                {
                    serviceCode: 'YES',
                    serviceName: 'Yakin Esok Sampai',
                    etd: '1',
                    baseCost: 28000,
                },
                {
                    serviceCode: 'OKE',
                    serviceName: 'Ongkos Kirim Ekonomis',
                    etd: '3-4',
                    baseCost: 14000,
                },
            ],
            SICEPAT: [
                {
                    serviceCode: 'REG',
                    serviceName: 'SIUNTUNG',
                    etd: '2-3',
                    baseCost: 15000,
                    isReg: true,
                },
                {
                    serviceCode: 'BEST',
                    serviceName: 'Besok Sampai Tujuan',
                    etd: '1',
                    baseCost: 24000,
                },
                {
                    serviceCode: 'HALU',
                    serviceName: 'Hemat Ancur Laper',
                    etd: '3-5',
                    baseCost: 11000,
                },
            ],
            JNT: [
                {
                    serviceCode: 'EZ',
                    serviceName: 'J&T EZ',
                    etd: '2-3',
                    baseCost: 16000,
                    isReg: true,
                },
                {
                    serviceCode: 'DOC',
                    serviceName: 'J&T Express Super',
                    etd: '1',
                    baseCost: 26000,
                },
            ],
            POS: [
                {
                    serviceCode: 'POS Reguler',
                    serviceName: 'Pos Reguler',
                    etd: '2-4',
                    baseCost: 14000,
                    isReg: true,
                },
                {
                    serviceCode: 'POS Nextday',
                    serviceName: 'Pos Nextday',
                    etd: '1',
                    baseCost: 22000,
                },
            ],
            TIKI: [
                {
                    serviceCode: 'REG',
                    serviceName: 'Regular Service',
                    etd: '2-3',
                    baseCost: 17000,
                    isReg: true,
                },
                {
                    serviceCode: 'ONS',
                    serviceName: 'Over Night Service',
                    etd: '1',
                    baseCost: 27000,
                },
            ],
        };
        const options = baseRates[courierUpper] || [
            {
                serviceCode: 'REG',
                serviceName: `${courierUpper} Reguler`,
                etd: '2-3',
                baseCost: 16000,
                isReg: true,
            },
            {
                serviceCode: 'EXP',
                serviceName: `${courierUpper} Express`,
                etd: '1',
                baseCost: 25000,
            },
        ];
        const courierNameMap = {
            JNE: 'JNE Express',
            SICEPAT: 'SiCepat Ekspres',
            JNT: 'J&T Express',
            POS: 'POS Indonesia',
            TIKI: 'TIKI Courier',
        };
        return options.map((opt) => ({
            courierCode: courierUpper,
            courierName: courierNameMap[courierUpper] || courierUpper,
            serviceCode: opt.serviceCode,
            serviceName: opt.serviceName,
            etd: opt.etd,
            cost: opt.baseCost * weightKg,
            isRecommended: opt.isReg,
        }));
    }
    getFallbackDestinations(keyword) {
        const list = [
            {
                id: 153,
                province: 'Riau',
                city: 'Kota Pekanbaru',
                district: 'Pekanbaru Kota',
                subdistrict: 'Pekanbaru Kota',
            },
            {
                id: 54,
                province: 'DKI Jakarta',
                city: 'Kota Jakarta Selatan',
                district: 'Kebayoran Baru',
                subdistrict: 'Kebayoran Baru',
            },
            {
                id: 23,
                province: 'Jawa Barat',
                city: 'Kota Bandung',
                district: 'Coblong',
                subdistrict: 'Dago',
            },
            {
                id: 444,
                province: 'Jawa Timur',
                city: 'Kota Surabaya',
                district: 'Gubeng',
                subdistrict: 'Gubeng',
            },
            {
                id: 256,
                province: 'Sumatera Utara',
                city: 'Kota Medan',
                district: 'Medan Kota',
                subdistrict: 'Medan Kota',
            },
        ];
        if (!keyword)
            return list;
        const lower = keyword.toLowerCase();
        const filtered = list.filter((item) => item.city.toLowerCase().includes(lower) ||
            item.province.toLowerCase().includes(lower) ||
            item.district.toLowerCase().includes(lower));
        return filtered.length > 0 ? filtered : list;
    }
};
exports.RajaOngkirClient = RajaOngkirClient;
exports.RajaOngkirClient = RajaOngkirClient = RajaOngkirClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], RajaOngkirClient);


/***/ }),
/* 146 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 147 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RAJAONGKIR_ENDPOINTS = void 0;
exports.RAJAONGKIR_ENDPOINTS = {
    DESTINATION: '/destination',
    COST: '/cost',
    CALCULATE_DOMESTIC: '/calculate/domestic-cost',
    CALCULATE: '/calculate',
};


/***/ }),
/* 148 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mapRajaOngkirDestination = mapRajaOngkirDestination;
exports.mapRajaOngkirDestinations = mapRajaOngkirDestinations;
function mapRajaOngkirDestination(rawItem) {
    const rawId = rawItem.id ?? rawItem.subdistrict_id ?? rawItem.city_id ?? rawItem.destination_id ?? 0;
    const province = rawItem.province_name ?? rawItem.province ?? '';
    const cityName = rawItem.city_name ?? rawItem.city ?? '';
    const cityType = rawItem.type ? `${rawItem.type} ` : '';
    const fullCity = rawItem.city_name ? `${cityType}${cityName}`.trim() : cityName;
    const district = rawItem.district_name ?? rawItem.subdistrict_name ?? fullCity;
    const subdistrict = rawItem.subdistrict_name ?? rawItem.district_name ?? fullCity;
    return {
        id: Number(rawId),
        province: String(province),
        city: String(fullCity),
        district: String(district),
        subdistrict: String(subdistrict),
    };
}
function mapRajaOngkirDestinations(rawList) {
    if (!Array.isArray(rawList))
        return [];
    return rawList.map(mapRajaOngkirDestination);
}


/***/ }),
/* 149 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mapRajaOngkirCosts = mapRajaOngkirCosts;
exports.groupShippingCostsByCourier = groupShippingCostsByCourier;
function mapRajaOngkirCosts(rawResponse, requestedCourier) {
    const normalized = [];
    const results = rawResponse?.data ?? rawResponse?.results ?? rawResponse;
    if (!Array.isArray(results)) {
        if (results && typeof results === 'object' && Array.isArray(results.costs)) {
            return mapRajaOngkirCosts([results], requestedCourier);
        }
        return normalized;
    }
    for (const item of results) {
        const courierCode = String(item.code ?? requestedCourier).toUpperCase();
        const courierName = String(item.name ?? courierCode);
        const costs = item.costs ?? (Array.isArray(item.service) ? item.service : [item]);
        if (Array.isArray(costs)) {
            for (const c of costs) {
                const serviceCode = String(c.service ?? c.code ?? 'REG');
                const serviceName = String(c.description ?? c.name ?? serviceCode);
                const costDetail = Array.isArray(c.cost) ? c.cost[0] : c;
                const cost = Number(costDetail?.value ?? costDetail?.price ?? costDetail?.cost ?? 0);
                const rawEtd = String(costDetail?.etd ?? c.etd ?? '');
                const etd = rawEtd.replace(/HARI|day|days/gi, '').trim();
                if (cost > 0) {
                    const isReg = ['REG', 'EZ', 'REGULER', 'STANDARD'].includes(serviceCode.toUpperCase());
                    normalized.push({
                        courierCode,
                        courierName,
                        serviceCode,
                        serviceName,
                        etd: etd || '1-3',
                        cost,
                        isRecommended: isReg,
                    });
                }
            }
        }
    }
    return normalized;
}
function groupShippingCostsByCourier(flatCosts) {
    if (!flatCosts || flatCosts.length === 0)
        return [];
    let minCost = Infinity;
    for (const c of flatCosts) {
        if (c.cost < minCost)
            minCost = c.cost;
    }
    const map = new Map();
    for (const item of flatCosts) {
        const code = item.courierCode;
        if (!map.has(code)) {
            map.set(code, {
                courierName: item.courierName,
                services: [],
            });
        }
        const courierGroup = map.get(code);
        courierGroup.services.push({
            serviceCode: item.serviceCode,
            serviceName: item.serviceName,
            etd: item.etd,
            cost: item.cost,
            isRecommended: item.isRecommended || item.serviceCode.toUpperCase() === 'REG',
            isCheapest: item.cost === minCost,
        });
    }
    const grouped = [];
    map.forEach((val, key) => {
        grouped.push({
            courierCode: key,
            courierName: val.courierName,
            services: val.services,
        });
    });
    return grouped;
}


/***/ }),
/* 150 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RajaOngkirModule = void 0;
const common_1 = __webpack_require__(3);
const axios_1 = __webpack_require__(143);
const rajaongkir_client_1 = __webpack_require__(145);
let RajaOngkirModule = class RajaOngkirModule {
};
exports.RajaOngkirModule = RajaOngkirModule;
exports.RajaOngkirModule = RajaOngkirModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        providers: [rajaongkir_client_1.RajaOngkirClient],
        exports: [rajaongkir_client_1.RajaOngkirClient, axios_1.HttpModule],
    })
], RajaOngkirModule);


/***/ }),
/* 151 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ShippingService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShippingService = void 0;
const common_1 = __webpack_require__(3);
const shipping_constants_1 = __webpack_require__(144);
let ShippingService = ShippingService_1 = class ShippingService {
    shippingProvider;
    logger = new common_1.Logger(ShippingService_1.name);
    constructor(shippingProvider) {
        this.shippingProvider = shippingProvider;
    }
    async searchDestination(keyword) {
        this.logger.log(`Searching destination keyword="${keyword}" using provider=${this.shippingProvider.providerName}`);
        return this.shippingProvider.searchDestination(keyword);
    }
    async calculateShippingCost(dto) {
        this.logger.log(`Calculating shipping cost using provider=${this.shippingProvider.providerName} originId=${dto.originId} destinationId=${dto.destinationId} weight=${dto.weight} courier=${dto.courier}`);
        return this.shippingProvider.calculateCost(dto.originId, dto.destinationId, dto.weight, dto.courier);
    }
    async calculateMultiCourierOptions(originId, destinationId, weight, couriers = ['jne', 'pos', 'tiki', 'sicepat', 'jnt']) {
        this.logger.log(`Calculating multi-courier options using provider=${this.shippingProvider.providerName} originId=${originId} destinationId=${destinationId} weight=${weight} couriers=${couriers.join(',')}`);
        return this.shippingProvider.calculateMultiCourierCost(originId, destinationId, weight, couriers);
    }
};
exports.ShippingService = ShippingService;
exports.ShippingService = ShippingService = ShippingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(shipping_constants_1.SHIPPING_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], ShippingService);


/***/ }),
/* 152 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShippingController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(13);
const shipping_service_1 = __webpack_require__(151);
const search_destination_dto_1 = __webpack_require__(153);
const calculate_shipping_cost_dto_1 = __webpack_require__(154);
const shipping_options_request_dto_1 = __webpack_require__(156);
let ShippingController = class ShippingController {
    shippingService;
    constructor(shippingService) {
        this.shippingService = shippingService;
    }
    async searchDestination(query) {
        return this.shippingService.searchDestination(query.search);
    }
    async getShippingOptions(dto) {
        const originId = dto.originId || 153;
        const weight = dto.weight || 1000;
        const couriers = dto.couriers || ['jne', 'pos', 'tiki', 'sicepat', 'jnt'];
        return this.shippingService.calculateMultiCourierOptions(originId, dto.destinationId, weight, couriers);
    }
    async calculateCost(dto) {
        return this.shippingService.calculateShippingCost(dto);
    }
};
exports.ShippingController = ShippingController;
__decorate([
    (0, common_1.Get)('destination'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cari lokasi destinasi pengiriman',
        description: 'Mencari daftar provinsi, kota/kabupaten, dan kecamatan berdasarkan kata kunci pencarian.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: true,
        description: 'Kata kunci lokasi (misal: Pekanbaru)',
        example: 'Pekanbaru',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daftar lokasi destinasi berhasil ditemukan.',
        example: [
            {
                id: 153,
                province: 'Riau',
                city: 'Kota Pekanbaru',
                district: 'Pekanbaru Kota',
                subdistrict: 'Pekanbaru Kota',
            },
        ],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof search_destination_dto_1.SearchDestinationDto !== "undefined" && search_destination_dto_1.SearchDestinationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "searchDestination", null);
__decorate([
    (0, common_1.Post)('options'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Dapatkan opsi pengiriman multi-kurir terkelompok (Tokopedia Style)',
        description: 'Mengambil daftar opsi pengiriman yang dikelompokkan berdasarkan kurir (JNE, SiCepat, J&T, dll) beserta rekomendasi layanan dan harga.',
    }),
    (0, swagger_1.ApiBody)({ type: shipping_options_request_dto_1.ShippingOptionsRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daftar opsi pengiriman multi-kurir terkelompok berhasil didapatkan.',
        example: [
            {
                courierCode: 'JNE',
                courierName: 'JNE Express',
                services: [
                    {
                        serviceCode: 'REG',
                        serviceName: 'Layanan Reguler',
                        etd: '2-3',
                        cost: 18000,
                        isRecommended: true,
                        isCheapest: false,
                    },
                    {
                        serviceCode: 'YES',
                        serviceName: 'Yakin Esok Sampai',
                        etd: '1',
                        cost: 28000,
                        isRecommended: false,
                        isCheapest: false,
                    },
                ],
            },
        ],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof shipping_options_request_dto_1.ShippingOptionsRequestDto !== "undefined" && shipping_options_request_dto_1.ShippingOptionsRequestDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "getShippingOptions", null);
__decorate([
    (0, common_1.Post)('cost'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Hitung tarif ongkos kirim (Single Courier)',
        description: 'Menghitung estimasi tarif dan durasi pengiriman untuk 1 ekspedisi spesifik.',
    }),
    (0, swagger_1.ApiBody)({ type: calculate_shipping_cost_dto_1.CalculateShippingCostDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daftar pilihan layanan dan harga ongkir berhasil dihitung.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof calculate_shipping_cost_dto_1.CalculateShippingCostDto !== "undefined" && calculate_shipping_cost_dto_1.CalculateShippingCostDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ShippingController.prototype, "calculateCost", null);
exports.ShippingController = ShippingController = __decorate([
    (0, swagger_1.ApiTags)('Shipping'),
    (0, common_1.Controller)('shipping'),
    __metadata("design:paramtypes", [typeof (_a = typeof shipping_service_1.ShippingService !== "undefined" && shipping_service_1.ShippingService) === "function" ? _a : Object])
], ShippingController);


/***/ }),
/* 153 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchDestinationDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
class SearchDestinationDto {
    search;
}
exports.SearchDestinationDto = SearchDestinationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Pekanbaru',
        description: 'Kata kunci pencarian nama kota, kabupaten, atau kecamatan',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], SearchDestinationDto.prototype, "search", void 0);


/***/ }),
/* 154 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CalculateShippingCostDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
const shipping_courier_enum_1 = __webpack_require__(155);
class CalculateShippingCostDto {
    originId;
    destinationId;
    weight;
    courier;
}
exports.CalculateShippingCostDto = CalculateShippingCostDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 153,
        description: 'ID lokasi/kota/subdistrict asal pengirim',
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CalculateShippingCostDto.prototype, "originId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 54,
        description: 'ID lokasi/kota/subdistrict tujuan penerima',
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CalculateShippingCostDto.prototype, "destinationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1200,
        description: 'Total berat barang dalam gram (integer > 0)',
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CalculateShippingCostDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: shipping_courier_enum_1.ShippingCourier,
        example: shipping_courier_enum_1.ShippingCourier.JNE,
        description: 'Kode ekspedisi pengiriman',
    }),
    (0, class_validator_1.IsEnum)(shipping_courier_enum_1.ShippingCourier),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof shipping_courier_enum_1.ShippingCourier !== "undefined" && shipping_courier_enum_1.ShippingCourier) === "function" ? _a : Object)
], CalculateShippingCostDto.prototype, "courier", void 0);


/***/ }),
/* 155 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShippingCourier = void 0;
var ShippingCourier;
(function (ShippingCourier) {
    ShippingCourier["JNE"] = "jne";
    ShippingCourier["POS"] = "pos";
    ShippingCourier["TIKI"] = "tiki";
    ShippingCourier["SICEPAT"] = "sicepat";
    ShippingCourier["JNT"] = "jnt";
    ShippingCourier["ANTERAJA"] = "anteraja";
    ShippingCourier["WAHANA"] = "wahana";
    ShippingCourier["NINJA"] = "ninja";
    ShippingCourier["LION"] = "lion";
    ShippingCourier["IDEXPRESS"] = "idexpress";
})(ShippingCourier || (exports.ShippingCourier = ShippingCourier = {}));


/***/ }),
/* 156 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShippingOptionsRequestDto = void 0;
const swagger_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(14);
const shipping_courier_enum_1 = __webpack_require__(155);
class ShippingOptionsRequestDto {
    originId;
    destinationId;
    weight;
    couriers;
}
exports.ShippingOptionsRequestDto = ShippingOptionsRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 153,
        default: 153,
        description: 'ID lokasi/kota asal pengirim (default: kota toko/gudang)',
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ShippingOptionsRequestDto.prototype, "originId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 54,
        description: 'ID lokasi/subdistrict/kota tujuan pembeli',
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ShippingOptionsRequestDto.prototype, "destinationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1200,
        default: 1000,
        description: 'Total berat barang dalam gram (integer > 0)',
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ShippingOptionsRequestDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: shipping_courier_enum_1.ShippingCourier,
        isArray: true,
        example: [shipping_courier_enum_1.ShippingCourier.JNE, shipping_courier_enum_1.ShippingCourier.SICEPAT, shipping_courier_enum_1.ShippingCourier.JNT],
        description: 'Daftar kurir ekspedisi yang ingin diperiksa',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(shipping_courier_enum_1.ShippingCourier, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ShippingOptionsRequestDto.prototype, "couriers", void 0);


/***/ }),
/* 157 */
/***/ ((module) => {

module.exports = require("express");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;