//helper to have simple requestor
const axios = require('axios');

module.exports = {
  getPrice : getPrice
}

        
function getPrice(stock) {
  stock = stock.toUpperCase();
  console.log(stock);
  return axios.get('https://repeated-alpaca.glitch.me/v1/stock/'+stock+'/quote')
  .then(function (res) {
    if (res=='"Invalid symbol"'){
      console.log("Invalid symbol");
      throw err;
    }
    //console.log('latest price of stock is '+res.data.latestPrice); 
    return res.data.latestPrice;
  })
  .catch(err => console.log(`Error in getPrice ${error}`));       
};
