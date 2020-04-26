**FreeCodeCamp**- Information Security and Quality Assurance
------

Project Stock Price Checker

1) SET NODE_ENV to `test` without quotes and set DB to your mongo connection string
2) Complete the project in `routes/api.js` or by creating a handler/controller
3) You will add any security features to `server.js`
4) You will create all of the functional tests in `tests/2_functional-tests.js`


User Stories
Set the content security policies to only allow loading of scripts and css from your server. //DONE
I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object stockData. //TODO
In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int). //TODO
I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted. //TODO
If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display rel_likes(the difference between the likes on both) on both. //TODO
A good way to receive current prices is through our stock price proxy (replacing 'GOOG' with your stock symbol): https://repeated-alpaca.glitch.me/v1/stock/GOOG/quote //TODO
All 5 functional tests are complete and passing. //TODO

