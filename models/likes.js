const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  bodyParser = require('body-parser');

const likesSchema = new Schema({
  ip:{
    type: String,
    required: true
  },
  stock: {
  	type: String,
    required: true
  },
  isLiked: {
    type : Boolean    
  },
});


// create the model
var likesModel = mongoose.model('Likes', likesSchema);

// export the model
module.exports = likesModel;
