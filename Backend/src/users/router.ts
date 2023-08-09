import express from "express";
import { UsersController } from "./controller";

const router = express.Router();

router.post("/", UsersController.create);
router.get("/", UsersController.findAll);
router.get("/:id", UsersController.findOne);
router.put("/:id", UsersController.update);
router.delete("/:id", UsersController.remove);

export default router;
