import cartModel from "../model/cartModel.js";
import productModel from "../model/productModel.js";


export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(req.user._id)
        const {productId, quantity = 1} = req.body;

        if(!productId) {
            return res.status(400).json({
                status : false,
                message : "Product id required "
            })
        }
        const product = await productModel.findById(productId)
        if(!product){
            return res.status(404).json({
                status : false,
                message : "product not found "
            })
        }

        let cart = await cartModel.findOne({userId})
        if(cart){
            const itemIndex = cart.items.findIndex(
               (item) => item.productId.equals(productId)
            )
            console.log("itemIndex", itemIndex)

            if(itemIndex > -1){
                cart.items[itemIndex].quantity += quantity
            }else {
                cart.items.push({productId, quantity})
            }
            
        }else {
            cart = await cartModel.create({
                userId,
                items: [{productId, quantity}]
            })
        }

        await cart.save();

        return res.status(200).json({
            status : true ,
            message : "Product added successfully",
            data : cart
        })
        
    } catch (error) {
        console.log("error in add to cart", error)
        return res.status(500).json({
            status: false ,
            message : "Internal server error"
        })
    }
}

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("UserId", userId);

        const cart = await cartModel.findOne({userId}).populate("items.productId")
        if(!cart){
            return res.status(200).json({
                status : true,
                cart : []
            })
        }
        return res.status(200).json({
            status : true,
            message : "Got all cart details",
            data : cart
        })
    } catch (error) {
        console.log("error in get cart", error)
        return res.status(500).json({
            status : false,
            message : "internal server error"
        })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const {productId, quantity} = req.body;

        if(!productId || quantity < 1) { 
            return res.status(400).json({
                status : false ,
                message : "Invalid product or quantity"
            })
        }  

        console.log("userId", userId);
        const cart = await cartModel.findOne({userId})
        console.log("cart", cart);
        if(!cart ){
            return res.status(400).json({
                status : false ,
                message : "Cart not found with this user Id"
            })
        }
        const item = cart.items.find(
            (product) => product.productId.toString() === productId
        )
        console.log("item", item);
        if(!item){
            return res.status(400).json({
                status : false ,
                message : "product not in cart"
            })
        }else {
            item.quantity = quantity;
            await cart.save();
        }

        return res.status(200).json({
            status : true ,
            message : "Quantity updated successfully ", 
            data : cart
        })
    } catch (error) {
        console.log("Error in update in cart", error)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const {productId} = req.params;

        const cart = await cartModel.findOne({userId})
        if(!cart){
            return res.status(400).json({
                status : false,
                message : "Cart not found"
            })
        }

        console.log("cart before filter", cart);
        console.log("Product ID", productId);

        cart.items = cart.items.filter(
            (item) => !item.productId.equals(productId)
        )

        await cart.save();
        console.log("cart after filter ", cart.items)

        return res.status(200).json({
            status : true,
            message : "Item removed from the cart successfully",
            data : cart
        })
        
    } catch (error) {
        console.log("Erroor in removing from cart", error)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}

export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await cartModel.findOneAndUpdate(
            {userId},
            {items : []},
            {new : true}
        )
        return res.status(200).json({
            status : true,
            message : "Cart clear successfully",
            data : cart
        })
    } catch (error) {
        console.log("Error in clear cart", error)
        return res.status(500).json({
            status : false ,
            message : "Internal server error"
        })
    }
}