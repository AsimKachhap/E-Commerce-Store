import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body; // ************* Don't forget to handle the case when req comes without productId. Currentl null is getting pushe into the cartItems []. ********** //
    const user = req.user;

    const customer = await User.findById(user.userId);
    console.log("Customer:", customer);

    const existingItem = customer.cartItems.find(
      (item) => item?.id === productId
    ); // .find() is a method avilable on Array not to be confused with db.collection.find({})
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      customer.cartItems.push(productId);
    }

    await customer.save();
    res.status(200).json({
      message: "Cart updated Successfully.",
      data: customer.cartItems,
    });
  } catch (error) {
    console.log(
      "Something went wrong while adding item to cart.",
      error.message
    );
    res.status(500).json({
      messagge: "Something went wrong on server while adding item to the cart.",
      error: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  const { id: productId } = req.params; // Renaming while destructuring const {oldname: newname} = req.body
  const { quantity } = req.body;
  const userId = req.user.userId;
  const user = await User.findById(userId);
  const existingItem = user.cartItems.find((item) => item?.id === productId);

  try {
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item?.id !== productId
        );
        await user.save();
        return res.status(200).json({
          message: "Successfully Updated Cart Items",
          data: user.cartItems,
        });
      }
      existingItem.quantity = quantity;
      await user.save();
      return res.status(200).json({
        message: "Successfully Updated Cart Items",
        data: user.cartItems,
      });
    } else {
      return res.status(400).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.log(
      "Something went wrong while adding item to cart.",
      error.message
    );
    res.status(500).json({
      messagge: "Something went wrong on server while adding item to the cart.",
      error: error.message,
    });
  }
};
