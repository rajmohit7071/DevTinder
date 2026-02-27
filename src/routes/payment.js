const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payments");

const paymentRouter = express.Router();

paymentRouter.post("/profile/create", userAuth, async (req, res) =>{

    const {firstName, lastName, emailId} = req.user;
    const memberShipType = req.body;

    try{
        const order = await razorpayInstance.orders.create({
            amount : 70000,
            currency : "INR",
            receipt : "RECEIPT1",
            notes:{
                firstName ,
                lastName ,
                emailId,
                memberShipType : memberShipType
            }

        });

        // save the order in db

        const payment = new Payment({
            userId : req.user._id,
            orderId : order.id,
            status : order.status,
            amount : order.amount,
            currency : order.currency,
            receipt : order.receipt,
            notes : order.notes,
        })

        const savedPayment = await payment.save();


        // return the order to client
        res.send({...savedPayment.toJson()})

    }
    catch(err){
        res.status(400).json(err.message);
    }

})

module.exports = paymentRouter;