"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = exports.swaggerOptions = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerOptions = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Ecommerce Backend API",
            version: "1.0.0",
            description: "API documentation for the ecommerce backend using TypeScript, Express, and MongoDB",
        },
        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Local development server",
            },
        ],
    },
    // 👇 VERY IMPORTANT — add your route file paths here
    apis: ["./src/routes/*.ts"],
});
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerOptions));
};
exports.setupSwagger = setupSwagger;
