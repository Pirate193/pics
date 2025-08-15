const express = require('express');
const { createBoard, getUserBoards, getBoardById, addPinToBoard } = require('../controllers/boardController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.route('/')
      .get(protect,getUserBoards)
      .post(protect,createBoard);

router.route('/:id')
      .get(getBoardById);

router.put('/:id/pins',protect,addPinToBoard);

module.exports = router;