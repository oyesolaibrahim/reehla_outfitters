const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { createFragrance, createJalab, addJalab, jalabsToCart, jalabsInCart, deleteJalabFromCart, deleteAllJalabsFromCart, adminCart, createToNewArrival_Jalab, createToBestSeller_Jalab, createToTopBrand, getFromBestSeller_Jalab, getFromNewArrival_Jalab, getFromTopBrand, removeBrand, deleteAllBrands, deleteAllNewArrivals, removeFromNewArrival_Jalab, deleteAllBestSellers, removeFromBestSeller_Jalab, deleteSingleMaleJalab, deleteAllMaleJalabs, editSingleMaleJalab, updateProduct, editProductPage, updateBrand, updateArrival, editBrandPage, editArrivalPage, updateBestSeller, editBestSellerPage, editJalabPage, updatesinglejalab, femaleJalab, childrenJalab } = require("./controllers/products.controller");
const { addUser, userLogin, userCheckout, createPayment, verifyPayment, Subscription, Subscribe, sendMessageToSubscribers, deleteOneClient, deleteAllClients} = require("./controllers/user.controller");
const { addAdmin, login} = require("./controllers/admin.controller");
const { getAllBlogs, createBlogMessage } = require("./controllers/blog.controller");
require('dotenv').config();
const fs = require('fs');


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Database connected successfully!");
})
.catch((err) => {
    console.log("Error connecting to DB:", err.message);
});
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const corsConfig = {
    origin: true,
    credentials: true,
    allowHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
      "Authorization",
      "Access-Control-Allow-Origin",
      "access-control-allow-Origin"
    ]
  }
  
  app.use(cors(corsConfig));

  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/uploads')); 
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get("/api/jalab", addJalab);
app.get("/api/femalejalab", femaleJalab);
app.get("/api/childrenjalab", childrenJalab);
app.get("/api/cart", jalabsInCart);
app.get("/api/orders", adminCart);
app.get("/api/bestseller", getFromBestSeller_Jalab);
app.get("/api/newarrival", getFromNewArrival_Jalab);
app.get("/api/topbrand", getFromTopBrand);
app.get("/api/toponebrand", editBrandPage);
app.get("/api/toponearrival", editArrivalPage);
app.get("/api/toponebestseller", editBestSellerPage);
app.get("/api/editsinglejalab", editJalabPage);
app.get("/api/blogs", getAllBlogs);
app.get('/verify-payment/:reference', verifyPayment);


app.post("/api/blogs", createBlogMessage);
app.post("/api/fragrance", createFragrance);
app.post("/api/cart", jalabsToCart);
app.post("/api/jalab", upload.single('imageFile'), createJalab);
app.post("/api/admin/signup", addAdmin);
app.post("/api/admin/login", login);
app.post("/api/user/signup", addUser);
app.post("/api/user/login", userLogin);
app.post("/api/user/checkout", userCheckout);
app.post("/api/bestseller", upload.single('imageFile'), createToBestSeller_Jalab);
app.post("/api/newarrival", upload.single('imageFile'),createToNewArrival_Jalab);
app.post("/api/topbrand",upload.single('imageFile'), createToTopBrand);
app.post('/initialize-payment', createPayment)
app.post('/api/subscribe', Subscribe)
app.post('/api/send-messages', sendMessageToSubscribers)

app.put("/api/updatebrand", upload.single('imageFile'), updateBrand);
app.put("/api/updatearrival", upload.single('imageFile'), updateArrival);
app.put("/api/updatebestseller", upload.single('imageFile'), updateBestSeller);
app.put("/api/updatesinglejalab", upload.single('imageFile'), updatesinglejalab);

app.delete("/api/delete", deleteJalabFromCart);
app.delete("/api/deleteAll", deleteAllJalabsFromCart);
app.delete("/api/deletetopbrand", removeBrand);
app.delete("/api/deletetopbrands", deleteAllBrands);
app.delete("/api/deletenewarrival", removeFromNewArrival_Jalab);
app.delete("/api/deletenewarrivals", deleteAllNewArrivals);
app.delete("/api/deletebestseller", removeFromBestSeller_Jalab);
app.delete("/api/deletebestsellers", deleteAllBestSellers);
app.delete("/api/deletesinglemalejalab", deleteSingleMaleJalab);
app.delete("/api/deleteallmalejalabs", deleteAllMaleJalabs);
app.delete("/api/deleteoneclient", deleteOneClient);
app.delete("/api/deleteallclients", deleteAllClients);



  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });