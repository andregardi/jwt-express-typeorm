import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

import config from "../config/config";

const authController: any = {};

authController.login = async (req: Request, res: Response) => {
  //Check if username and password are set
  let { username, password } = req.body;
  if (!(username && password)) {
    res.status(400).send();
  }

  //Get user from database
  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail({ where: { username } });
  } catch (error) {
    res.status(401).send();
  }

  //Check if encrypted password match
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    res.status(401).send();
    return;
  }

  //Sing JWT, valid for 1 hour
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    config.jwtSecret,
    { expiresIn: "1h" }
  );

  //Send the jwt in the response
  res.send(token);
};

authController.changePassword = async (req: Request, res: Response) => {
  //Get ID from JWT
  const id = res.locals.jwtPayload.userId;

  //Get parameters from the body
  const { oldPassword, newPassword } = req.body;
  if (!(oldPassword && newPassword)) {
    res.status(400).send();
  }

  //Get user from the database
  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (id) {
    res.status(401).send();
  }

  //Check if old password matchs
  const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);

  //Validate de model (password lenght)
  user.password = newPassword;
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  if (passwordIsValid) {
    //Hash the new password and save
    user.password = bcrypt.hashSync(newPassword, 8);
    userRepository.save(user);

    res.status(204).send();
  } else {
    res.status(400).send("Wrong password");
  }
};

export default authController;
