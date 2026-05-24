import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { UserService } from "../services/Userservice.js";

const userService = new UserService();

export class UserController {
  async index(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    return res.json(users);
  }

  async store(req: Request, res: Response, next: NextFunction) {
    const { name, email, age } = req.body;
    try {
      const user = await userService.createUser(name, email, age);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}