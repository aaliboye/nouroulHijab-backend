const Ticket = require('../model/ticket.model');

module.exports = {
    listVentes: ((req, res, next)=>{
        Ticket.find()
        .then((tickets)=>{
            res.status(200).json(tickets)
        })
        .catch((err)=>{
            res.status(400).json({
                success: false,
                message: err
            })
        })
    }),

    listVenteToday: ((req, res, next)=>{
        Ticket.find({createdAt: {$gt: Date.now()-24*60*60*1000}})
        .then((tickets)=>{
            res.status(200).json(tickets)
        })
        .catch((err)=>{
            res.status(400).json({
                success: false,
                message: err
            })
        })
    }),

    hideVentes:((req, res, next)=>{

       var productName =  req.params.productName;
       
       console.log(productName);

       Ticket.updateMany({productName: productName}, {visible: false, evaluatedAt: Date.now()})
       .then(()=>{
           res.status(200).json({success: true, message: "evalue avec succes"})
       })
       .catch(()=>{
           res.status(400).json({succes: false, message: "peut pas etre evalue"})
       })
    })
}