"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const User_1 = require("../entity/User");
const config_1 = __importDefault(require("../config/config"));
const authController = {};
authController.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
        res.status(400).send();
    }
    //Get user from database
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = yield userRepository.findOneOrFail({ where: { username } });
    }
    catch (error) {
        res.status(401).send();
    }
    //Check if encrypted password match
    const passwordIsValid = bcryptjs_1.default.compareSync(password, user.password);
    if (!passwordIsValid) {
        res.status(401).send();
        return;
    }
    //Sing JWT, valid for 1 hour
    const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, config_1.default.jwtSecret, { expiresIn: "1h" });
    //Send the jwt in the response
    res.send(token);
});
authController.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;
    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
        res.status(400).send();
    }
    //Get user from the database
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = yield userRepository.findOneOrFail(id);
    }
    catch (id) {
        res.status(401).send();
    }
    //Check if old password matchs
    const passwordIsValid = bcryptjs_1.default.compareSync(oldPassword, user.password);
    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = yield class_validator_1.validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    if (passwordIsValid) {
        //Hash the new password and save
        user.password = bcryptjs_1.default.hashSync(newPassword, 8);
        userRepository.save(user);
        res.status(204).send();
    }
    else {
        res.status(400).send("Wrong password");
    }
});
exports.default = authController;
