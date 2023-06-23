const jwt =  require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'ASSANEALIKEY');
      const userId = decodedToken.userId;
      const timeExp = decodedToken.expiresIn;

      console.log(timeExp);
  
      if (req.body.userId && req.body.userId !== userId ) {
        console.log("invalid user");
       return res.status(401).json({message: 'invalid user'})
      } 
      else if(decodedToken.exp){
        return res.status(401).json({message: 'Token Expiré'})

      }
      else {
        next();
      }
    } catch(err) {
      console.log(err)
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  };