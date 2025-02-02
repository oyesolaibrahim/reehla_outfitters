const User = require("../models/user.model"); 
const Clients = require("../models/userCheckout.model"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const axios = require('axios');
const Subscription = require('../models/subscription.model'); 
const Payment = require('../models/payment.model'); 
const sendEmail = require('../services/emailService.services'); // Adjust the path as necessary
require('dotenv').config();
const { uploadFileToFirebase, db } = require('../../firebaseAdmin'); 
const { storage, bucketName } = require('../../firebaseAdmin'); 
const path = require("path");


const addUser = (req, res) => {
    
    User.findOne({email: req.body.email})
    .then(user => {
        if (user) {
         return  res.status(404).json ({message: "A User with the same email address already exist."});
        }
        
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword
    }
  
    User.create(userData)
    .then((user) => {
        res.status(200).json({message: "created successfully"});
    })
    .catch((err) => {
        res.status(404).json({message: "error", err});
        })
      
    })
    .catch((error) => {
        res.status(404).json({message: "error finding email", error});
    })
    }


const userLogin = (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(404).json({message: "Email and password are required."});
    }

    User.findOne({email})
    .then((user) => {
        //  return  res.status(404).json ({message: "A User with the same email address already exist."});
        const userObj = {id: user._id};
        const token = jwt.sign(userObj, "SECRET_KEY");
        console.log(user);
        if (!user) {
            return res.status(404).json({message: "User account with the given email does not exist."});
        } else if (!bcrypt.compareSync(password, user.password)) {
           return res.status(404).json({message: "Incorrect Password."});
        }
        res.status(200).json({message: "Logged In", token, user});
    })
    .catch(error => {
        res.status(404).json({message: "User account not found", error});
    })
}

const userCheckout = (req, res) => {
  const {
    firstName,
    lastName,
    email,
    state,
    address,
    phone,
    paymentOption,
    quantity,
    subTotal,
    total,
    cartDetails
} = req.body;

const sessionId = req.query.sessionId;
const adminSessionId = req.body.adminSessionId;

if (!sessionId && !adminSessionId) {
    return res.status(400).json({ message: "Either sessionId or adminSessionId must be provided." });
}

const clientData = {
    firstName,
    lastName,
    email,
    state,
    address,
    phone,
    paymentOption,
    quantity,
    subTotal,
    total,
    sessionId,
    adminSessionId,
    cartDetails: cartDetails.map(item => ({
        pricePerQuantity: item.pricePerQuantity,
        totalPrice: item.totalPrice,
        quantity: item.quantity,
        itemDetails: {
            name: item.itemDetails.name,
            category: item.itemDetails.category,
            price: item.itemDetails.price,
            oldPrice: item.itemDetails.oldPrice,
            description: item.itemDetails.description,
            imageUrl: item.itemDetails.imageUrl
        }
    }))
};
    Clients.create(clientData)
    .then((client) => {
        res.status(200).json({message: "Checkout Successful", client});
    })
    .catch((err) => {
        res.status(404).json({message: "Failed, Try again!!!", err});
        })
    }
    
    /*const editDeliveryFee = () => {
         sessionId = req.params.id;
        const deliveryFee = req.body.deliveryFee

      Clients.updateOne({_id: sessionId}, deliveryFee)
      .then(() => {
          res.redirect("/menus/" + menuId);
      })
      .catch((error) => {
          req.flash("error", error._message);
          res.redirect(`/menus/${menuId}/edit`);
      })  
  }
*/
const Subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    await sendEmail(email, 'Welcome to Reehla\'s Outfitters and Fragrance', 'Thank you for subscribing to our newsletter!');

    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ message: 'Error subscribing' });
  }
};
const sendMessageToSubscribers = async (req, res) => {
  const { subject, message, imageUrl } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  try {
    const subscribers = await Subscription.find({});
    if (subscribers.length === 0) {
      return res.status(200).json({ message: 'No subscribers to send messages to' });
    }

    const emailPromises = subscribers.map(subscriber => 
      sendEmail(subscriber.email, subject, message, imageUrl)
    );

    await Promise.all(emailPromises);

    res.status(200).json({ message: 'Messages sent successfully' });
  } catch (error) {
    console.error('Error sending messages:', error);
    res.status(500).json({ message: 'Error sending messages' });
  }
}
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

const createPayment = async (req, res) => {
  const { email, amount, paymentMethod } = req.body;

  try {
    if (paymentMethod === 'card') {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: amount * 100, // Paystack expects the amount in kobo
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Save transaction to the database
      const payment = new Payment({
        email,
        amount,
        paymentMethod,
        reference: response.data.data.reference,
        status: 'pending', // Initially mark the transaction as pending
      });
      await payment.save();

      // Respond with the authorization URL
      return res.status(200).json({
        authorization_url: response.data.data.authorization_url,
        reference: response.data.data.reference,
        paymentMethod,
      });
    } else if (paymentMethod === 'bank_transfer') {
      // For bank transfer, send back bank details and save to the database
      const payment = new Payment({
        email,
        amount,
        paymentMethod,
        reference: `BANK-${Date.now()}`, // Generate a unique reference for manual payments
        status: 'pending',
      });
      await payment.save();

      return res.status(200).json({
        message: 'Bank transfer details',
        paymentMethod,
        bankDetails: {
          accountName: 'Oyesola Ibrahim Omobolaji',
          accountNumber: '0234402662',
          bankName: 'Gt Bank',
          amount,
        },
      });
    } else {
      return res.status(400).json({ error: 'Invalid payment method selected' });
    }
  } catch (error) {
    console.error('Error initializing payment:', error.message);
    return res.status(500).json({ error: 'An error occurred while initializing payment' });
  }
};

const verifyPayment = async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.data.data.status === 'success') {
      // Update payment status in the database
      await Payment.findOneAndUpdate(
        { reference },
        { status: 'success' },
        { new: true }
      );

      res.status(200).json({
        message: 'Payment verified successfully',
        data: response.data.data,
      });
    } else {
      await Payment.findOneAndUpdate(
        { reference },
        { status: 'failed' },
        { new: true }
      );

      res.status(400).json({
        message: 'Payment verification failed',
        data: response.data.data,
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ error: 'An error occurred while verifying payment' });
  }
};

module.exports = {
    addUser,
    userLogin,
    userCheckout,
    Subscribe,
    sendMessageToSubscribers,
    createPayment,
    verifyPayment
}