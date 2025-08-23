import { nanoid } from "nanoid";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Link } from "../models/links.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import validUrl from "../utils/validUrl.js";



const link=asyncHandler(async(req, res)=>{
  const {originalUrl} = req.body;
  if(!originalUrl){
    throw new ApiError(401,"link is required");
  }
  if(!validUrl(originalUrl)){
    throw new ApiError(400,"link is not valid");
  }
  const shortUrl=nanoid(8);
  const link=await Link.create({
    originalUrl,
    shortUrl,
    expiredAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days expiry
  })

  return res
  .status(200)
  .json(new ApiResponse(200,{
            shortUrl: `${req.protocol}://${req.get("host")}/${link.shortUrl}`, // full URL
        originalUrl: link.originalUrl,
        expiredAt: link.expiredAt
  },"link shortened successfully"))

})
const redirect=asyncHandler(async(req,res)=>{
    const {shortUrl}=req.params;
    const link=await Link.findOne({shortUrl});
    if(!link){
        throw new ApiError(404,"link not found");
    }
    return res.redirect(link.originalUrl);
})

export { link, redirect }