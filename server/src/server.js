const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require("gridfs-stream");
const path = require("path");
const cors = require("cors");
require('dotenv').config();

let gfs;



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

const conn = mongoose.createConnection(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

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


const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: Date.now() + path.extname(file.originalname),
      bucketName: 'uploads'
    };
  }
});


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '/uploads')); 
//   },
//   filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
const upload = multer({ storage });

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, 
//   },
// });

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

app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});



  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running successfully`);
  });