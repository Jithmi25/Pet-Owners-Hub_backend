import express from 'express';
import upload from '../middleware/upload.js';

const router = express.Router();

// Single image upload
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }
    
    // Return the image URL/path
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Upload failed', 
      error: error.message 
    });
  }
});

// Multiple images upload (up to 5 images)
router.post('/images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No files uploaded' 
      });
    }
    
    // Return array of image URLs
    const imageUrls = req.files.map(file => ({
      imageUrl: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size
    }));
    
    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: imageUrls,
      count: req.files.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Upload failed', 
      error: error.message 
    });
  }
});

export default router;
