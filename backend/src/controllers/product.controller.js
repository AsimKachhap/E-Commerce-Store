import Product from "../models/products.model.js";
import { redis } from "../utils/redis.js";
import cloudinary from "../utils/cloudinary.js";
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

// GET FEATURED PRODUCTS

export const getFeaturedProducts = async (req, res) => {
  try {
    const redisFeaturedProducts = await redis.get("featuredProducts"); // Handle the case when redis returns square brackets "[]"

    if (!(redisFeaturedProducts === null)) {
      console.log("You are getting a redis response.");
      res.status(200).json(JSON.parse(redisFeaturedProducts)); // Redis stores objects in plain string
    } else {
      try {
        // FETCH FEATURED PRODUCTS FROM DB AND SET IN REDIS
        const featuredProducts = await Product.find({
          isFeatured: true,
        }).lean();

        console.log("Db:", featuredProducts.length);

        if (featuredProducts.length < 1) {
          return res
            .status(404)
            .json({ message: "No Featured Products found." });
        }

        await redis.set("featuredProducts", JSON.stringify(featuredProducts));
        res.status(200).json(featuredProducts);
      } catch (error) {
        res.status(500).json({
          message:
            "Something went wrong while fetching Featured Products from from DB",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while getting Featured Products",
      error: error.message,
    });
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

// DELETING A PRODUCT

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      // DELETE THE PRODUCT'S IMAGE FROM CLOUDINARY

      const publicId = product.image.split("/").pop(0).split(".")[0];

      const result = await cloudinary.uploader.destroy(
        // Don't forget to handle errors while deleting photos from cloudinary
        `eCommerceStore/${publicId}`
      );

      res.status(200).json({ message: "Product deleted Successfully" });
    } else {
      res.status(404).json({ message: "No such product found." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong on server while deleting a product.",
      error: error.message,
    });
  }
};
