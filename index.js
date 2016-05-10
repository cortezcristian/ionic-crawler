var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false })
var cheerio = require('cheerio');
var async = require('async');
var base = 'http://localhost:8100/';
var links = [];

nightmare
  .goto('http://localhost:8100/#/')
  //.screenshot('./lala.png')
  .evaluate(function () {
    //links = document.querySelectorAll('a');
    //console.log(">>>", document)
    return document.documentElement.innerHTML;
  })
  .end()
  .then(function (doc) {
    $ = cheerio.load(doc);
    //console.log("->", doc, $('body').html());
    $('a,ion-tab').each(function(v){
      var link_attr = $(this).attr('href');
      if(typeof link_attr !== 'undefined'){
        links.push($(this).attr('href'));
      }
    })
    screenCapture();
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });

var screenCapture = function() {
  console.log(links);
  var a = 0;
  async.mapSeries(links, function(lnk, cb){
    console.log("link: ", lnk);
    a++;
    nightmare = new Nightmare();
    nightmare
      .viewport(375, 667)
      .goto(base+lnk)
      //.screenshot('capture-'+lnk+'.png')
      .screenshot('capture-'+a+'.png')
      .end()
      .then( function(){
        console.log("reaches then...");
        cb();
      })
      .catch(function (error) {
        console.error('Search failed:', error);
      });

    }, function(err){
    console.log("Done....", err);
  })

}
