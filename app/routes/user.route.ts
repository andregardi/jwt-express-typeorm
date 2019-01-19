import { Router } from "express";
import userController from "../controllers/user.controller";
import { checkJwt } from "../midlewares/checkJwt";
import { checkRole } from "../midlewares/checkRole";

const router = Router();

//Get all users
router.get("/", [checkJwt, checkRole(["ADMIN"])], userController.listAll);

// Get one user
router.get("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], userController.getOne);

//Create a new user
router.post("/", [checkJwt, checkRole(["ADMIN"])], userController.newUser);

//Edit one user
router.post("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], userController.editUser);

//Delete one user
router.delete("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], userController.deleteUser);

export default router;
