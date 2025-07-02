var mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - nif
 *         - password
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's unique email address
 *         nif:
 *           type: integer
 *           description: 9-digit unique identifier (NIF)
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         role:
 *           type: string
 *           enum: [restaurant, customer, admin]
 *           description: User's role in the system
 *         restaurantName:
 *           type: string
 *           description: Restaurant name (required if role is restaurant)
 *         address:
 *           type: string
 *           description: Restaurant address (required if role is restaurant)
 *         phone:
 *           type: string
 *           description: Restaurant phone number (required if role is restaurant)
 *         pricePerPerson:
 *           type: number
 *           description: Average price per person (required if role is restaurant)
 *         image:
 *           type: string
 *           description: Restaurant image URL (required if role is restaurant)
 *         status:
 *           type: string
 *           enum: [in validation, valid]
 *           description: Restaurant status (default is 'in validation' for restaurants)
 *         deliveryDistance:
 *           type: number
 *           minimum: 1
 *           description: Maximum delivery distance in km (required if role is restaurant)
 */

var UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    nif: { 
        type: Number,
        unique: true,
        required: true, 
        validate: {
            validator: function(value) {
                return /^\d{9}$/.test(value.toString());
            },
            message: 'Nif should have 9 digits.'
        }
    },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['restaurant', 'customer', 'admin'], 
        required: true 
    },
    restaurantName: { type: String, required: function() { return this.role === 'restaurant'; } },
    address: { type: String, required: function() { return this.role === 'restaurant'; } },
    phone: { type: String, required: function() { return this.role === 'restaurant'; } },
    pricePerPerson: { type: Number, required: function() { return this.role === 'restaurant'; } },
    image: { type: String, required: function() { return this.role === 'restaurant'; } },
    status: { 
        type: String, 
        enum: ['in validation', 'valid'], 
        default: function() { return this.role === 'restaurant' ? 'in validation' : 'valid'; }
    },
    deliveryDistance: { 
        type: Number, 
        required: function() { return this.role === 'restaurant'; },
        min: 1
    }
});

module.exports = mongoose.model('User', UserSchema);