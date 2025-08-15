const express = require('express');
const { getUserProfile, followUser, unfollowUser, updateUserProfile } = require('../controllers/userController.js');

const { protect } = require('../middlewares/authMiddleware.js');
const {cloudinaryUpload} =require('../middlewares/cloudinary.js')
const {parseForm} =require('../middlewares/formParser.js')
const router = express.Router();

router.get('/:username',getUserProfile);
router.put('/:id/follow',protect,followUser);
router.put('/:id/unfollow', protect,unfollowUser);
router.put('/profile',protect,parseForm,cloudinaryUpload,updateUserProfile);

module.exports = router;