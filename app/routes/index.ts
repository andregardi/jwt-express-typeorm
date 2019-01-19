import express, {Request, Response} from "express";
import auth from "./auth.route";
import user from "./user.route";

const router = express.Router();

router.get("/", function(req: Request, res: Response) {
  res.send("Hello World!");
});

router.use("/auth", auth);
router.use("/user", user);

module.exports = router;
