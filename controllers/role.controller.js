const Role = require('../model/role.model');

module.exports = {

    addRole: ((req, res, next)=>{
        delete req.body._id;

        Role.findOne({name: req.body.name})
        .then((role)=>{
            if(role){
                return res.status(400).json({
                   status : "echec",
                   message: "role existe deja"
                })
            }
            else{
                var role = new Role({
                    name: req.body.name,
                    description: req.body.description
                })
                role.save()
                .then(()=>{
                    res.status(201).json({
                        status: "success",
                        message: "role ajouté avec succes"
                    })
                })
                .catch((err)=>{
                    res.status(400).json({
                        status: "echec",
                        err: err
                    })
                })
            }
        })
        .catch((err)=>{
            res.status(400).json({
                status: "echec",
                err: err
            })
        })
    }),

    listRoles: ((req, res, next)=>{

        Role.find()
        .then((roles)=>{
            res.status(200).json(roles)
        })
        .catch((err)=>{
            res.status(400).json({
                status: "success",
                err: err
            })
        })
    })
}