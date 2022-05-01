const Category = require('../model/category.model')

module.exports = {

    addCategory: ((req, res, next)=>{
        delete req.body._id;

        var cat = new Category({
            name: req.body.name,
            description: req.body.description
        })

        cat.save()
        .then(()=>{
            res.status(200).json({
                message: "category saved"
            })
        })
        .catch((err)=>{
            res.status(400).json({
                err: err
            })
        })
    })
}