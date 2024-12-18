const User = require('../models/User');
const path = require('path');
const fs = require('fs');

exports.getUserImages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.uploadImages = async (req, res) => {
  const { titles } = req.body;
  const files = req.files;
  try {
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newImages = files.map((file, index) => ({
      path: file.path,
      title: titles[index] || `Untitled ${index + 1}`,
      order: user.images.length + index,
    }));

    user.images.push(...newImages);
    await user.save();

    res
      .status(201)
      .json({ message: 'Images uploaded successfully', images: newImages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.editImage = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const file = req.file;

  try {
    const user = await User.findById(req.user.id);
    const image = user.images.id(id);

    if (!image) return res.status(404).json({ message: 'Image not found' });

    if (file) image.path = file.path;
    if (title) image.title = title;

    await user.save();
    res.json({ message: 'Image updated successfully', image });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(req.user.id);
    const image = user.images.id(id);
    if (!image) {
      console.log(`Image with ID ${id} not found.`);
      return res.status(404).json({ message: 'Image not found' });
    }
    if (!image.path) {
      return res.status(400).json({ message: 'Image path is missing' });
    }
    const imagePath = path.join(__dirname, '..', image.path);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err.message}`);
        return res
          .status(500)
          .json({ message: 'Failed to delete file from server' });
      }
      console.log(`File ${imagePath} deleted successfully.`);
    });
    user.images = user.images.filter((img) => img.id !== id);
    await user.save();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.rearrangeImages = async (req, res) => {
  const { order } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: 'Invalid order array' });
    }
    const imagesMap = new Map();
    user.images.forEach((img) => imagesMap.set(img._id.toString(), img));
    const updatedImages = order.map((id, index) => {
      const image = imagesMap.get(id);
      if (!image) {
        throw new Error(`Image with ID ${id} not found`);
      }
      image.order = index;
      return image;
    });
    user.images.sort((a, b) => a.order - b.order);
    await user.save();
    res.json({
      message: 'Images rearranged successfully',
      images: user.images,
    });
  } catch (error) {
    console.error('Rearrange images error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
