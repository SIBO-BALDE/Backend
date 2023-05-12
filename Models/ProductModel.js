//create mongoose model
import mongoose from "mongoose";

const productSchema=new mongoose.Schema(
    {
Name: {type:String,required:true,unique:true},
slug: {type:String,required:true,unique:true},
Image: {type:String,required:true},
brand: {type:String,required:true},
category: {type:String,required:true},
description: {type:String,required:true},
prix: {type:Number,required:true},
countInStock: {type:Number,required:true},
rating: {type:Number,required:true},
numReviews: {type:Number,required:true},
    },

    {
    timestamps:true
    }
);

const Product = mongoose.model('Product', productSchema);

 export default Product;
 