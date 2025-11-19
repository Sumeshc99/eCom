import { Router } from "express";
import { getProduct } from "../controllers/product.controller";

const router = Router();

/**
 * @swagger
 * /product/getProduct/{id}:
 *   get:
 *     tags: [Admin - Product]
 *     summary: Get product details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product fetched
 *       401:
 *         description: Unauthorized or invalid token
 *       404:
 *         description: Product not found
 */

router.get("/getProduct/:id", getProduct);

export default router;
