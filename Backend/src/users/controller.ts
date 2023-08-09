import { Prisma } from "@prisma/client";
import { UsersService as user } from "./service";

export class UsersController {
  static async create(req: any, res: any) {
    try {
      const data = await user.create(req.body);
      res.status(201).json(data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async findAll(req: any, res: any) {
    try {
      const data = await user.findAll();
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async findOne(req: any, res: any) {
    try {
      const data = await user.findOne(req.params.email);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async update(req: any, res: any) {
    try {
      const data = await user.update(req.params.email, req.body);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async remove(req: any, res: any) {
    try {
      const data = await user.remove(req.params.email);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
