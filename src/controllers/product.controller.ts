import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ProductModel from "../models/product.model";

export const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const token = req.headers.authorization?.split(" ")[1];

    let decoded: any;
    try {
      if (!token) throw new Error("missing");
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
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

    const product = await ProductModel.findById(productId);

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
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, image, price, rating, description } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    let decoded: any;

    try {
      if (!token) throw new Error("missing");
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized or invalid token",
      });
    }

    if (!name || !image || !price || !rating || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
  } catch (error) {}
};
