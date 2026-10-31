const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const logger = require("../utils/logger");
const { NotFoundError, ValidationError, ConflictError } = require("../utils/errors");

class CartService {


    //add to cart
  static async addToCart(userId, { productId, variantId = null, size = null, quantity = 1 }) {
    try {
      if (!mongoose.isValidObjectId(productId)) {
        throw new ValidationError("Invalid product id");
      }
      if (variantId && !mongoose.isValidObjectId(variantId)) {
        throw new ValidationError("Invalid variant id");
      }

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
       
        validSizes = variant.size.length > 0 ? variant.size : product.size;
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

      logger.info(`item added to cart: ${product.name}`);
      return null
    } catch (error) {
      logger.error("failed to add item to cart", error);
      throw error;
    }
  }



  //get cart

static async getCart(userId) {
  try {
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      return {
        items: [],
        totalItems: 0,
        subtotal: 0,
      };
    }

    const items = cart.items.map((item) => {
      const product = item.product;

      if (!product || !product.visible) {
        return {
          _id: item._id,
          quantity: item.quantity,
          available: false,
          reason: "Product is no longer available",
        };
      }

      const variant = item.variantId
        ? product.variants.id(item.variantId)
        : null;

      if (item.variantId && !variant) {
        return {
          _id: item._id,
          productId: product._id,
          name: product.name,
          quantity: item.quantity,
          available: false,
          reason: "Variant is no longer available",
        };
      }

      const price = variant?.price ?? product.price;
      const stock = variant?.stock ?? product.stock;
      const images = variant?.images?.length
        ? variant.images
        : product.images;

      const available = stock >= item.quantity;

      return {
        _id: item._id,
        productId: product._id,
        category: product.category,
        variantId: item.variantId,
        name: product.name,
        brand: product.brand,
        size: item.size,
        color: variant?.color ?? product.color,
        price,
        image: images?.[0] ?? null,
        quantity: item.quantity,
        stock,
        available,
        reason: available
          ? null
          : stock === 0
            ? "Out of stock"
            : `Only ${stock} left`,
        lineTotal: price * item.quantity,
      };
    });

    const availableItems = items.filter((item) => item.available);

    return {
      items,
      totalItems: availableItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),
      subtotal: availableItems.reduce(
        (total, item) => total + item.lineTotal,
        0
      ),
    };
  } catch (error) {
    logger.error("Failed to get cart", error);
    throw error;
  }
}


//quanity
static async updateCartItem(userId, itemId, quantity) {
  try {
    if (!mongoose.isValidObjectId(itemId)) {
      throw new ValidationError("Invalid cart item id");
    }

    quantity = Number(quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new ValidationError("Invalid quantity");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new NotFoundError("Cart not found");

    const item = cart.items.id(itemId);
    if (!item) throw new NotFoundError("Cart item not found");

    
    if (quantity === 0) {
      item.deleteOne();
      await cart.save();
      return this.getCart(userId);
    }

    const product = await Product.findOne({ _id: item.product, visible: true });
    if (!product) throw new NotFoundError("Product is no longer available");

    let availableStock = product.stock;
    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      if (!variant) throw new NotFoundError("Variant is no longer available");
      availableStock = variant.stock;
    }

    if (quantity > availableStock) {
      throw new ConflictError(
        availableStock === 0 ? "Out of stock" : `Only ${availableStock} left in stock`
      );
    }

    item.quantity = quantity;
    await cart.save();

    return this.getCart(userId);
  } catch (error) {
    logger.error("failed to update cart item", error);
    throw error;
  }
}



//mergeGuestcart
static async mergeGuestCart(userId, items) {
  try {
    if (!Array.isArray(items)) {
      throw new ValidationError("Items must be an array");
    }

    const skippedItems = [];

    for (const item of items) {
      try {
        await this.addToCart(userId, item);
      } catch (error) {
        logger.warn(
          `Skipping guest cart item ${item.productId}: ${error.message}`
        );

        skippedItems.push({
          productId: item.productId,
          reason: error.message,
        });
      }
    }

   
    logger.info(`merged cart succesfully for user ${userId}`)
    return skippedItems 
  } catch (error) {
    logger.error("Failed to merge guest cart", error);
    throw error;
  }
}

//delete cart
static async deleteCart(user){
  try{

    const cart = await Cart.findOne({ user: user });
    if (!cart) throw new NotFoundError("Cart not found");

    await Cart.findByIdAndDelete(cart._id)

    logger.info('cart deleted succesfully')

    return true

  }catch(error){
    logger.error('failed to delete cart')
    throw error
  }
}

}

module.exports = CartService;