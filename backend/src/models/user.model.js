import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be 6 characters long."],
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        products: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
UserSchema.pre("save", async function (next) {
  //Don't use arrow function as arrow function doesn't give access to 'this' keyword.
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparepassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
