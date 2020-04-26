/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';


//adding validator
const { check, validationResult } = require('express-validator');

const axios = require('axios');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){[
      //TODO validation matters
      ];
      var like = req.query.like;
      console.log(like);
      var stock = req.query.stock;

      // check if stock is single entry = string or an object
      if (typeof stock ==='string') {
        console.log('single stock entry');
        var stockData = await axios.get('https://repeated-alpaca.glitch.me/v1/stock/'+stock+'/quote')
        .then(function (response) {
          var output ={};
          output.stock = response.data.symbol;
          output.price = response.data.latestPrice;

          //TODO add helper function to check for IP and addition we must store this probably
          if(like){
            output.likes = 1;
          } else {
            output.likes = 0;
          }

          return output;            
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      } else {
        var stockData =[];
        for(var i=0; i<stock.length; i++){        
          await axios.get('https://repeated-alpaca.glitch.me/v1/stock/'+stock[i]+'/quote')
          .then(function (response) {
            var output ={};
            output.stock = response.data.symbol;
            output.price = response.data.latestPrice;
            console.log(output);
            stockData.push(output);


            //TODO add helper function to check for IP and addition we must store this probably
            if(like){
              output.likes = 1;
            } else {
              output.likes = 0;
            }

            return;            
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
        };
      }


      var result = stockData;


      //TODO add rel_likes to result
      
      return res.status(200).json({
          stockData: result});

      //{"stockData":{"stock":"GOOG","price":1279.31,"likes":1}}
      //{"stockData":[{"stock":"GOOG","price":1279.31}]}

      //{"stockData":[{"stock":"GOOG","price":1279.31,"rel_likes":0},{"stock":"MSFT","price":174.55,"rel_likes":0}]}
      //{"stockData":[{"stock":"GOOG","price":1279.31},{"stock":"MSFT","price":174.55}]}

      
    });
    
};
