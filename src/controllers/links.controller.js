import { nanoid } from "nanoid";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Link } from "../models/links.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import validUrl from "../utils/validUrl.js";



const link = asyncHandler(async (req, res) => {
  let { originalUrl } = req.body; // use 'let' so we can modify it

  if (!originalUrl) {
    throw new ApiError(401, "link is required");
  }

  if (!originalUrl.startsWith('http')) {
    originalUrl = `https://${originalUrl}`;
  }

  if (!validUrl(originalUrl)) {
    throw new ApiError(400, "link is not valid");
  }

  const shortCode = nanoid(8);
  
  const createdLink = await Link.create({
    originalUrl,
    shortUrl: shortCode,
    expiredAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  const baseUrl = process.env.DOMAIN_URL || `${req.protocol}://${req.get("host")}`;
  
  //  will produce: https://your-app.onrender.com/j-yKCXWF
  const fullShortUrl = `${baseUrl}/${createdLink.shortUrl}`;

  return res
    .status(200)
    .json(new ApiResponse(200, {
        shortUrl: fullShortUrl, 
        originalUrl: createdLink.originalUrl,
        expiredAt: createdLink.expiredAt
    }, "link shortened successfully"));
});
const redirect=asyncHandler(async(req,res)=>{
    const {shortUrl}=req.params;
    const link=await Link.findOne({shortUrl});
    if(!link){
        throw new ApiError(404,"link not found");
    }
    return res.redirect(link.originalUrl);
})

export { link, redirect }