const { log } = require('debug/src/browser');
const Category = require('../model/category.model');
const jwt = require('jsonwebtoken')

module.exports = {

    addCategory: ((req, res, next)=>{
        delete req.body._id;

        console.log(req.body);

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'ASSANEALIKEY');
        console.log(token);
        console.log(decodedToken);
        const userId = decodedToken.userId;

        console.log(userId);

        var cat = new Category({
            name: req.body.name,
            description: req.body.description,
            userId: userId
        })

        cat.save()
        .then(()=>{
            res.status(200).json({
                success: true,
                message: "category saved"
            })
        })
        .catch((err)=>{
            res.status(400).json({
                success: false,
                message: err
            })
        })
    }),

    listCategory: ((req, res, next)=>{

        Category.find()
        .then((categories)=>{
            res.status(200).json(categories)
        })
        .catch((err)=>{
            res.status(400).json({
                success: false,
                message: err
            })
        })
    })
}