const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - restaurantId
 *         - customerId
 *         - amount
 *         - status
 *         - dishes
 *       properties:
 *         restaurantId:
 *           type: string
 *           description: Restaurant (User) ID
 *         customerId:
 *           type: string
 *           description: Customer (User) ID
 *         amount:
 *           type: number
 *           description: Total order amount
 *         status:
 *           type: string
 *           enum: [Pending, Paid, Preparing, Completed, Cancelled]
 *           description: Order status
 *         dishes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dish:
 *                 type: string
 *                 description: Dish ID
 *               quantity:
 *                 type: number
 *                 description: Dish quantity
 *         date:
 *           type: string
 *           format: date-time
 *           description: Order date
 *         paymentOption:
 *           type: string
 *           enum: [restaurant, courier]
 *           description: Payment option
 *         deliveryAddress:
 *           type: string
 *           description: Delivery address
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Review comment
 *               image:
 *                 type: string
 *                 description: Review image
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Review date
 */
const OrderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Preparing', 'Completed', 'Cancelled'], 
  default: 'Pending' 
},
  dishes: [{
  dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  quantity: { type: Number, required: true }
}],
  date: { type: Date, default: Date.now },
  paymentOption: { type: String, enum: ['restaurant', 'courier'], required: false },
  deliveryAddress: { type: String, required: false },
  reviews: [{
    comment: { type: String, required: false },
    image: { type: String, required: false },
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Order', OrderSchema);