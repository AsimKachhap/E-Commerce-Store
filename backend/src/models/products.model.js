import mongoose from "mongoose";

const ProductSchecma = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please plovide Products name."],
    },
    description: {
      type: String,
      required: [true, "Please add description to your product"],
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Image url not provided"],
    },

    category: [
      {
        type: String,
        enum: ["Electronics", "Clothes", "Books", "Home", "Others"],
        required: true,
        default: "Others",
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Prodeuct", ProductSchecma);
