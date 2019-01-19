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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const User_1 = require("../entity/User");
const userController = {};
userController.listAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Get users from database
    const userRepository = typeorm_1.getRepository(User_1.User);
    const users = yield userRepository.find({
        //We dont want to send the passwords on response
        select: ["id", "username", "role"]
    });
    //Send the users object
    res.send(users);
});
userController.getOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Get the ID from the url
    const id = req.params.id;
    //Get the user from database
    const userRepository = typeorm_1.getRepository(User_1.User);
    const user = yield userRepository.findOne(id, {
        //We dont want to send the passwords on response
        select: ["id", "username", "role"]
    });
    //Check if the user exists
    if (user)
        res.send(user);
    //If not, send a not found message
    else
        res.status(404).send("User not found");
});
userController.newUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Get parameters from the body
    let { username, password, role } = req.body;
    let user = new User_1.User();
    user.username = username;
    user.password = password;
    user.role = role;
    //Validade if the parameters are ok
    const errors = yield class_validator_1.validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    //Hash the password, to securely store on DB
    user.password = bcryptjs_1.default.hashSync(password, 8);
    //Try to save, if not the username is already in use
    const userRepository = typeorm_1.getRepository(User_1.User);
    try {
        yield userRepository.save(user);
    }
    catch (e) {
        res.status(409).send("username already in use");
        return;
    }
    //If all ok, send 201 response
    res.status(201).send("User created");
});
userController.editUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Get the ID from the url
    const id = req.params.id;
    //Get values from the body
    const { username, role } = req.body;
    //Try to find user on database
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = yield userRepository.findOneOrFail(id);
    }
    catch (error) {
        //If not found, send a 404 response
        res.status(404).send("User not found");
        return;
    }
    //Validate the new values on model
    user.username = username;
    user.role = role;
    const errors = yield class_validator_1.validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    //Try to safe, if fails, that means username already in use
    try {
        yield userRepository.save(user);
    }
    catch (e) {
        res.status(409).send("username already in use");
        return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
});
userController.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //Get the ID from the url
    const id = req.params.id;
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = yield userRepository.findOneOrFail(id);
    }
    catch (error) {
        res.status(404).send("User not found");
        return;
    }
    userRepository.delete(id);
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
});
exports.default = userController;
