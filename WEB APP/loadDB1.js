/////// now let's do kind of the same thing for the ratings.dat file

const fs = require('fs')
var readline = require('readline')
var instream = fs.createReadStream('ratings.dat')
var rline = readline.createInterface(instream)


//const LineByLineReader = require('line-by-line');
//rline = new LineByLineReader('ratings.dat');



var userID 
var movieID 
var ratings
var counter2 = 0
var records = []

console.log('Wait while we are reading the ratings.dat file...')

rline.on('line', function(line){

  counter2++
   // trim method erases the gaps/white spaces so i used it just in case split doesn't do an 
   // excellent job...
   userID = line.split('::')[0]

 
// since split extracts array of strings it was needed to convert the result back to an integer
// so we can later insert it into db...
  movieID = line.split('::')[1]

  ratings = line.split('::')[2]

  records.push([counter2, parseInt(userID), parseInt(movieID), parseInt(ratings)])

  
})
rline.on('close', function(line){
console.log('We have read ' + records.length + ' lines!')

});


//rline.on('close', function(line){

/////////////////////////   DB is created based on many2many relationship ///////////////////////
// Configure MySQL connection ... db connection credentials ...
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});

rline.on('close', function(line){

  connection.end(function(err) {
    if (err) {
      return console.log('error:' + err.message);
    }
    console.log('Closing the database connection...');
  });
  
  })



//Establish MySQL connection

  connection.connect(function(err) {
    if (err){ throw err} else {
    console.log('Connected!')


    for (let i = 0; i < records.length; i++) {  
      connection.query('INSERT INTO moviesdb.ratings (row_id, UserID, MovieID, Rating) VALUES (?)', [records[i]], function(err, result) {
           
        if(err) {
            console.log('Error no rating inserted...')   
        }
        else {
            console.log('Rating Successfully inserted into DataBase')
        }
        }) 
     }




  }

});






//})

