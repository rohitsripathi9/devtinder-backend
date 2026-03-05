const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    emailId: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"], lowercase: true, trim: true },
    skills: { type: [String], default: [] }, 
    about: { type: String, trim: true }, 
     photoUrl: {
      type: String,
      default: "https://imgs.search.brave.com/yOFX1qSEMWIswSBYLiK9GC4cJjj0gZbFzr7-sfcycHQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC80/Mi8wOC9hdmF0YXIt/ZGVmYXVsdC11c2Vy/LXByb2ZpbGUtaWNv/bi1zb2NpYWwtbWVk/aWEtdmVjdG9yLTU3/MjM0MjA4LmpwZw", // default avatar
    },
    about: { type: String, trim: true }, 

  },
  { timestamps: true } 
);


userSchema.methods.getJWT = async function(){
  const token = await jwt.sign({_id: this._id},"rohitjee55",{expiresIn:"7d"})
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const isPasswordValid = bcrypt.compare(passwordInputByUser,this.password);
  return isPasswordValid;
}


const User = mongoose.model("User", userSchema);

module.exports = User;
