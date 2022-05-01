const User = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    
    signup: ((req, res, next)=>{

        User.findOne({telephone: req.body.telephone})
        .then((user)=>{
            if(!user)
            {
                bcrypt.hash(req.body.password, 10)
                .then((hash)=>{
                    var newsuer = new User({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        password: hash,
                        username: req.body.username,
                        role: req.body.role,
                        telephone: req.body.telephone,
                        numeroCNI: req.body.numeroCNI
                    })
                    newsuer.save()
                    .then(()=>{
                        res.status(201).json({status: "success" ,message: "user saved"})
                    })
                })
                .catch((err)=>{
                    res.status(400).json({
                        err: err
                    })
                })
            }

            else{
                return res.status(400).json({status: "echec", err: "utilisateur existe deja"})
            }
        })

        .catch((err)=>{
            res.status(400).json({status: 'echec', err: err})
        })

       

    }),

    logIn: ((req, res, next)=>{
        User.findOne({ telephone: req.body.telephone })
          .then(user => {
            if (!user) {
              return res.status(401).json({status: 'echec' ,err: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                if (!valid) {
                  return res.status(401).json({status: 'echec' ,err: 'Mot de passe incorrect !' });
                }
                var token =  jwt.sign(
                  {...{ userId: user._id }, expiresIn: 24*60*60}, 
                  "ASANEALIKEY"
                );
                console.log(token)
                res.status(200).json({
                  
                  userId: user._id,
                  token: token
                });
              })
              .catch(error => {
                console.log(error)
                res.status(500).json({status:"echec", err: err });
              })
          })
          .catch(error => res.status(500).json({ error }));
    })
}