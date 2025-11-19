"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
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
router.get("/getProduct/:id", product_controller_1.getProduct);
exports.default = router;
