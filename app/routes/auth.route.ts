import { Router } from "express";
import authController from "../controllers/auth.controller";
import { checkJwt } from "../midlewares/checkJwt";

const router = Router();

//Login route
router.post("/login", authController.login);

//Change my password
router.post("/change-password",[checkJwt], authController.changePassword);

export default router;
