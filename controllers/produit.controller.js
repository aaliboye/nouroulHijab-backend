const Produit = require('../model/produit.model');
const Category = require ('../model/category.model');

module.exports = {
    
    listProduits: ((req, res, next)=>{
        Produit.find()
        .then((produits)=>{
            res.status(201).json(produits);
         })
         .catch((err)=>{
             console.log(err)
             res.status(404).json(err);
         })
    }),

    addProduit: ((req, res, next)=>{
        delete req.body._id

        var categoryName = ""
        Category.findOne({_id: req.body.categoryId})
        .then((category)=>{
            categoryName = category.name
        })
        .catch((err)=>{
            res.status(400).json(err)
        }) 

        var prod = new Produit({
           name: req.body.name,
           description: req.body.description,
           prixUnit: req.body.prixUnit,
           prixGros: req.body.prixGros,
           stock: req.body.stock,
           userId: req.body.userId,
           categoryId: req.body.categoryId
        })

        prod.save()
        .then(()=>{
            res.status(200).json({status:'success', message: 'vous avez ajouté un produit'})
        })
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
                res.status(200).json({message: 'stock added'})
            })
            .catch((err)=>{
                res.status(400).json({err: err})
            })
        })
        .catch((err)=>{
            res.status(400).json({err: err})
        })
    }),


    deleteProduit: ((req, res, next)=>{

    })


}