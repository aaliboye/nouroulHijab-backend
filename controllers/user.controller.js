const User = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('../providers/mailer')
const { use } = require('../routes/users')


module.exports = {
    
    signup: ((req, res, next)=>{

        User.findOne({email: req.body.email})
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
                        email: req.body.email,
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
      var pwd = genPwd(8);
      var pwdHash = await bcrypt.hash(pwd, 10)
      if(pwd){
        user.password = pwdHash
        console.log(user);

        try {
          
        let saveUser = await user.save()
  
        if(saveUser){
          
          await mailer.sendMail(`pwd: ${pwd}`, req.body.email, "aalitestdev@gmail.com",res)
  
          // console.log(sendmail);
          // if(sendmail){
          //   return res.status(200).json({success: true, message: "mail envoyé"})
          // }
          // if(sendmail){
          //   return res.status(400).json({success: false, message: "mail non envoyé"})
          // }
        }
        else{
          return res.json({success: false, message: 'user not saved'})
        }
        } catch (error) {
          return res.json({success: false, message: 'user not saved'})
          
        }
  
      }
      else{
        return res.json({success: false, message: 'user not saved'})

      }

    }),


    
    resetPassword: (async(req, res, next)=>{
      console.log(`--------body---------${req.body.email}`);
      let user = await User.findOne({email: req.body.email})
      console.log(`--------user---------${user}`);

      if(user){
        var pwd = genPwd(8);
        var pwdHash = await bcrypt.hash(pwd, 10)
        const result = await User.updateOne({email: req.body.email}, {status: 'desactive', password: pwdHash})
        console.log(`--------result---------${JSON.stringify(result)}`);
        
        if(result.modifiedCount == 1)
          await mailer.sendMail(`pwd: ${pwd}`, req.body.email, "aalitestdev@gmail.com",res)
        else
          return res.json({success: false, message: 'user not found'})


      }
      else{
        return res.json({success: false, message: 'user not found'})
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
              user.isFirstLogin = false;
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
              console.log('user');
              console.log(user);
              console.log("compare  "+bcrypt.compare(req.body.password, user.password));
              
              bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                  if (!valid) {
                    res.status(400).json({success: false ,message: 'Mot de passe incorrect !' });
                  }
                  else{

                    var dateActuelle = new Date();

                  // Convertir la date en secondes
                        var secondes = Math.floor(dateActuelle.getTime() / 1000);

                    var token =  jwt.sign(
                      {...{ userId: user._id, role: user.role._id }, expiresIn: 24*60*60, createdAt:secondes }, 
                      "ASSANEALIKEY"
                      );
                    var refreshToken =  jwt.sign(
                      {...{ userId: user._id, role: user.role._id }, expiresIn: 30*24*60*60}, 
                      "ASSANEALIKEY"
                      );
                      console.log(token)
                      console.log(user)
                      res.status(200).json({ 
                        user: user,
                        accessToken: token,
                        refreshToken: refreshToken
                      });
                    }
                })
                .catch(error => {
                  console.log(`error------${error}`)
                  res.status(500).json({success: false, message: err });
                })
            }
          })
          .catch(err => res.status(400).json({success: true, message: err }));
    }),

    logInWithTelephone: ((req, res, next)=>{
      console.log(req.body);
        User.findOne({ telephone : req.body.telephone }).populate('role').exec()
          .then((user) => {
            if (!user) {
              res.status(400).json({success: false ,message: 'Utilisateur non trouvé !' });
            }
            else{
              console.log('user');
              console.log(user);
              bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                  if (!valid) {
                    res.status(400).json({success: false ,message: 'Mot de passe incorrect !' });
                  }
                  else{

                    var dateActuelle = new Date();

                  // Convertir la date en secondes
                        var secondes = Math.floor(dateActuelle.getTime() / 1000);

                    var token =  jwt.sign(
                      {...{ userId: user._id, role: user.role._id }, expiresIn: 24*60*60, createdAt:secondes }, 
                      "ASSANEALIKEY"
                      );
                    var refreshToken =  jwt.sign(
                      {...{ userId: user._id, role: user.role._id }, expiresIn: 30*24*60*60}, 
                      "ASSANEALIKEY"
                      );
                      console.log(token)
                      console.log(user)
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

    desactiverUser: ((req, res, next)=>{
      console.log(req.params.idUser);
      User.updateOne({_id: req.params.idUser}, {status: 'desactive'})
      .then((result) => {
        return res.status(200).json({success: true, message: 'user desactivé'})
      }).catch((err) => {
        return res.json({success: true, message: 'user non desactivé'})
        
      });
    }),
    
    activerUser: ((req, res, next)=>{
      console.log(req.params.idUser);
      User.updateOne({_id: req.params.idUser}, {status: 'active'})
      .then((result) => {
        return res.status(200).json({success: true, message: 'user activé'})
      }).catch((err) => {
        return res.json({success: true, message: 'user non activé'})
        
      });
    }),
    
    getOneUser: ((req, res, next)=>{
       User.findOne({_id: req.params.idUser}).populate('role').exec()
       .then((user) => {
        return res.status(200).json({success: true, user: user})
       }).catch((err) => {
        return res.status(400).json({success: true, message: 'user not found'})     
       });
    }),

    listUser: ((req, res, next)=>{
      User.find().populate('role').exec()
      .then((result) => {
        return res.status(200).json({users: result})
      }).catch((err) => {
        return res.status(400).json({error: err})
        
      });
    }),

    isFirstLogin: ((req, res, next)=>{
      var email = req.body.email;
    }),


}


 function genPwd (length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}