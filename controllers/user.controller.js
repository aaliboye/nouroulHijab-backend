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
                        res.status(201).json({success: true, message: "user saved"})
                    })
                })
                .catch((err)=>{
                    res.status(400).json({
                        success: false,
                        message: err
                    })
                })
            }

            else{
                return res.status(400).json({success: false, err: "utilisateur existe deja"})
            }
        })

        .catch((err)=>{
            res.status(400).json({success: false, message: err})
        })

       

    }),

    logIn: ((req, res, next)=>{
        User.findOne({ telephone: req.body.telephone })
          .then(user => {
            if (!user) {
              res.status(400).json({success: false ,message: 'Utilisateur non trouvé !' });
            }
            else{
              bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                  if (!valid) {
                    res.status(400).json({success: false ,message: 'Mot de passe incorrect !' });
                  }
                  else{

                    var token =  jwt.sign(
                      {...{ userId: user._id }, expiresIn: 24*60*60}, 
                      "ASSANEALIKEY"
                      );
                      console.log(token)
                      res.status(200).json({
                        
                        userId: user._id,
                        token: token
                      });
                    }
                })
                .catch(error => {
                  console.log(err)
                  res.status(500).json({success: false, message: err });
                })
            }
          })
          .catch(err => res.status(400).json({success: true, message: err }));
    })
}