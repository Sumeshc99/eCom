import { Router } from "express";
import adminRoute from "./admin.routes";
import authRoutes from "./auth.routes";
import productRoute from "./product.routes";

const router = Router();

router.use("/admin", adminRoute);
router.use("/auth", authRoutes);
router.use("/product", productRoute);

export default router;
