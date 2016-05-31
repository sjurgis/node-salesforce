// Downloads specified ids in batches
// Dependency: FORCE CLI, csv-parse, csv-stringify node modules

var fs = require('fs');
var sys = require('sys')
var parse = require('../node_modules/csv-parse');
var stringify = require('../node_modules/csv-stringify');
var execSync = require('child_process').execSync;
var results = [];

var defaultQuery = "select id,name from account where ";
var query = defaultQuery
var fieldname = 'External_Id__c';

var batchSize = 400;
var numberOfBatches = 0;

var asyncNo = 4;

fs.readFile('sample.csv', 'utf8', function (err, file) {
  if (err) return console.log(err);
  //console.log(  Accounts );
  parse(file, {columns: true}, function(err, data) {
    if (err) return console.log(err);

    var nextBatch = batchSize;
    numberOfBatches = Math.ceil( data.length / batchSize );
    console.log( 'data.length ' + data.length  );
    console.log( 'numberOfBatches ' +numberOfBatches );

    var queries = [];
    for ( var i in data ){
      query += ( i == nextBatch-1 ||  i == data.length-1  ) 
       ? " id = '" + data[i][fieldname] + "' "  
       : " id = '" + data[i][fieldname] + "' or " ;
      
      if ( i == nextBatch-1 ){
        nextBatch += batchSize;
        queries.push( query );
        query = defaultQuery;
      }
      if ( i == data.length-1 )
        queries.push( query );
    }
    console.log('queries.length ' + queries.length)
        
    for ( var i in queries ){
      console.log('query no '+ i);
      execSync('./force query "' + queries[i] + '" --format:csv | tee ./tmpresults'+i+'.csv');      
    }
    parseNext( 0 );
    
  });
});

function parseNext( number ){  
  fs.readFile('tmpresults'+number+'.csv', 'utf8', function (err, tmpfile) {
    console.log('parsing ' + number );
    if (err) return console.log(err);

    parse(tmpfile, {columns: true}, function(err, res) {
      if (err) return console.log(err);
      
      for ( var i in res )
        if ( res[i]['Id'] )
          results.push( {Id : res[i]['Id'], Name : res[i]['Name']} ); // sfdc might return fields in random order so we need to parse the results  
      
        
      if ( number < numberOfBatches - 1  )
        parseNext ( number + 1 );
      else {
        console.log('results size ' + results.length );
        
        stringify( results, { header: true, quoted: true }, function (err, data){
          if (err) return console.log(err);

          fs.writeFile("results.csv", data, function(err) {
            if (err) return console.log(err);

            console.log("The file was saved!");
            execSync('rm tmpresults*.csv');      
          }); 
        });
      }
        
    });
  });
}
