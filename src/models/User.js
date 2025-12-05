const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const newUserSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    }
  },
  { timestamps: true }
);

newUserSchema.pre('save', async function() {
  const user = this;
  if(!user.isModified('password')) return ;
  try{
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(this.password, salt);
    this.password = hash_password;
  } catch(err) {
    throw new Error(err);
  }
});

newUserSchema.methods.comparePassword = async function(candidatePassword) {
  try{
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch(err) {
    throw new Error(err); 
  }
}

const User = mongoose.model('User', newUserSchema);

module.exports = User;