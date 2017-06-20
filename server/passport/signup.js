/**
 * Created by dev on 6/20/2017.
 */
// passport.use('signup', new LocalStrategy({
//   passReqToCallback : true
//   },
//   function(req, username, password, done) {
//     findOrCreateUser = function(){
//       //find user in Mongo with provided username
//       User.findOne({'username': username}, function(err, user) {
//         // if error returned
//         if (err) {
//           console.log("Error in signup: " + err);
//           return done(err);
//         }
//         // if exists
//         if (user) {
//           console.log("User already exists");
//           return done(null, false, req.flash('message', 'User already exists'));
//         } else {
//           var newUser = new User();
//           // set local credentials
//           newUser.username = username;
//           newUser.password = createHash(password);
//           newUser.email = req.param('email');
//
//           // save user
//           newUser.save(function(err) {
//             if (err) {
//               console.log('Error in saving user: ' + err);
//               throw err;
//             }
//             console.log('User registration successful.');
//             return done(null, newUser);
//           });
//         }
//       });
//     };
//     // delay the execution of findOrCreateUser and execute method
//     // in next tick of the event loop
//     process.nextTick(findOrCreateUser);
// }));
