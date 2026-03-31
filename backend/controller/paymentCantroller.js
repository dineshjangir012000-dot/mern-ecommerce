import orderModel from "../model/orderModel.js";
import stripe from "../config/stripe.js";
import cartModel from "../model/cartModel.js";
import paymentModel from "../model/paymentModel.js";


export const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user._id;
    const {orderId} = req.body;


    const order = await orderModel.findById(orderId)
    if(!order) {
      return res.status(404).json({
        status : false ,
        message : "Order not found with this order Id"
      })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });
    console.log("Payment Intent" , paymentIntent)

    const payment = await paymentModel.create({
      order : orderId,
      user : userId,
      amount : order.totalAmount,
      stripe : {paymentIntentId : paymentIntent.id },
  
    })

    console.log("Payment", payment)

    return res.status(200).json({
      status: true,
      message : "created payment Intent successfully",
      data : payment,
      clientSecret : paymentIntent.client_secret,
      paymentId : payment._id,
    });
    
  } catch (error) {
    console.log("Payment Intent error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


export const confirmPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("Payment Intent ", paymentIntent);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        status: false,
        message: "Payment not successful",
      });
    }

    const payment = await paymentModel.findOneAndUpdate(
      { "stripe.paymentIntentId": paymentIntentId },
      { status: "PAID" , paidAt : new Date()},
      { new: true }
    );

    const order = await orderModel.findByIdAndUpdate(payment.order, {
      orderStatus : "CONFIRMED",
      paidAt : new Date(),
    })

    // const cart = await cartModel.findOneAndUpdate({ user : userId } , {items : []} , {new : true});

    return res.status(200).json({
      status: true,
      message: "Payment confirmed & cart cleared",
      data : payment,
      // cart : cart,
      order: order
    });

  } catch (error) {
    console.log("Confirm payment error:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

export const failPayment = async (req, res) => {
  try {
    const {paymentIntentId} = req.body;

    const payment = await paymentModel.findOneAndUpdate(
      {"stripe.paymentIntentId" : paymentIntentId},
      {status : "FAILED"}, {new : true}
    )
    return res.status(200).json({
      status : true,
      message :  ""
    })
  } catch (error) {
    console.log("error in fail payment", error.message)
    return res.status(500).json({
      status : false ,
      message : "internal server error"
    })
  }
}

export const refundPayment = async (req,res) => {
  try {
    const {paymentId} = req.body;
    const payment = await paymentModel.findById(paymentId)

    if(!payment || payment.status !== "PAID"){
      return res.status(400).json({
        status : false ,
        message : 'refund is not allowed'
      })
    }

    await stripe.refunds.create(
      {payment_intent : payment.stripe.paymentIntentId}
    )

    payment.status = "REFUNDED";
    payment.refundedAt = new Date();
    await payment.save();

    const order = await orderModel.findByIdAndUpdate(payment.order, {orderStatus : "CANCELLED"}
    )
    
    return res.status(200).json({
      status : true ,
      message : "refund payment successfully",
      data : payment
    })
    
  } catch (error) {
    console.log("Error in refund payment", error.message)
    return res.status(500).json({
      status : false ,
      message : "Internal server error"
    })
  }
}
