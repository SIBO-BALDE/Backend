import mongoose from "mongoose";

const orderSchema=new mongoose.Schema(
    {
      orderItems: [
        {   
        slug:{type:String,required:true},
        Name: {type:String,required:true},
        quantity: {type:Number,required:true},
        Image: {type:String,required:true},
        prix: {type:Number,required:true},
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true,

        },
       },

      ],
      shippingAdress: {
        fullName:{type:String, required:true},
        adress: {type:String, required:true},
        city: {type:String, required:true},
        postalCode: {type:String, required:true},
        country: {type:String, required:true},
     
      },
      paymentMethod : {type: String, required: true},
      paymentResult: {
        id: String,
        status: String,
        update_time:String,
        email_adress: String,
      },
        itemsPrix: {type:Number, required:true},
        shippingPrix: {type:Number, required:true},
        taxPrix: {type:Number, required:true},
        totalPrix: {type:Number, required:true},
        user : {type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
        isPaid: {type:Boolean, default:false},
        paidAt: {type:Date},
        isDelivered: {type:Boolean, default:false},
        deliveredAt: {type:Date},



        },
    
    {
        timestamps:true
        }
    );
    const Order = mongoose.model('Order', orderSchema);
 export default Order;