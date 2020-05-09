/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var should = chai.should();
var server = require('../server');
chai.use(chaiHttp);



suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: 'goog'})
         .end(function(err, res){
           console.log(err);          
           res.should.have.status(200);
           res.should.be.json;                   
           res.body.should.be.a('object');  
           res.body.should.have.property('stockData');
           res.body.stockData.should.have.property('stock').eql('goog');
           res.body.stockData.should.have.property('price');
           res.body.stockData.should.have.property('likes');
 
           //security header validation because no separate test available         
           res.should.have.header('content-security-policy', 'default-src \'self\'; style-src \'self\'; script-src \'self\' code.jquery.com');            
           done();
         });        
      });    
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
                 
          res.should.have.status(200);
          res.should.be.json;                   
          res.body.should.be.a('object');  
          res.body.should.have.property('stockData');
          res.body.stockData.should.have.property('stock').eql('goog');
          res.body.stockData.should.have.property('price');
          res.body.stockData.should.have.property('likes').eql(1);
        done();
        });
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){          
          res.should.have.status(200);
          res.should.be.json;                   
          res.body.should.be.a('object');  
          res.body.should.have.property('stockData');
          res.body.stockData.should.have.property('stock').eql('goog');
          res.body.stockData.should.have.property('price');
          res.body.stockData.should.have.property('likes').eql(1);
        done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices?stock=goog&stock=msft')        
        .end(function(err, res){
          console.error(err);
          res.should.have.status(200);
          res.should.be.json;                   
          res.body.should.be.a('object');  
          res.body.should.have.property('stockData');
          res.body.stockData[0].should.have.property('stock').eql('goog');
          res.body.stockData[0].should.have.property('price');
          res.body.stockData[0].should.have.property('rel_likes').eql(1);
          res.body.stockData[1].should.have.property('stock').eql('msft');
          res.body.stockData[1].should.have.property('price');
          res.body.stockData[1].should.have.property('rel_likes').eql(-1);
        done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices?stock=goog&stock=msft')
        .query({like: true})       
        .end(function(err, res){    
          res.should.have.status(200);
          res.should.be.json;                   
          res.body.should.be.a('object');  
          res.body.should.have.property('stockData');
          res.body.stockData[0].should.have.property('stock').eql('goog');
          res.body.stockData[0].should.have.property('price');
          res.body.stockData[0].should.have.property('rel_likes').eql(0);
          res.body.stockData[1].should.have.property('stock').eql('msft');
          res.body.stockData[1].should.have.property('price');
          res.body.stockData[1].should.have.property('rel_likes').eql(0);

          //Now lets wipe Db
          chai.request(server)
          .delete('/api/stock-prices/')
          .send({})
          .end(function(err, res){
            res.should.have.status(200);
            console.log(err);
            done();
          });
        });
      });
      
    });

});
