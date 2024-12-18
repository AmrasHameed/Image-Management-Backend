const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { uploadSingle, uploadMultiple } = require('../middlewares/multer');
const {
  getUserImages,
  uploadImages,
  editImage,
  deleteImage,
  rearrangeImages,
} = require('../controllers/imageController');

const router = express.Router();

router.get('/data', verifyToken, getUserImages);
router.post('/upload', verifyToken, uploadMultiple, uploadImages);
router.put('/edit/:id', verifyToken, uploadSingle, editImage);
router.delete('/delete/:id', verifyToken, deleteImage);
router.post('/rearrange', verifyToken, rearrangeImages);

module.exports = router;
