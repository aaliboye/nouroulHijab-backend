const jwt =  require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'ASSANEALIKEY');
      const userId = decodedToken.userId;
      const timeExp = decodedToken.expiresIn;
      const role = decodedToken.role;
      var dateActuelle = new Date();

// Convertir la date en secondes
      var secondes = Math.floor(dateActuelle.getTime() / 1000);
      var secondesMoins24h = Math.floor(dateActuelle.getTime() / 1000) - (24 * 60 * 60);


      console.log(`--------time to exp-------${decodedToken.createdAt+timeExp }`);
      console.log(`--------created At-------${decodedToken.createdAt}`);
      console.log(`--------role-------${decodedToken.role}`);
      
      console.log(`--------is expired-------${secondes>decodedToken.createdAt+timeExp }`);
      if(secondes>decodedToken.createdAt+timeExp ){
        return res.status(200).json({message: 'Token Expire'})
      }
      else{

        if (req.body.userId && req.body.userId !== userId ) {
          console.log("invalid user");
         return res.status(401).json({message: 'invalid user'})
        } 
        else {
          next();
        }
      }
  
    } catch(err) {
      console.log(err)
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  };