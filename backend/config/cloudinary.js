const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const cloudinaryUpload = async(req,res,next)=>{
   //skip if no files
   if(!req.files||Object.keys(req.files).length===0){
    return next();
   }
   try{
    //
    for (const fieldName in req.files){
        const file = req.files[fieldName];
        //convert file to data uri
        const dataUri = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
        //upload to cloudinary
        const result = await cloudinary.uploader.upload(dataUri,{
            folder:`Home/${fieldName}`,
            allowed_formats:['jpg','jpeg','png','gif','webp'],
            transformation:{width:1000,height:1000,crop:'limit'}
        });
        req.cloudinary = req.cloudinary || {};
        req.cloudinary[fieldName] = {
            url: result.secure_url,
            public_id:result.public_id
        };
    }
    next();
   }catch(err){
    console.error('cloudinary upload error:',error);
    res.status(500).json({message:'file upload failed'})
   }
}

module.exports={cloudinaryUpload};
module.exports = cloudinary;
