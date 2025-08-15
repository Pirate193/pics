const express = require('express');
const { createPin, getPins, getPinsById, likePin, savePin } = require('../controllers/pinController.js');
const { protect } = require('../middlewares/authMiddleware.js');
const {cloudinaryUpload} =require('../middlewares/cloudinary.js')
const {parseForm} =require('../middlewares/formParser.js')
const router = express.Router();

router.route('/')
    .get(getPins)
    .post(protect,parseForm,cloudinaryUpload,createPin);

router.route('/:id')
      .get(getPinsById);

router.put('/:id/like',protect,likePin);
router.put('/:id/save',protect,savePin);

module.exports = router;