import mongoose, { Schema } from "mongoose"

const linkSchema=new Schema({
shortUrl:{
    type:String,
     unique: true,
     required:true

},
originalUrl:{
    type:String,
    required:true
},
expiredAt:{
   
      type: Date,
    default: () => Date.now() + 30*24*60*60*1000, // 30 days expiry
    index: { expires: 0 }   //expires: 0 ka matlab hai → document ko delete kar do exactly at expiry time pe
},
 
},{timestamps:true})

export const Link=mongoose.model("Link",linkSchema)