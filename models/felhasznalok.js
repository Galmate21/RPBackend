const mongoose = require('mongoose')
const bcrypt=require('bcryptjs');
const Felhasznalochema = new mongoose.Schema(
	{
		rId: { type: String, required: true},
		uName: { type: String, required: true, unique: true  },
    rName:{type:String, require:true},
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin:{type:Boolean, required:true},
	},
	{ collection: 'Users' }
)
Felhasznalochema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  

  Felhasznalochema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  




const model = mongoose.model('Felhasznalochema', Felhasznalochema)

module.exports = model
