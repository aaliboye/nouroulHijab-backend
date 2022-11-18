const Produit = require('../model/produit.model');
const Category = require ('../model/category.model');
const Ticket = require('../model/ticket.model')
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const { use } = require('bcrypt/promises');

module.exports = {
    
    listProduits: ((req, res, next)=>{
        Produit.find()
        .then((produits)=>{
            res.status(200).json(produits);
         })
         .catch((err)=>{
             console.log(err)
             res.status(404).json({success: true, message: err});
         })
    }),

    getOneProoduit: ((req, res, next)=>{
        
    }),

    listProduitsByCategory: ((req, res, next)=>{
        var idCategory = req.params.idCategory;
        Produit.find({categoryId: idCategory})
        .then((produits)=>{
            res.status(200).json(produits)
        })
        .catch((err)=>{
            res.status(404).json({
                status: "echec",
                message: err
            })
        })
    }),

    addProduit: ((req, res, next)=>{
        delete req.body._id

        
        const userName = ""
        var categoryName= ""


        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'ASSANEALIKEY');
        const userId = decodedToken.userId;

        Produit.findOne({name: req.body.name})
        .then((produit)=>{
            if(!produit){
                Category.findOne({_id: req.body.categoryId})
                .then((category)=>{
                    console.log(category);
                    this.categoryName = category.name
                    
                    console.log(this.categoryName);
                    var prod = new Produit({
                        name: req.body.name,
                        description: req.body.description,
                        prixUnit: req.body.prixUnit,
                        prixGros: req.body.prixGros,
                        stock: req.body.stock,
                        userId: userId,
                        categoryId: req.body.categoryId,
                        categoryName: this.categoryName
                     })
                     console.log(prod);
                     prod.save()
                     .then(()=>{
                         res.status(200).json({success: true, message: 'vous avez ajouté un produit'})
                     })
                     .catch((err)=>{
                         res.status(400).json({success: false, message: err})
                     })
        
                })
                .catch((err)=>{
                    res.status(400).json({success: false,
                    message: err})
                }) 
            }
            else{
                res.status(400).json({success: false, message: "produit existe deja"})
            }
        })

        .catch((err)=>{
            res.status(400).json({status: "echec",
            message: err})
        })

        // Category.findOne({_id: req.body.categoryId})
        // .then((category)=>{
        //     console.log(category);
        //     this.categoryName = category.name
            
        //     console.log(this.categoryName);
        //     var prod = new Produit({
        //         name: req.body.name,
        //         description: req.body.description,
        //         prixUnit: req.body.prixUnit,
        //         prixGros: req.body.prixGros,
        //         stock: req.body.stock,
        //         userId: userId,
        //         categoryId: req.body.categoryId,
        //         categoryName: this.categoryName
        //      })
        //      console.log(prod);
        //      prod.save()
        //      .then(()=>{
        //          res.status(200).json({status:'success', message: 'vous avez ajouté un produit'})
        //      })
        //      .catch((err)=>{
        //          res.status(400).json({status: 'ecec', err: err})
        //      })

        // })
        // .catch((err)=>{
        //     res.status(400).json(err)
        // }) 

        // User.findOne({_id: userId})
        // .then((user)=>{
        //     this.userName = user.firstname+' '+user.lastname
        // })

        // var prod = new Produit({
        //    name: req.body.name,
        //    description: req.body.description,
        //    prixUnit: req.body.prixUnit,
        //    prixGros: req.body.prixGros,
        //    stock: req.body.stock,
        //    userId: userId,
        //    categoryId: req.body.categoryId,
        //    categoryName: this.categoryName
        // })
        // console.log(prod);
        // prod.save()
        // .then(()=>{
        //     res.status(200).json({status:'success', message: 'vous avez ajouté un produit'})
        // })
        // .catch((err)=>{
        //     res.status(400).json({status: 'ecec', err: err})
        // })
    }),

    updateProduit: ((req, res, next)=>{
        
    }),

    addStock: ((req, res, next)=>{
        var id = req.params.idProduit;
        var stock = req.body.stock
        Produit.findOne({_id: id})
        .then((produit)=>{
            var newstock = produit.stock + stock;
            Produit.updateOne({_id: id}, {stock: newstock})
            .then(()=>{
                res.status(200).json({success: true, message: 'stock added'})
            })
            .catch((err)=>{
                res.status(400).json({success: true, message: err})
            })
        })
        .catch((err)=>{
            res.status(400).json({success: true, message: err})
        })
    }),


    deleteProduit: ((req, res, next)=>{

    }),

    sellProduct: ((req, res, next)=>{

    }),

    vendreProduit: (req, res, next)=>{
        
        var productName = req.body.productName;
        var qte = req.body.quantite;
        var type = req.body.type;
        var prix = 0;   
        var userName = ''
        var categoryName = ''
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'ASSANEALIKEY');
        const userId = decodedToken.userId;

        User.findOne({_id: userId})
        .then((user)=>{
            userName = user.firstname+' '+user.lastname
            console.log(userName);
        })

        Category.findOne({_id: req.body.categoryId})
        .then((category)=>{
            console.log(category);
            categoryName = category.name
        })
    
        Produit.findOne({name: productName})
        .then((produit)=>{
            if(type=="gros"){
                prix = produit.prixGros
            }
            else{
                prix = produit.prixUnit
            }
            if(qte <= produit.stock){
                var newstock = produit.stock - qte;
                var ticket = new Ticket({
                    productName: productName,
                    type: type,
                    quantite: qte,
                    prixTotal: qte * prix,
                    userName: userName,
                    userId: userId,
                    categoryName: categoryName
                    
                })
                ticket.save().then(()=>{
                    Produit.updateOne({name: productName}, {stock: newstock, _id: produit._id})
                    .then(()=>{
                        res.status(200).json({success: true, message: `vous avez vendu ${qte} ${productName}`})
                    })
                    .catch((err)=>{
                        res.status(400).json({
                            success: false,
                            err: "echec ticket"
                        })  
                    })
                })
                .catch((err)=>{
                   res.status(400).json({
                    success: false,
                       err: err
                   })
                })
                

            }

            else{
                res.status(200).json({success: false, message: "la quantité est inuffisant"})
            }

        })
        .catch((err)=>{
            res.status(400).json({
                success: false,
                err: err
            })
        })
    },


}