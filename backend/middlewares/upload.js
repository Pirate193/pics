const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'pics',
        allowed_formats:['jpg','jpeg','png','gif','webp'],
        tranformation:[{width:1000,height:1000,crop:'limit'}]
    }
});

const upload = multer({
    storage:storage,
    limits:{fileSize:5*1024*1024} // 5mb limit
});
module.exports = upload;