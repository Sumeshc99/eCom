import { Router } from "express";
import { addProduct } from "../controllers/admin.controller";

const router = Router();

/**
 * @swagger
 * /admin/addProduct:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, image, price, rating, description]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Samsung Galaxy S24"
 *               image:
 *                 type: string
 *                 example: "https://example.com/s24.jpg"
 *               price:
 *                 type: number
 *                 example: 69999
 *               rating:
 *                 type: string
 *                 example: "4.7"
 *               description:
 *                 type: string
 *                 example: "Flagship phone with advanced AI features"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Product already exists
 *       500:
 *         description: Internal server error
 */
router.post("/addProduct", addProduct);

export default router;
