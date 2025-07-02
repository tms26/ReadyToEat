var mongoose = require("mongoose");
/**
 * @swagger
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - categoria
 *         - tempoPreparo
 *         - preco
 *         - tamanhoPorcao
 *         - informacaoNutricional
 *         - imagem
 *         - menu
 *       properties:
 *         nome:
 *           type: string
 *           description: Dish name
 *         descricao:
 *           type: string
 *           description: Dish description
 *         categoria:
 *           type: string
 *           description: Dish category
 *         tempoPreparo:
 *           type: number
 *           description: Preparation time in minutes
 *         preco:
 *           type: number
 *           description: Dish price
 *         tamanhoPorcao:
 *           type: string
 *           description: Portion size
 *         informacaoNutricional:
 *           type: object
 *           properties:
 *             calorias:
 *               type: number
 *               description: Calories
 *             proteinas:
 *               type: number
 *               description: Proteins
 *             carboidratos:
 *               type: number
 *               description: Carbohydrates
 *             gorduras:
 *               type: number
 *               description: Fats
 *             sodio:
 *               type: number
 *               description: Sodium
 *         imagem:
 *           type: string
 *           description: Dish image URL
 *         menu:
 *           type: string
 *           description: ID of the menu this dish belongs to
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           description: Dish creation date
 */
var DishSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    categoria: { type: String, required: true },
    tempoPreparo: { type: Number, required: true },
    preco: { type: Number, required: true },
    tamanhoPorcao: { type: String, required: true },
    informacaoNutricional: {
        calorias: { type: Number, required: true },
        proteinas: { type: Number, required: true },
        carboidratos: { type: Number, required: true }, 
        gorduras: { type: Number, required: true }, 
        sodio: { type: Number, required: true }, 
    },
    imagem: { type: String, required: true }, 
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true }, 
    criadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dish", DishSchema);