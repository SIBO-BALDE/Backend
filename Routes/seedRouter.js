import express from 'express';
import Product from '../Models/ProductModel.js';
import data from '../data.js';
import User from '../Models/UserModel.js';

const seedRouter = express.Router();
seedRouter.get('/',async (req,res) => {
await Product.removeAllListeners({});
const createdProducts = await Product.insertMany(data.products);
await User.removeAllListeners({});
const createdUsers = await User.insertMany(data.users);

res.send({createdProducts, createdUsers});
});
export default seedRouter;