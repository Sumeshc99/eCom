import { Request, Response } from "express";
import ProductModal from "../models/product.model";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, image, price, rating, description } = req.body;

    if (!name || !image || !price || !rating || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingProduct = await ProductModal.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    const newUser = await ProductModal.create({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
