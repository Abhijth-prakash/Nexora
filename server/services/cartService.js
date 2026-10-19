const Cart = require("../models/Cart");
const Product = require("../models/Product");
const logger = require("../utils/logger");
const { NotFoundError, ValidationError, ConflictError } = require("../utils/errors");

class CartService {
  static async addToCart(userId, { productId, variantId = null, size = null, quantity = 1 }) {
    try {
      quantity = Number(quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new ValidationError("Invalid quantity");
      }

      const product = await Product.findOne({ _id: productId, visible: true });
      if (!product) throw new NotFoundError("Product not found");

      let availableStock = product.stock;
      let validSizes = product.size;

      if (variantId) {
        const variant = product.variants.id(variantId);
        if (!variant) throw new NotFoundError("Variant not found");
        availableStock = variant.stock;
        validSizes = variant.size;
      } else if (product.variants.length > 0) {
        throw new ValidationError("Please select a variant");
      }

      if (validSizes.length > 0) {
        if (!validSizes.includes(size)) {
          throw new ValidationError("Please select a valid size");
        }
      } else {
        size = null;
      }

      let cart = await Cart.findOne({ user: userId });
      if (!cart) cart = new Cart({ user: userId, items: [] });

      const existing = cart.items.find(
        (item) =>
          item.product.equals(productId) &&
          String(item.variantId || "") === String(variantId || "") &&
          (item.size || null) === (size || null)
      );

      const newQty = (existing ? existing.quantity : 0) + quantity;
      if (newQty > availableStock) {
        throw new ConflictError("Not enough stock available");
      }

      if (existing) {
        existing.quantity = newQty;
      } else {
        cart.items.push({ product: productId, variantId, size, quantity });
      }

      await cart.save();
      return null;
    } catch (error) {
      logger.error("failed to add item to cart", error);
      throw error;
    }
  }
}

module.exports = CartService;