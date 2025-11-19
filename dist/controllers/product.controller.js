"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const product_model_1 = __importDefault(require("../models/product.model"));
const getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const token = req.headers.authorization?.split(" ")[1];
        console.log("qqqqq", productId, token);
        let decoded;
        try {
            if (!token)
                throw new Error("missing");
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized or invalid token",
            });
        }
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getProduct = getProduct;
