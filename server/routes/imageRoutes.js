const express = require('express');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const multer = require('multer'); 
const {BurgerSchema,FriesSchema,ColdSchema} = require('../models/ImageSchema');
const router = express.Router();

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');


router.post('/burgerimage', upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const { id,name,about,price } = req.body;

    const uploadResponse = await cloudinary.uploader.upload_stream(
      { folder: 'your-folder-name' },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Failed to upload image to Cloudinary',
            error: error.message
          });
        }

        const newImage = new BurgerSchema({
          imageUrl: result.secure_url,
          id: id,
          name:name,
          about:about,
          price:price
        });

        newImage.save().then(() => {
          res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
              url: result.secure_url,
              id: id,
              name:name,
              about:about,
              price:price
            }
          });
        }).catch(err => {
          res.status(500).json({
            success: false,
            message: 'Failed to save image to the database',
            error: err.message
          });
        });
      }
    );

    uploadResponse.end(req.file.buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

router.post('/friesimage', upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const { id,name,about,price } = req.body;

    const uploadResponse = await cloudinary.uploader.upload_stream(
      { folder: 'your-folder-name' },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Failed to upload image to Cloudinary',
            error: error.message
          });
        }

        const newImage = new FriesSchema({
          imageUrl: result.secure_url,
          id: id,
          name:name,
          about:about,
          price:price
        });

        newImage.save().then(() => {
          res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
              url: result.secure_url,
              id: id,
              name:name,
              about:about,
              price:price
            }
          });
        }).catch(err => {
          res.status(500).json({
            success: false,
            message: 'Failed to save image to the database',
            error: err.message
          });
        });
      }
    );

    uploadResponse.end(req.file.buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

router.post('/coldimage', upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const { id,name,about,price } = req.body;

    const uploadResponse = await cloudinary.uploader.upload_stream(
      { folder: 'your-folder-name' },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Failed to upload image to Cloudinary',
            error: error.message
          });
        }

        const newImage = new ColdSchema({
          imageUrl: result.secure_url,
          id: id,
          name:name,
          about:about,
          price:price
        });

        newImage.save().then(() => {
          res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
              url: result.secure_url,
              id: id,
              name:name,
              about:about,
              price:price
            }
          });
        }).catch(err => {
          res.status(500).json({
            success: false,
            message: 'Failed to save image to the database',
            error: err.message
          });
        });
      }
    );

    uploadResponse.end(req.file.buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});


router.get('/image', async (req, res) => {
  try {
    const burgerimages = await BurgerSchema.find();
    const friesimages = await FriesSchema.find();
    const coldimages = await ColdSchema.find();
    if (!burgerimages.length && !friesimages.length && !coldimages.length) {
      return res.status(404).json({
        success: false,
        message: 'No images found'
      });
    }

    res.json({
      success: true,
      message: 'Images retrieved successfully',
      burgerImages: burgerimages, 
      friesImages: friesimages,  
      coldImages: coldimages      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve images',
      error: error.message
    });
  }
});

module.exports = router;
