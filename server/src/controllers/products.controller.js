const path = require("path");
const Fragrance = require("../models/addFragrance.model");
const { uploadFileToFirebase, db } = require('../../firebaseAdmin'); 
const { storage, bucketName } = require('../../firebaseAdmin'); 
const newArrival = require('../models/newArrival.Model');
const topBrands = require('../models/topBrands.model');
const Jalabs = require('../models/addJalabs.model');
const bestSellers = require('../models/bestSellers.Model');
const Cart = require("../models/cart.Model")


const createFragrance = (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ message: "A required field is missing" });
    }

    const fragranceData = { name, description, price };

    db.collection('fragrances').add(fragranceData)
        .then(() => {
            res.status(201).json({ message: "New Fragrance Created Successfully" });
        })
        .catch(error => {
            res.status(500).json({ message: "Server error", error });
        });
};

const createJalab = async(req, res) => {
    const { name, description, category, price, oldPrice } = req.body;

    try {
        // Validate required fields
        if (!name || !price || !oldPrice || !description || !category) {
            return res.status(400).json({ message: "One or more required fields are missing" });
        }

        let imageUrl = ''; // Initialize imageUrl

        // Check if imageUrl or imageFile is provided
        if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl; // Use provided imageUrl
        } else if (req.file) {
            // Upload image to Firebase Storage
            const file = req.file;
            const storageRef = ref(storage, `images/${file.originalname}`);
            const snapshot = await uploadBytes(storageRef, file.buffer);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Create NewArrival document
        const jalabData = {
            name,
            description,
            category,
            price,
            oldPrice,
            imageUrl
        };

        const savedJalab = await Jalabs.create(jalabData);

        return res.status(201).json({ message: "Jalab Created Successfully", jalab: savedJalab });
    } catch (error) {
        console.error("Error creating new arrival:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
const jalabsToCart = async (req, res) => {
    const { pricePerQuantity, totalPrice, quantity, itemDetails } = req.body;
    const sessionId = req.query.sessionId;

    if (quantity === 0) {
        return res.status(400).json({ message: "Quantity cannot be zero!" });
    }
    try {
        let imageUrl = itemDetails.imageUrl;

        if (itemDetails.imageUrl) {
            // Use provided imageUrl
            imageUrl = itemDetails.imageUrl;
        } else if (itemDetails.imageFile) {
            // Upload image to Firebase Storage
            const file = itemDetails.imageFile;
            const storageRef = admin.storage().ref().child(`images/${file.originalname}`);
            const snapshot = await storageRef.put(file.buffer);
            imageUrl = await snapshot.ref.getDownloadURL();
        }

        // Save the cart details to MongoDB
        const cartDetails = {
            pricePerQuantity,
            totalPrice,
            quantity,
            sessionId,
            itemDetails: {
                ...itemDetails,
                imageUrl // Update the imageUrl with the Firebase Storage URL
            }
        };

        const cart = new Cart(cartDetails);
        await cart.save();

        res.status(200).json({ message: "Jalab added to cart successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add jalab to cart", error });
    }
};

  
  const jalabsInCart = async (req, res) => {
    const sessionId = req.query.sessionId;
  
      // Get image URLs from Firebase Storage
        try {
            // Fetch cart items from MongoDB
            const cartItems = await Cart.find({ sessionId });
    
            // Get image URLs from Firebase Storage
            const jalabsWithImageUrls = await Promise.all(cartItems.map(async (item) => {
                try {
                    const file = admin.storage().bucket().file(item.itemDetails.imageUrl);
                    const [url] = await file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491' // Set an appropriate expiration date
                    });
                    return {
                        ...item._doc, // spread the original document fields
                        itemDetails: {
                            ...item.itemDetails,
                            imageUrl: url // Update imageUrl with the one from Firebase Storage
                        }
                    };
                } catch (error) {
                    console.error("Error getting image URL:", error.message);
                    return { ...item._doc, itemDetails: { ...item.itemDetails, imageUrl: '' } };
                }
            }));
    
            res.status(200).json({ message: "Jalabs Fetched Successfully", jalabs: jalabsWithImageUrls });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Jalabs Failed to be fetched", error });
        }
    }
    
  

const deleteJalabFromCart = (req, res) => {
    const jalabId = req.query.jalabId;

    Cart.findByIdAndDelete(jalabId)
        .then(() => {
            res.status(200).json({ message: "Jalab Deleted Successfully" });
        })
        .catch(error => {
            res.status(404).json({ message: "Failed to Delete Jalab", error });
        });
};

const deleteAllJalabsFromCart = (req, res) => {
    Cart.deleteMany()
        .then(() => {
            res.status(200).json({ message: "All Jalabs Deleted Successfully" });
        })
        .catch(error => {
            res.status(404).json({ message: "Failed to Delete All Jalabs", error });
        });
};
const createToTopBrand = async (req, res) => {
    const { brandName, description } = req.body;
    let { imageUrl } = req.body;

    try {
        if (!brandName || !description || (!imageUrl && !req.file)) {
            return res.status(400).json({ message: "One or more required fields are missing" });
        }

        if (req.file) {
            imageUrl = await uploadFileToFirebase(req.file);
        }

        const brandData = { brandName, imageUrl, description };
        await topBrands.create(brandData);

        return res.status(201).json({ message: "New Brand Created Successfully" });
    } catch (error) {
        console.error("Error creating brand:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
const createToNewArrival_Jalab = async (req, res) => {
    const { productName, description, category, price, oldPrice } = req.body;

    try {
        // Validate required fields
        if (!productName || !price || !oldPrice || !description || !category) {
            return res.status(400).json({ message: "One or more required fields are missing" });
        }

        let imageUrl = ''; // Initialize imageUrl

        // Check if imageUrl or imageFile is provided
        if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl; // Use provided imageUrl
        } else if (req.file) {
            // Upload image to Firebase Storage
            const file = req.file;
            const storageRef = ref(storage, `images/${file.originalname}`);
            const snapshot = await uploadBytes(storageRef, file.buffer);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Create NewArrival document
        const newArrivalData = {
            productName,
            description,
            category,
            price,
            oldPrice,
            imageUrl
        };

        const savedNewArrival = await newArrival.create(newArrivalData);

        return res.status(201).json({ message: "New Arrival Created Successfully", newArrival: savedNewArrival });
    } catch (error) {
        console.error("Error creating new arrival:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createToBestSeller_Jalab = async (req, res) => {
    const { productName, description, category, price, oldPrice } = req.body;

    try {
        // Validate required fields
        if (!productName || !price || !oldPrice || !description || !category) {
            return res.status(400).json({ message: "One or more required fields are missing" });
        }

        let imageUrl = ''; // Initialize imageUrl

        // Check if imageUrl or imageFile is provided
        if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl; // Use provided imageUrl
        } else if (req.file) {
            // Upload image to Firebase Storage
            const file = req.file;
            const storageRef = ref(storage, `images/${file.originalname}`);
            const snapshot = await uploadBytes(storageRef, file.buffer);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Create NewArrival document
        const newBestData = {
            productName,
            description,
            category,
            price,
            oldPrice,
            imageUrl
        };

        const savedBestSeller = await bestSellers.create(newBestData);

        return res.status(201).json({ message: "Best Seller Created Successfully", bestSeller: savedBestSeller });
    } catch (error) {
        console.error("Error creating new arrival:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const postCheckout = (req, res) => {
    const { items, fullName, phoneNumber, deliveryAddress, amountPaid, deliveryMethod, paymentMethod, transactionId, deliveryFee } = req.body;

    const clientData = { items, fullName, phoneNumber, deliveryAddress, amountPaid, deliveryMethod, paymentMethod, transactionId, deliveryFee };

    db.collection('clients').add(clientData)
        .then(() => {
            res.status(200).json({ message: "Successfully Checked Out" });
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to Checkout", error });
        });
};
const getFromNewArrival_Jalab = (req, res) => {
    newArrival.find()
        .then((jalab) => {
            const jalabWithRelativeImageUrl = jalab.map((item) => ({
                ...item._doc, 
                imageUrl: item.imageUrl, // Assuming item.imageUrl is the path relative to the Firebase Storage bucket
            }));
            res.status(200).json({ message: "Jalab gotten Successfully to New Arrival", jalab: jalabWithRelativeImageUrl });
        })
        .catch(error => {
            res.status(404).json({ message: "Failed to get Jalab to New Arrival", error });
        });
};
const getFromTopBrand = (req, res) => {
    topBrands.find()
    .then((brands) => {
        const brandsWithRelativeImageUrl = brands.map((item) => ({
            ...item._doc, 
            imageUrl: item.imageUrl
        }));
        res.status(200).json({ message: "Brands retrieved successfully", brands: brandsWithRelativeImageUrl });
    })
    .catch(error => {
        res.status(404).json({ message: "Failed to get brands", error });
    });
};
const getFromBestSeller_Jalab = async (req, res) => {
    bestSellers.find()
        .then((jalab) => {
            const jalabWithRelativeImageUrl = jalab.map((item) => ({
                ...item._doc, 
                imageUrl: item.imageUrl, // Assuming item.imageUrl is the path relative to the Firebase Storage bucket
            }));
            res.status(200).json({ message: "Jalab gotten Successfully to New Arrival", jalab: jalabWithRelativeImageUrl });
        })
        .catch(error => {
            res.status(404).json({ message: "Failed to get Jalab to New Arrival", error });
        });
};
const getMaleJalab = (req, res) => {
    Jalabs.find({ category: 'Male' })
        .then((jalabs) => {
            const maleJalabsWithImageUrls = jalabs.map((item) => ({
                ...item._doc,
                imageUrl: ``,
            }));
            res.status(200).json({ message: "Male Jalabs gotten successfully", jalabs: maleJalabsWithImageUrls });
        })
        .catch(error => {
            res.status(404).json({ message: "Failed to get Male Jalabs", error });
        });
};
const getFemaleJalab = (req, res) => {
    Jalabs.find({ category: 'Female' })
        .then((jalabs) => {
            const femaleJalabsWithImageUrls = jalabs.map((item) => ({
                ...item._doc,
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/images%2F${encodeURIComponent(item.imageUrl)}?alt=media`,
            }));
            res.status(200).json({ message: "Female Jalabs gotten successfully", jalabs: femaleJalabsWithImageUrls });
        })
        .catch(error => {
            res.status(404).json({ message: "Failed to get Female Jalabs", error });
        });
};
const getChildrenJalab = (req, res) => {
    Jalabs.find({ category: 'Children' })
        .then((jalabs) => {
            const childrenJalabsWithImageUrls = jalabs.map((item) => ({
                ...item._doc,
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/images%2F${encodeURIComponent(item.imageUrl)}?alt=media`,
            }));
            res.status(200).json({ message: "Children Jalabs gotten successfully", jalabs: childrenJalabsWithImageUrls });
        })
        .catch(error => {
            res.status(404).json({ message: "Failed to get Children Jalabs", error });
});
}
    
const updateArrival = async (req, res) => {
    const arrivalId = req.query.arrivalId;

    try {
        const { productName, description, category, price, oldPrice } = req.body;

        if (!['Male', 'Female', 'Children'].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        let imageUrl = req.body.imageUrl; // Use existing imageUrl if provided

        if (req.file) {
            const file = req.file;
            const storageRef = ref(storage, `images/${file.originalname}`);
            const snapshot = await uploadBytes(storageRef, file.buffer);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const arrivalData = {
            productName,
            imageUrl,
            description,
            price,
            oldPrice,
            category
        };

        const updatedArrival = await newArrival.findByIdAndUpdate(arrivalId, arrivalData, { new: true });

        if (!updatedArrival) {
            return res.status(404).json({ message: "Failed to update arrival" });
        }

        return res.status(200).json({ message: "Edited", arrival: updatedArrival });
    } catch (error) {
        console.error("Error updating arrival:", error.message);
        return res.status(500).json({ message: "Failed to update arrival", error: error.message });
    }
};


const updatesinglejalab = async (req, res) => {
    const jalabId = req.query.jalabId;

    try {
        const { name, description, category, price, oldPrice } = req.body;

        if (!['Male', 'Female', 'Children'].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        let imageUrl = req.body.imageUrl; // Use existing imageUrl if provided

        if (req.file) {
            const file = req.file;
            const storageRef = ref(storage, `images/${file.originalname}`);
            const snapshot = await uploadBytes(storageRef, file.buffer);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const jalabData = {
            name,
            imageUrl,
            description,
            price,
            oldPrice,
            category
        };

        const updatedJalab = await Jalabs.findByIdAndUpdate(jalabId, jalabData, { new: true });

        if (!updatedJalab) {
            return res.status(404).json({ message: "Failed to update jalab" });
        }

        return res.status(200).json({ message: "Edited", jalab: updatedJalab });
    } catch (error) {
        console.error("Error updating jalab:", error.message);
        return res.status(500).json({ message: "Failed to update jalab", error: error.message });
    }
};

    const editJalabPage = (req, res) => {
        const jalabId = req.query.jalabId
        console.log(jalabId) 
       Jalabs.findById({_id: jalabId})
         .then((jalab) => {
             res.status(200).json({message: "Edited", jalab})
         })
         .catch(error => {
             res.status(404).json({message: "Failed to be Edited", error})
         })
     }
    const editBrandPage = (req, res) => {
       const brandId = req.query.brandId
       console.log(brandId)
        
      topBrands.findById({_id: brandId})
        .then((brand) => {
            res.status(200).json({message: "Edited", brand})
        })
        .catch(error => {
            res.status(404).json({message: "Failed to be Edited", error})
        })
    }
    const editArrivalPage = (req, res) => {
       const arrivalId = req.query.arrivalId
       console.log(arrivalId)
        
      newArrival.findById({_id: arrivalId})
        .then((arrival) => {
            res.status(200).json({message: "Edited", arrival})
        })
        .catch(error => {
            res.status(404).json({message: "Failed to be Edited", error})
        })
    }
    const editBestSellerPage = (req, res) => {
       const bestSellerId = req.query.bestSellerId
        
      bestSellers.findById({_id: bestSellerId})
        .then((bestSeller) => {
            res.status(200).json({message: "Edited", bestSeller})
        })
        .catch(error => {
            res.status(404).json({message: "Failed to be Edited", error})
        })
    }
    const updateBrand = async (req, res) => {
            const { brandId } = req.query;
            const { brandName, description } = req.body;
            let { imageUrl } = req.body;
        
            try {
                if (!brandId || !brandName || !description || (!imageUrl && !req.file)) {
                    return res.status(400).json({ message: "One or more required fields are missing" });
                }
        
                if (req.file) {
                    imageUrl = await uploadFileToFirebase(req.file);
                }
        
                const brandData = { brandName, imageUrl, description };
                await topBrands.findByIdAndUpdate(brandId, brandData, { new: true });
        
                return res.status(200).json({ message: "Brand Updated Successfully" });
            } catch (error) {
                console.error("Error updating brand:", error);
                return res.status(500).json({ message: "Server error", error: error.message });
            }
        };
        
        const updateBestSeller = async (req, res) => {
            const bestSellerId = req.query.bestSellerId;
            try {
                const { productName, description, category, price, oldPrice } = req.body;
        
                if (!['Male', 'Female', 'Children'].includes(category)) {
                    return res.status(400).json({ message: "Invalid category" });
                }
        
                let imageUrl = req.body.imageUrl; // Use existing imageUrl if provided
        
                if (req.file) {
                    const file = req.file;
                    const storageRef = ref(storage, `images/${file.originalname}`);
                    const snapshot = await uploadBytes(storageRef, file.buffer);
                    imageUrl = await getDownloadURL(snapshot.ref);
                }
        
                const bestData = {
                    productName,
                    imageUrl,
                    description,
                    price,
                    oldPrice,
                    category
                };
        
                const updatedBestSeller = await bestSellers.findByIdAndUpdate(bestSellerId, bestData, { new: true });
        
                if (!updatedBestSeller) {
                    return res.status(404).json({ message: "Failed to update arrival" });
                }
        
                return res.status(200).json({ message: "Edited", bestSeller: updatedBestSeller });
            } catch (error) {
                console.error("Error updating arrival:", error.message);
                return res.status(500).json({ message: "Failed to update arrival", error: error.message });
            }
        };
    
    const removeBrand = (req, res) => {
        const { brandId } = req.query; 
        topBrands.findByIdAndDelete(brandId)
            .then((brand) => {
                if (!brand) {
                    return res.status(404).json({ message: "Brand not found" });
                }
                res.status(200).json({ message: "Brand deleted", brand });
            })
            .catch((error) => {
                res.status(500).json({ message: "Failed to delete brand", error });
            });
    }
    const removeFromBestSeller_Jalab = (req, res) => {
        const { bestId } = req.query; 
        bestSellers.findByIdAndDelete(bestId) 
            .then((brand) => {
                if (!brand) {
                    return res.status(404).json({ message: "Best seller not found" });
                }
                res.status(200).json({ message: "Best seller deleted", brand });
            })
            .catch((error) => {
                res.status(500).json({ message: "Failed to delete best seller", error });
            });
    };
    
    
    const removeFromNewArrival_Jalab = (req, res) => {
        const { newArrivalId } = req.query; 
        newArrival.findByIdAndDelete(newArrivalId)
            .then((brand) => {
                if (!brand) {
                    return res.status(404).json({ message: "Brand not found" });
                }
                res.status(200).json({ message: "Brand deleted", brand });
            })
            .catch((error) => {
                res.status(500).json({ message: "Failed to delete brand", error });
            });
    }
    const deleteAllBrands = (req, res) => {
        topBrands.deleteMany() 
            .then((result) => {
                res.status(200).json({ message: "All brands deleted", result });
            })
            .catch((error) => {
                res.status(500).json({ message: "Failed to delete all brands", error });
            });
    };
    
    
    const deleteAllBestSellers = (req, res) => {
        bestSellers.deleteMany()
            .then((result) => {
                res.status(200).json({ message: "All best sellers deleted", result });
            })
            .catch((error) => {
                res.status(500).json({ message: "Failed to delete all best sellers", error });
            });
    };
    
    const deleteAllNewArrivals = (req, res) => {
        newArrival.deleteMany()
        .then((brand) => {
            res.status(200).json({message: "Brand Deleted", brand})
        })
        .catch(error => {
            res.status(404).json({message: "Brand Failed to be Deleted", error})
        })
    }
    
    
    
    const deleteSingleMaleJalab = (req, res) => {
        jalabId = req.query.jalabId
        Jalabs.findByIdAndDelete({_id: jalabId})
        .then((jalab) => {
            res.status(200).json({message: "Jalab Deleted", jalab})
        })
        .catch(error => {
            res.status(404).json({message: "Jalab Failed to be Deleted", error})
        })
    }
    
    
    const deleteAllMaleJalabs = (req, res) => {
        Jalabs.deleteMany()
        .then((jalab) => {
            res.status(200).json({message: "Jalabs Deleted", jalab})
        })
        .catch(error => {
            res.status(404).json({message: "Jalabs Failed to be Deleted", error})
        })
    }
    
module.exports = {
    createFragrance,
    createJalab,
    jalabsToCart,
    jalabsInCart,
    deleteJalabFromCart,
    deleteAllJalabsFromCart,
    createToTopBrand,
    createToNewArrival_Jalab,
    createToBestSeller_Jalab,
    postCheckout,
    getFromNewArrival_Jalab,
    getFromTopBrand,
    getFromBestSeller_Jalab,
    getMaleJalab,
    getFemaleJalab,
    getChildrenJalab,
    updateArrival,
    updateBestSeller,
    updateBrand,
    updatesinglejalab,
    editArrivalPage,
    editBestSellerPage,
    editBrandPage,
    editJalabPage,
    removeBrand,
    removeFromBestSeller_Jalab,
    removeFromNewArrival_Jalab,
    deleteAllBestSellers,
    deleteAllBrands,
    deleteAllMaleJalabs,
    deleteAllNewArrivals,
    deleteSingleMaleJalab
};
