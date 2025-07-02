/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - name
 *         - image
 *         - createdBy
 *       properties:
 *         name:
 *           type: string
 *           description: Menu's name
 *         image:
 *           type: string
 *           description: Menu image URL
 *         createdBy:
 *           type: string
 *           description: ID of the user (restaurant) who created the menu
 */
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
});

module.exports = mongoose.model('Menu', menuSchema);