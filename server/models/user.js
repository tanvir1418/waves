const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // used for token generation, authentication by token.
const SALT_I = 10; // used when hashing password.
require("dotenv").config(); // it proves environment secret key.

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 100,
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
});

// Hashing password and make password only use at the time of modification / registration.
userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// This function is used for password matching in login operation
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  // cb stands for 'CALL BACK' function
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    // candidatePassword is given by user and this.password is from the database stored password.
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// This function is used for token generation for user in login operation
userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), process.env.SECRET); //user '_id' from database which will further converted into hex-string and secret password from server environment(.env)
  //jwt = 'json web token' is required at top of user.js file.
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// This function is used for finding the user by token for authentication of user.
userSchema.statics.findByToken = function (token, cb) {
  // user created method
  var user = this;

  jwt.verify(token, process.env.SECRET, function (err, decode) {
    //here decode represents '_id'. (jwt.verify extract '_id' from 'token' using process.env.SECRET key)
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
