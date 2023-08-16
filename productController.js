const Product = require('../models/Products');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send('Error fetching products.');
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found.');
    res.send(product);
  } catch (error) {
    res.status(500).send('Error fetching product.');
  }
};

// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, price, category } = req.body;
//     const images = req.files.map(file => file.path); // Assuming you're using multer for file uploads

//     const newProduct = new Product({ name, description, price, category, images });
//     await newProduct.save();

//     res.status(201).send('Product Successfully Added!');
//   } catch (error) {
//     res.status(500).send('Error creating product.');
//   }
// };
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const images = []; // Initialize an array to store Cloudinary URLs

    // Upload images to Cloudinary and get their URLs
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      images.push(result.secure_url);
    }

    const newProduct = new Product({ name, description, price, category, images });
    await newProduct.save();

    res.status(201).send('Product Successfully Added!');
  } catch (error) {
    res.status(500).send('Error creating product.');
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, images } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, images },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).send('Product not found.');
    res.send(updatedProduct);
  } catch (error) {
    res.status(500).send('Error updating product.');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).send('Product not found.');
    res.send('Product deleted successfully.');
  } catch (error) {
    res.status(500).send('Error deleting product.');
  }
};