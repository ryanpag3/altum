/**
 * Created by dev on 6/19/2017.
 */
passport.use('login', new LocalStrategy({
  passReqToCallback : true
  },
  function(req, username, password, done){
    // check if username exists in db
    User.findOne({ 'username' : username },
    function(err, user){
      // if any error is thrown, return using the done method
      if (err)
        return done(err);
      // user does not exist
      if (!user){
        console.log('User not found with username ' + username);
        return done(null, false, req.flash('message', 'User not found.'));
      }
      // user exists but wrong password
      if (!user.verifyPassword(password)){
        console.log('Invalid Password');
        return done(null, false, req.flash('message', 'Invalid Password'));
      }

      // user and password match, return user from done method AKA successful login
      return done(null, user);
    });
  }));
