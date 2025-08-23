import { Router } from "express";
import { link, redirect } from "../controllers/links.controller.js";

const router=Router();

router.route('/link').post(link)
router.route('/:shortUrl').get(redirect)
export default router