/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
//adding my model
const Likes = require('../models/likes');

//adding controller
const StockHandler = require('../controllers/stockHandler.js');
const LikesHandler = require('../controllers/likesHandler.js');

//adding validator
const { check, validationResult } = require('express-validator');

//helper to have simple requestor
const axios = require('axios');

//helper for identifing IP address
const requestIp = require('request-ip');


module.exports = function (app) {

  app.route('/api/stock-prices')
    .get([
      check('stock').notEmpty().isLength({max: 4}).withMessage('You have to provide a stock with less than 5 chars'), //bad way to handle multiple stock does not allow escaping
      check('like').optional().isBoolean().withMessage('If you provide like it must be a boolean value')
      ],
      function (req, res){

        // validation error handling
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send({ message: 'validation error', errors: errors.array()});
        };     
        
        // get some variables defined
        const addLike = req.query.like || false;
        //console.log('add like: '+addLike);
        const stock = req.query.stock;
        //console.log('stock: '+req.query.stock);      
        const clientIp = requestIp.getClientIp(req);          

        // if we have only one stock than else separated functions for treating multiple stocks
        if (typeof stock ==='string'){
          stockResult(stock,clientIp,addLike).
          then(result => {
            return  res.status(200).json({
              stockData: result});  
          }).catch(err => console.error(err));
        } else {
          stockResults(stock,clientIp,addLike).
          then(result => {
            return  res.status(200).json({
              stockData: result});  
          }).catch(err => console.error(err));
        }

        // For multiple stock values we need to use map (! This works with more than two like sample solution)
        async function stockResults(stock,clientIp,addLike) { 
          const requests = await stock.map((stock) => {
            var response = stockResult(stock,clientIp,addLike);   
            return response;   
          });
          //now we have to create relative likes by getting max and min values and use maximum distance 
          var modifiedResponse = Promise.all(requests)
          .then(result => {
            return LikesHandler.getRelativeLikes(result);                        
          });
          
          return modifiedResponse;
        }        

        // return stock results in sequence instead parallel
        async function stockResult(stock,clientIp,addLike) { 
          const [likes, price] = await Promise.all([LikesHandler.getLikes(stock, clientIp, addLike), StockHandler.getPrice(stock)]);
          return {
            stock: stock,
            likes: likes,
            price: price
          };   
        }      
      }
    )

    //extra method to wipe testDB for doing tests clearly you would never do something like that in real app
    .delete(
      async function (req, res){
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
      }
    ); 

};
