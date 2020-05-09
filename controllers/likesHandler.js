//adding my model
const Likes = require('../models/likes');

// catch handler
const awaitHandlerFactory = (middleware) => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next)
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = {
  getLikes: getLikes,
  countLikes: countLikes,
  upsertLike: upsertLike,
  getRelativeLikes: getRelativeLikes,
  deleteLikes: deleteLikes,
}


async function getLikes(stock, clientIp, addLike) {
    if(addLike==='true'){          
      console.log('addLike provided');
      await upsertLike(stock, clientIp, addLike);
      return countLikes(stock);
    } else {
      return countLikes(stock);
    };
};

function countLikes(stock) {
  stock = stock.toUpperCase();
  return Likes.countDocuments({stock: stock, isLiked: true});          
};

//addLike is included here to set it to false if this might be one day needed
async function upsertLike(stock,clientIp, addLike) {
  stock = stock.toUpperCase();  
  await Likes.findOne({stock: stock, ip: clientIp}, function (err, like) {
   
    if (err){console.log(err)  
    //No entry lets add like to db
    }else if (!like){      
      console.log('no entry for '+stock+' & '+clientIp);
      const newLike = new Likes({
        ip : clientIp,
        stock: stock,
        isLiked: addLike
      })
    
      const createdLike = newLike.save(function (err, newLike) {
        if (err) return console.error(err);
        console.log("created like entry"+newLike._id);                                 
        return newLike;
      });              
      return createdLike;             
    
    //entry existend but with isLiked = false
  
    } else if (!like.isLiked){
      console.log('updated isLiked for '+stock+' & '+clientIp);
      like.isLiked=update.isLiked;
      like.save();
      return like;
    
    //already liked it before
    } else {
      console.log(clientIp+' already liked '+stock);
      return like;
    }               
  });  
}

function getRelativeLikes(result) {
  let likesArray = [];
  for(var i=0; i<result.length; i++){                
  likesArray.push(result[i].likes)
  };
  let maxLikes = Math.max(...likesArray);
  let minLikes = Math.min(...likesArray);

  //this for creates relativ distance to maximum value, and for maximum to minimum challenge is not supporting more than two stocks
  for(var i=0; i<result.length; i++){
    if(result[i].likes==maxLikes){
      var delta = result[i].likes-minLikes;
    } else {
      var delta = result[i].likes-maxLikes;
    }
    result[i].rel_likes = delta;
    delete result[i].likes;
  };
  return result;
}

async function deleteLikes(req, res) {
  
  let result = await Likes.deleteMany({},
    function(err) {
      if (err) {
        console.log('could not delete all');
        return res.status(500).send({message: 'could not delete all'});              
      } else {
        console.log('complete delete successful')            
        return res.status(200).send({message: 'complete delete successful'});
      }
    }
  )          
  return result;                         
};
