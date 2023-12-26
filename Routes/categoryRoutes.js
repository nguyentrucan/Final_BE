import express from "express";
import Category from "./../Models/CategoryModel.js";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
const categoryRouter = express.Router();

categoryRouter.get("/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    try {
      const categories = await Category.find({});
      res.json(categories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }));


categoryRouter.post("/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const categoryExist = await Category.findOne({ name });

    if (categoryExist) {
      res.status(400);
      throw new Error("Category name already exist");
    } else {
      //Simple validation
      if (!name)
        return res
          .status(400)
          .json({ success: false, message: "Name is required" });

      try {
        const newCategory = new Category({
          name,
        });
        await newCategory.save();
        res.json({ success: true, message: "Happy learning!", category: newCategory });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  }));


export default categoryRouter;
