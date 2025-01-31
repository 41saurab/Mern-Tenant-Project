import express from "express";
import { checkLogin } from "../../middlewares/auth-middleware.js";
import { bodyValidator } from "../../middlewares/requestValidator-middleware.js";
import { reviewCreateDTO } from "./landlord-review-request.js";
import { reviewCtrl } from "./landlord-review-controller.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", checkLogin, bodyValidator(reviewCreateDTO), reviewCtrl.createReview);
reviewRouter.get("/avg-ratings", checkLogin, reviewCtrl.getLandlordRatings);
reviewRouter.get("/:slug", checkLogin, reviewCtrl.getReviewsBySlug);

export default reviewRouter;
