import mongoose from "mongoose";

const schema = mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  picture: { type: String, required: true },
});

const Product = mongoose.model("Product", schema);

export default Product;
