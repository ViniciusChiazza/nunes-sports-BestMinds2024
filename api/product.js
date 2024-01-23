const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: [true, 'O código do produto é obrigatório.'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'O nome do produto é obrigatório.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A descrição do produto é obrigatória.'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'O preço do produto é obrigatório.'],
    min: [0, 'O preço do produto não pode ser negativo.'],
  },
}, {
  timestamps: true, 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
