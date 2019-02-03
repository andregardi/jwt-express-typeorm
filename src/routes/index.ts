import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";

const router = Router();

router.use("/auth", auth);
router.use("/user", user);

module.exports = router;