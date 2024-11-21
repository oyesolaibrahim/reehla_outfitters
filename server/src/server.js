const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const {
  createFragrance,
  createJalab,
  jalabsToCart,
  jalabsInCart,
  deleteJalabFromCart,
  deleteAllJalabsFromCart,
  createToNewArrival_Jalab,
  createToBestSeller_Jalab,
  createToTopBrand,
  getFromBestSeller_Jalab,
  getFromNewArrival_Jalab,
  getFromTopBrand,
  updateBrand,
  updateArrival,
  editBrandPage,
  editArrivalPage,
  updateBestSeller,
  editBestSellerPage,
  editJalabPage,
  updatesinglejalab,
  getMaleJalab,
  getFemaleJalab,
  getChildrenJalab,
  removeBrand,
  deleteAllBrands,
  removeFromNewArrival_Jalab,
  deleteAllNewArrivals,
  removeFromBestSeller_Jalab,
  deleteAllBestSellers,
  deleteSingleMaleJalab,
  deleteAllMaleJalabs,
  createToBestFragrance,
  createToArrivalFragrance,
  getMaleFragrance,
  getFemaleFragrance,
  getUnisexFragrance,
  getFragrance,
  getBestFragrance,
  getarrivalfragrance,
  updateFragrance,
  updateArrivalFragrance,
  updateBestFragrance,
  editGeneralFragrance,
  editBestFragrance,
  editArrivalFragrance,
  getBrands,
  collections,
  deleteSingleBestFragrance,
  deleteSingleNewFragrance,
  deleteNewFragrance,
  deleteBestFragrance,
} = require("./controllers/products.controller");
const {
  addUser,
  userLogin,
  userCheckout,
  createPayment,
  verifyPayment,
  Subscribe,
  sendMessageToSubscribers,
} = require("./controllers/user.controller");
const { addAdmin, login, adminCart, deleteOneClient, deleteAllClients, deliveryFee, getDeliveryFee, deleteFee,
 } = require("./controllers/admin.controller");
const { getAllBlogs, createBlogMessage, removeBlog, deleteAllBlogs, editBlogPage, updateBlog } = require("./controllers/blog.controller");
require("dotenv").config();
const fs = require("fs");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected successfully!");
    // const allCollectionsData = await fetchAllCollections();
    // console.log('Fetched Data:', allCollectionsData);

  })
  .catch((err) => {
    console.log("Error connecting to DB:", err.message);
  });

const uploadDir = path.join(__dirname, "uploads");
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
    "access-control-allow-Origin",
  ],
};

app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});


app.get("/api/jalab", getMaleJalab);
app.get("/api/femalejalab", getFemaleJalab);
app.get("/api/childrenjalab", getChildrenJalab);
app.get("/api/cart", jalabsInCart);
app.get("/api/orders", adminCart);
app.get("/api/bestseller", getFromBestSeller_Jalab);
app.get("/api/newarrival", getFromNewArrival_Jalab);
app.get("/api/topbrand", getFromTopBrand);
app.get("/api/toponebrand", editBrandPage);
app.get("/api/toponearrival", editArrivalPage);
app.get("/api/toponebestseller", editBestSellerPage);
app.get("/api/editsinglejalab", editJalabPage);
app.get("/api/editblog", editBlogPage);
app.get("/api/blogs", getAllBlogs);
app.get("/api/brands", getBrands);
app.get("/verify-payment/:reference", verifyPayment);
app.get("/api/generalfragrance", getFragrance);
app.get("/api/malefragrance", getMaleFragrance);
app.get("/api/femalefragrance", getFemaleFragrance);
app.get("/api/unisexfragrance", getUnisexFragrance);
app.get("/api/getbestfragrance", getBestFragrance);
app.get("/api/getarrivalfragrance", getarrivalfragrance);
app.get("/api/editgeneralfragrance", editGeneralFragrance);
app.get("/api/editbestfragrance", editBestFragrance);
app.get("/api/editarrivalfragrance", editArrivalFragrance);
app.get("/api/getdelivery", getDeliveryFee)
app.get("/api/collections", collections);

app.post("/api/blogs", createBlogMessage);
app.post("/api/delivery", deliveryFee);
app.post("/api/fragrance", upload.single("imageFile"), createFragrance);
app.post("/api/bestfragrance", upload.single("imageFile"), createToBestFragrance);
app.post("/api/arrivalfragrance", upload.single("imageFile"), createToArrivalFragrance);
app.post("/api/cart", jalabsToCart);
app.post("/api/jalab", upload.single("imageFile"), createJalab);
app.post("/api/admin/signup", addAdmin);
app.post("/api/admin/login", login);
app.post("/api/user/signup", addUser);
app.post("/api/user/login", userLogin);
app.post("/api/user/checkout", userCheckout);
app.post("/api/bestseller", upload.single("imageFile"), createToBestSeller_Jalab);
app.post("/api/newarrival", upload.single("imageFile"), createToNewArrival_Jalab);
app.post("/api/topbrand", upload.single("imageFile"), createToTopBrand);
app.post("/initialize-payment", createPayment);
app.post("/api/subscribe", Subscribe);
app.post("/api/send-messages", upload.single("imageFile"), sendMessageToSubscribers);

app.put("/api/updatebrand", upload.single("imageFile"), updateBrand);
app.put("/api/updatearrival", upload.single("imageFile"), updateArrival);
app.put("/api/updatebestseller", upload.single("imageFile"), updateBestSeller);
app.put("/api/updatesinglejalab", upload.single("imageFile"), updatesinglejalab);
app.put("/api/updateblog", upload.single("imageFile"), updateBlog);
app.put("/api/updatebestfragrance", upload.single("imageFile"), updateBestFragrance);
app.put("/api/updatearrivalfragrance", upload.single("imageFile"), updateArrivalFragrance);
app.put("/api/updatefragrance", upload.single("imageFile"), updateFragrance);

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
app.delete("/api/deleteblog", removeBlog);
app.delete("/api/deletedelivery", deleteFee);
app.delete("/api/deletebestfragrance", deleteSingleBestFragrance);
app.delete("/api/deleteallbestfragrance", deleteBestFragrance);
app.delete("/api/deletenewfragrance", deleteSingleNewFragrance);
app.delete("/api/deleteallnewfragrance", deleteNewFragrance);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running successfully`);
});
