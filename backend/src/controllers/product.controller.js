import Product from "../models/products.model.js";
import { redis } from "../utils/redis.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    res.status(200).json({
      message: "Successfully fetched all products",
      data: allProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong duringg fetching all products.",
      error: error.msg,
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await redis.get("featuredProducts");

    if (featuredProducts) {
      res.status(200).json(JSON.parse(featuredProducts)); // Redis stores objects in plain string
    } else {
      try {
        const featuredProducts = await Product.find({
          isFeatured: true,
        }).lean();

        if (!featuredProducts) {
          res.status(404).jsoon({ message: "No Featured Prooducts found." });
        }
        // set Featured Products in Redis for Feature use

        await redis.set("featuredProducts", JSON.stringify(featuredProducts));
        res.status(200).json(featuredProducts);
      } catch (error) {
        res.status(500).json({
          essage:
            "Something went wrong while fetching Featured Products from from DB",
        });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wron while getting Featured Products" });
  }
};

// ADDING A PRODUCT

export const addProduct = async (req, res) => {
  const { name, description, price, category, featured } = req.body;
  try {
    if (req.file) {
      const localFilePath = req.file.path;
      const uploadResult = await uploadOnCloudinary(localFilePath);
      const imageUrl = uploadResult.url;
      if (imageUrl) {
        try {
          const product = await Product.create({
            name: name,
            description: description,
            price: Number(price),
            image: imageUrl,
            category: category,
            featured: Boolean(featured),
          });
          console.log(product);
          res
            .status(201)
            .json({ message: "Product saved Successfully", data: product });
        } catch (error) {
          res.status(400).json({
            message: "Failed to save Product to Database.",
            error: error.message,
          });
        }
      } else {
        res
          .status(400)
          .json({ message: "Something went wrong while uploading Image." });
        console.log("Didn't recieve an url from Cloudinary.");
      }
    } else {
      console.log("Multer didn't return any image.");
      res.status(404).json({ message: "Could not find your image." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong oon server",
      error: error.message,
    });
  }
};
