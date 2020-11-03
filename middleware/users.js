module.exports = {
  validateRegister: (req, res, next) => {
	  if((req.body.firstName == "") || (req.body.lastName =="") || (req.body.email =="")|| (req.body.password == "") || (req.body.numTel =="")) {
		  return res.status(400).send({
        msg: 'All Fields Are Required'
      });
	  }
	   if (!req.body.firstName || req.body.firstName.length < 4) {
      return res.status(400).send({
        msg: 'Please enter a firstName with min 4 chars'
      });
    }
	 if (!req.body.lastName || req.body.lastName.length < 4) {
      return res.status(400).send({
        msg: 'Please enter a lastName with min 4 chars'
      });
    }
    // username min length 3
    if ((!req.body.email) || (!req.body.email.includes('@',0)) || (!req.body.email.includes('.',0))) {
      return res.status(400).send({
        msg: 'Please enter a valid email'
      });
    }
    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars'
      });
    }
	 if (!req.body.numTel || req.body.numTel.length < 8) {
      return res.status(400).send({
        msg: 'Please enter a Number phone with min 8 chars'
      });
    }
	  
    // password (repeat) does not match
   /* if (
      !req.body.password_repeat ||
      req.body.password != req.body.password_repeat
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match'
      });
    }*/
    next();
	
  },
  
  isLoggedIn: (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(
      token,
      'SECRETKEY'
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}
  
  
};