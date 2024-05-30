const path = require("path");
const Fragrance = require("../models/addFragrance.model");
const Clients = require("../models/userCheckout.model")

const createFragrance = (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.price) {
    return res.status(400).json({message: "A required field is misssing"})
} 
    const fragranceData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    Fragrance.create(fragranceData)
    .then((fragrance) => {
        res.status(201).json({message: "New Fragrance Created Successfully"});
    })
    .catch((error) => {
        res.status(500).json({message: "server error", error})
    })
}


const Jalabs = require("../models/addJalabs.model");
const Cart = require("../models/cart.Model");
const topBrands = require("../models/topBrands.model")
const bestSellers = require("../models/bestSellers.Model")
const newArrival = require("../models/newArrival.Model")

const createJalab = (req, res) => {
    const { name, imageUrl, description, category, price, oldPrice } = req.body;

    if (!name || !price || !oldPrice || !description || !category || (!imageUrl && !req.file)) {
        return res.status(400).json({ message: "One or more required fields are missing" });
    }

    if (!['Male', 'Female', 'Children'].includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
    }

    const imageFilePath = req.file ? `uploads/${req.file.filename}` : imageUrl;


    const jalabData = {
        name,
        imageUrl: imageFilePath,
        description,
        price,
        oldPrice,
        category
    };

    Jalabs.create(jalabData)
        .then((jalab) => {
            res.status(201).json({ message: "New Jalab Created Successfully", jalab });
        })
        .catch((error) => {
            res.status(500).json({ message: "Server error", error });
        });
};

const addJalab = (req, res) => {
    category = req.body.category
    Jalabs.find({category: "Male"})
      .then((jalabs) => {
        res.json(jalabs); 
      })
      .catch((error) => {
        console.error('Error fetching jalabs:', error.message);
        res.status(500).json({ message: 'Server error' });
      });
  };

const femaleJalab = (req, res) => {
    category = req.body.category
    Jalabs.find({category: "Female"})
      .then((jalabs) => {
        res.json(jalabs); 
      })
      .catch((error) => {
        console.error('Error fetching jalabs:', error.message);
        res.status(500).json({ message: 'Server error' });
      });
  };
const childrenJalab = (req, res) => {
    category = req.body.category
    Jalabs.find({category: "Children"})
      .then((jalabs) => {
        res.json(jalabs); 
      })
      .catch((error) => {
        console.error('Error fetching jalabs:', error.message);
        res.status(500).json({ message: 'Server error' });
      });
  };
  const jalabsToCart = (req, res) => {
    const { pricePerQuantity, totalPrice, quantity, itemDetails } = req.body;
   
    const sessionId = req.query.sessionId
   
    if (quantity === 0) {
      return res.status(400).json({ message: "Quantity cannot be zero!" });
    }
  
    const cartDetails = {
      pricePerQuantity,
      totalPrice,
      quantity,
      sessionId,
      itemDetails,
    };
    
      Cart.create(cartDetails)
        .then((cart) => {
          res.status(200).json({ message: "Jalab added to cart successfully", cart });
        })
        .catch(error => {
            console.error(error)
          res.status(500).json({ message: "Failed to add jalab to cart", error });
        });
    };
    
    
  const jalabsInCart = (req, res) => {
    const sessionId = req.query.sessionId
    Cart.find({sessionId})
    .then((jalabs) => {
        res.status(200).json({message: "Jalabs Fetched Successfully", jalabs})
    })
    .catch(error => {
        res.status(404).json({message: "Jalabs Failed to be fetched", error})
    })
  }
  
  const adminCart = (req, res) => {

    Clients.find()
        .then((carts) => {
            if (!carts.length) {
                return res.status(404).json({ message: "No carts found for this session" });
            }
            console.log("Carts Fetched Successfully:", carts);
            res.status(200).json({ message: "Carts Fetched Successfully", carts });
        })
        .catch((error) => {
            console.error("Error Fetching Carts:", error);
            res.status(500).json({ message: "Error Fetching Carts", error });
        });

};
const deleteJalabFromCart = (req, res) => {
    const jalabId = req.query.jalabId;
    Cart.findByIdAndDelete(jalabId)
    .then(() => {
        res.status(200).json({message: "Jalab Deleted Successfuy"});
    })
    .catch((error) => {
        res.status(404).json({message: "Failed to Delete Jalab", error});
    })
}
 
const deleteAllJalabsFromCart = (req, res) => {
    Cart.deleteMany()
    .then(() => {
        res.status(200).json({message: "All Jalabs Deleted Successfuy"});
    })
    .catch((error) => {
        res.status(404).json({message: "Failed to Delete All Jalabs", error});
    })
}

const createToTopBrand = (req, res) => {
    const { brandName, imageUrl, description} = req.body;

    if (!brandName || !description || (!imageUrl && !req.file)) {
        return res.status(400).json({ message: "One or more required fields are missing" });
    }
    const imageFilePath = req.file ? `uploads/${req.file.filename}` : imageUrl;

    const brandData = {
        brandName,
        imageUrl: imageFilePath,
        description
    };

    topBrands.create(brandData)
        .then((brand) => {
            res.status(201).json({ message: "New Brand Created Successfully", brand });
        })
        .catch((error) => {
            res.status(500).json({ message: "Brand Failed to be added", error });
        });
};

const createToNewArrival_Jalab = (req, res) => {
    const { productName, imageUrl, description, category, price, oldPrice } = req.body;

    if (!productName || !price || !oldPrice || !description || !category || (!imageUrl && !req.file)) {
        return res.status(400).json({ message: "One or more required fields are missing" });
    }

    if (!['Male', 'Female', 'Children'].includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
    }

    const imageFilePath = req.file ? `uploads/${req.file.filename}` : imageUrl;


    const jalabData = {
        productName,
        imageUrl: imageFilePath,
        description,
        price,
        oldPrice,
        category
    };

    newArrival.create(jalabData)
        .then((jalab) => {
            res.status(201).json({ message: "New Jalab Created Successfully", jalab });
        })
        .catch((error) => {
            res.status(500).json({ message: "Server error", error });
        });
};

const createToBestSeller_Jalab = (req, res) => {
    const { productName, imageUrl, description, category, price, oldPrice } = req.body;

    if (!productName || !price || !oldPrice || !description || !category || (!imageUrl && !req.file)) {
        return res.status(400).json({ message: "One or more required fields are missing" });
    }

    if (!['Male', 'Female', 'Children'].includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
    }
    const imageFilePath = req.file ? `uploads/${req.file.filename}` : imageUrl;



    const jalabData = {
        productName,
        imageUrl: imageFilePath,
        description,
        price,
        oldPrice,
        category
    };

    bestSellers.create(jalabData)
        .then((jalab) => {
            res.status(201).json({ message: "New Jalab Created Successfully", jalab });
        })
        .catch((error) => {
            res.status(500).json({ message: "Server error", error });
        });
}; 
    const getFromBestSeller_Jalab = (req, res) => {
    bestSellers.find()
    .then((jalab) => {
        res.status(200).json({message: "Jalab gotten Successfully to Best Seller", jalab})
    })
    .catch(error => {
        res.status(404).json({message: "Failed to get Jlab to Best Seller", error})
    })
    }

const getFromNewArrival_Jalab = (req, res) => {
    newArrival.find()
    .then((jalab) => {
        res.status(200).json({message: "Jalab gotten Successfully to New Arrival", jalab})
    })
    .catch(error => {
        res.status(404).json({message: "Failed to get Jlab to New Arrival", error})
    })
    }
    
const getFromTopBrand = (req, res) => {
    topBrands.find()
    .then((brands) => {
        res.status(200).json({message: "Brand gotten Successfully to Top Brands", brands})
    })
    .catch(error => {
        res.status(404).json({message: "Failed to get to Top Brands", error})
    })
    }
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
    const updateBrand = (req, res) => {
        const brandId = req.query.brandId
        
        const { brandName, imageUrl, description} = req.body;

        if (!brandName || !description || (!imageUrl && !req.file)) {
            return res.status(400).json({ message: "One or more required fields are missing" });
        }
        const imageFilePath = req.file ? `uploads/${req.file.filename}` : imageUrl;
    
        const brandData = {
            brandName,
            imageUrl: imageFilePath,
            description
        };
             topBrands.updateOne({_id: brandId}, brandData)
        .then((brand) => {
            res.status(200).json({message: "Edited", brand})
        })
        .catch(error => {
            res.status(404).json({message: "Failed to be Edited", error})
        })
    }
    const updateArrival = (req, res) => {
        const arrivalId = req.query.arrivalId
        
        const { productName, description, category, price, oldPrice } = req.body;
        const imageFilePath = req.file ? `uploads/${req.file.filename}` : imageUrl;

        if (!['Male', 'Female', 'Children'].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }
    
        if (req.file) {
            imageUrl = `uploads/${req.file.filename}`;
        }
        
        const arrivalData = {
            productName,
            imageUrl: imageFilePath,
            description,
            price,
            oldPrice,
            category
        };
        newArrival.updateOne({_id: arrivalId}, arrivalData)
        .then((arrival) => {
            res.status(200).json({message: "Edited", arrival})
        })
        .catch(error => {
            res.status(404).json({message: "Failed to be Edited", error})
        })
    }
    const updateBestSeller = (req, res) => {
        const bestSellerId = req.query.bestSellerId
        
        const { productName, description, category, price, oldPrice } = req.body;
        const imageFilePath = req.file ? `uploads/${req.file.filename}` : imageUrl;

        if (!['Male', 'Female', 'Children'].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }
            
        
        const bestSellerData = {
            productName,
            imageUrl: imageFilePath,
            description,
            price,
            oldPrice,
            category
        };
        bestSellers.updateOne({_id: bestSellerId}, bestSellerData)
        .then((bestSeller) => {
            res.status(200).json({message: "Edited", bestSeller})
        })
        .catch(error => {
            res.status(404).json({message: "Failed to be Edited", error})
        })
    }
    
    const updatesinglejalab = (req, res) => {
        const jalabId = req.query.jalabId
        
        const { name, description, category, price, oldPrice } = req.body;
        const imageFilePath = req.file ? `uploads/${req.file.filename}` : imageUrl;

        if (!['Male', 'Female', 'Children'].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }
        
        
        if (req.file) {
            imageUrl = `uploads/${req.file.filename}`;
        }
        
        const jalabData = {
            name,
            imageUrl: imageFilePath,
            description,
            price,
            oldPrice,
            category
        }    
        Jalabs.updateOne({_id: jalabId}, jalabData)
        .then((jalab) => {
            res.status(200).json({message: "Edited", jalab})
        })
        .catch(error => {
            res.status(404).json({message: "Failed to be Edited", error})
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
    addJalab,
    femaleJalab,
    childrenJalab,
    jalabsToCart,
    jalabsInCart,
    adminCart,
    deleteJalabFromCart,
    deleteAllJalabsFromCart,
    createToBestSeller_Jalab,
    createToNewArrival_Jalab,
    getFromBestSeller_Jalab,
    getFromNewArrival_Jalab,
    getFromTopBrand,
    createToTopBrand,
    removeBrand,
    removeFromBestSeller_Jalab,
    removeFromNewArrival_Jalab,
    deleteAllBrands,
    deleteAllBestSellers, 
    deleteAllNewArrivals,
    deleteSingleMaleJalab,
    deleteAllMaleJalabs,
    editBrandPage,
    editArrivalPage,
    updateBrand,
    updateArrival,
    editBestSellerPage,
    updateBestSeller,
    editJalabPage,
    updatesinglejalab
}

