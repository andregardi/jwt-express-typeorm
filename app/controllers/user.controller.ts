import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

const userController: any = {};

userController.listAll = async (req: Request, res: Response) => {
  //Get users from database
  const userRepository = getRepository(User);
  const users = await userRepository.find({
    //We dont want to send the passwords on response
    select: ["id", "username", "role"]
  });
  //Send the users object
  res.send(users);
};

userController.getOne = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id: number = req.params.id;

  //Get the user from database
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(id, {
    //We dont want to send the passwords on response
    select: ["id", "username", "role"]
  });

  //Check if the user exists
  if (user) res.send(user);
  //If not, send a not found message
  else res.status(404).send("User not found");
};

userController.newUser = async (req: Request, res: Response) => {
  //Get parameters from the body
  let { username, password, role } = req.body;
  let user = new User();
  user.username = username;
  user.password = password;
  user.role = role;

  //Validade if the parameters are ok
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Hash the password, to securely store on DB
  user.password = bcrypt.hashSync(password, 8);

  //Try to save, if not the username is already in use
  const userRepository = getRepository(User);
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("username already in use");
    return;
  }

  //If all ok, send 201 response
  res.status(201).send("User created");
};

userController.editUser = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id = req.params.id;

  //Get values from the body
  const { username, role } = req.body;

  //Try to find user on database
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    //If not found, send a 404 response
    res.status(404).send("User not found");
    return;
  }

  //Validate the new values on model
  user.username = username;
  user.role = role;
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Try to safe, if fails, that means username already in use
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("username already in use");
    return;
  }
  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};

userController.deleteUser = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id = req.params.id;

  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    res.status(404).send("User not found");
    return;
  }
  userRepository.delete(id);

  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};

export default userController;
