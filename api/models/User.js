/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

var mongoose = require('mongoose');
bcrypt = require('bcrypt');

SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String.fromCharCode,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {timestamps: true});


UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {return next();}

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {return next(err);}

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {return next(err);}
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {return cb(err);}
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
Usage;
