const User = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('../providers/mailer')


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

    addUser: (async (req, res, next)=>{
      let user = new User({
        ...req.body
      })
      console.log(user);

      let saveUser = await user.save()

      if(saveUser){
        await mailer.sendMail("http://localhost:4200/#/set-password/"+saveUser._id, req.body.email, "aalitestdev@gmail.com",res)


        // console.log(sendmail);
        // if(sendmail){
        //   return res.status(200).json({success: true, message: "mail envoyé"})
        // }
        // if(sendmail){
        //   return res.status(400).json({success: false, message: "mail non envoyé"})
        // }
      }
    }),


    setPassword: (async(req, res, next)=>{
      var password = req.body.password;
      var confPassword = req.body.confirmPassword;
      console.log(req.body);
      if(password === confPassword){
        User.findOne({_id: req.params.idUser})
        .then((user) => {
          if(user && user.status == 'desactive'){
            bcrypt.hash(req.body.password, 10)
            .then(async(result) => {
              user.password = result;
              user.status = 'active'
              user.save()
              .then((result) => {
                console.log(result);
                return res.status(200).json({success: true, message:"Utilisateur sauvegardé"})
              }).catch((err) => {
                return res.json({success: false, message:"Utilisateur non sauvegardé"})
                
              });
            }).catch((err) => {
              return res.json({success: false, message:"Utilisateur non sauvegardé"})
              
            });
          }
        }).catch((err) => {
          return res.json({success: false, message:"Utilisateur not found"})
          
        });
      }
    }),

    logIn: ((req, res, next)=>{
      console.log(req.body);
        User.findOne({ email: req.body.email }).populate('role').exec()
          .then((user) => {
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
                    var refreshToken =  jwt.sign(
                      {...{ userId: user._id, role: user.role._id }, expiresIn: 30*24*60*60}, 
                      "ASSANEALIKEY"
                      );
                      console.log(token)
                      res.status(200).json({ 
                        user: user,
                        accessToken: token,
                        refreshToken: refreshToken
                      });
                    }
                })
                .catch(error => {
                  console.log(error)
                  res.status(500).json({success: false, message: err });
                })
            }
          })
          .catch(err => res.status(400).json({success: true, message: err }));
    }),

    getUserRole:((req, res, next)=>{
      console.log("dsklfjldsjflkjk");
      const token = req.headers.authorization.split(' ')[1];
      console.log(token);
      const decodedToken = jwt.verify(token, 'ASSANEALIKEY');
      const userId = decodedToken.userId;
      const timeExp = decodedToken.expiresIn;
      var role = decodedToken.role;

      console.log(decodedToken.exp);
      console.log(role);
      
      User.findOne({_id: userId}).populate('role').exec()
      .then((user) => {
        return res.status(200).json({role: user.role.name})
      }).catch((err) => {
        console.log(err);
        return res.status(400).json(err)
        
      });

      
    }),

    listUser: ((req, res, next)=>{
      User.find().populate('role').exec()
      .then((result) => {
        return res.status(200).json({users: result})
      }).catch((err) => {
        return res.status(400).json({error: err})
        
      });
    })


}