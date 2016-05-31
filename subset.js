var fs = require('fs');

var parse = require('../../node_modules/csv-parse');
var stringify = require('../../node_modules/csv-stringify');

var selection = [];
fs.readFile('all.csv', 'utf8', function (err, alldata) {
  if (err) return console.log(err);
  parse(alldata, {columns: true, 'objname': "ID"}, function(err, all) {
    console.log('all length: ' + Object.keys(all).length)
    
    if (err) return console.log(err);
    fs.readFile('sample.csv', 'utf8', function (err, subdata) {
      if (err) return console.log(err);
      
      parse(subdata, {columns: true}, function(err, sub) {
        console.log('sub length: ' + sub.length)
        if (err) return console.log(err);
        
        for (var i in sub)
          if ( all[ sub[i].External_Id__c ] ) // this is a good place to put your data transformations
            selection.push( all[ sub[i].External_Id__c ] )
            
        stringify( selection, { header: true, quoted: true}, function (err, data){
          if (err) return console.log(err);
          
          fs.writeFile("selectionFromAll.csv", data, function(err) {
            if (err) return console.log(err);

          console.log("The file was saved!");
          }); 
        });
      });
    });
  });
});
