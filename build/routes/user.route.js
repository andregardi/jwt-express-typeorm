"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const checkJwt_1 = require("../midlewares/checkJwt");
const checkRole_1 = require("../midlewares/checkRole");
const router = express_1.Router();
//Get all users
router.get("/", [checkJwt_1.checkJwt, checkRole_1.checkRole(["ADMIN"])], user_controller_1.default.listAll);
// Get one user
router.get("/:id([0-9]+)", [checkJwt_1.checkJwt, checkRole_1.checkRole(["ADMIN"])], user_controller_1.default.getOne);
//Create a new user
router.post("/", [checkJwt_1.checkJwt, checkRole_1.checkRole(["ADMIN"])], user_controller_1.default.newUser);
//Edit one user
router.post("/:id([0-9]+)", [checkJwt_1.checkJwt, checkRole_1.checkRole(["ADMIN"])], user_controller_1.default.editUser);
//Delete one user
router.delete("/:id([0-9]+)", [checkJwt_1.checkJwt, checkRole_1.checkRole(["ADMIN"])], user_controller_1.default.deleteUser);
exports.default = router;
