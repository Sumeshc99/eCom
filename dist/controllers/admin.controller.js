"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const createProduct = async (req, res) => {
    try {
        const { name, image, price, rating, description } = req.body;
        if (!name || !image || !price || !rating || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const existingProduct = await product_model_1.default.findOne({ name });
        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: "Product already exists",
            });
        }
        const newUser = await product_model_1.default.create({
            name,
            image,
            price,
            rating,
            description,
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                name,
                image,
                price,
                rating,
                description,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createProduct = createProduct;
