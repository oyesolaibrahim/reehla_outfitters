const Clients = require("../models/userCheckout.model")
const Admin = require("../models/admin.model"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");



const addAdmin = (req, res) => {
    Admin.findOne({email: req.body.email})
    .then(admin => {
        if (admin) {
            return  res.status(404).json("error", "An admin with the same email address already exists.");
        }
        
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const adminData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        deliveryFee: req.body.deliveryFee,
        password: hashPassword
    }
    Admin.create(adminData)
    .then((admin) => {
        res.status(200).json({message: "created successfully", admin});;
    })
    .catch((err) => {
        res.status(404).json({message: "error", err});
    })
    })
    .catch((error) => {
        res.status(404).json({message: "Error Signing Up", error});
    })
}


const login = (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(404).json({message: "Email and password are required."});
    }

    Admin.findOne({email})
    .then((admin) => {
        const adminObj = {id: admin._id};
        const token = jwt.sign(adminObj, "SECRET_KEY");
        if (!admin) {
            return res.status(404).json({message: "Admin account with the given email does not exist."});
        } else if (!bcrypt.compareSync(password, admin.password)) {
            return res.status(404).json({message: "Incorrect Password."});
        }
        res.status(200).json({message: "Logged In", token, admin});
    })
    .catch(error => {
        console.error(error)
        res.status(404).json({message: "Admin account not found", error});
    })
}
const adminCart = (req, res) => {
    Clients.find()
        .then(carts => {
            if (!carts || carts.length === 0) {
                return res.status(404).json({ message: "No carts found for this session" });
            }
            console.log("Carts Fetched Successfully:", carts);
            res.status(200).json({ message: "Carts Fetched Successfully", carts });
        })
        .catch(error => {
            console.error("Error Fetching Carts:", error);
            res.status(500).json({ message: "Error Fetching Carts", error });
        });
};
const deleteOneClient = (req, res) => {
    const clientId = req.query.clientId
    console.log(clientId)
    Clients.findByIdAndDelete(clientId)
    .then((client) => {
      res.status(200).json({message: "Client removed successfully", client})
    })
    .catch(error => {
      console.error(error)
      res.status(404).json({message: "Client failed to be removed", error})
    })
  }
  const deleteAllClients = (req, res) => {
    Clients.deleteMany()
    .then((client) => {
      res.status(200).json({message: "Client deleted successfully", client})
    })
    .catch(error => {
      res.status(404).json({message: "Client failed to be deleted"})
    })
  }
  

module.exports = {
    addAdmin,
    login,
    adminCart,
    deleteOneClient,
    deleteAllClients
};
