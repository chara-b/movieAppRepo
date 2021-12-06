var all_genre_titles = ['Action', 'Adventure', 'Animation', 'Children\'s', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western']

/////////////////////////   DB is created based on many2many relationship ///////////////////////

// Configure MySQL connection ... db connection credentials ...
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});

//Establish MySQL connection

  connection.connect(function(err) {
    if (err) throw err
    console.log('Connected!')
});
// create db
  connection.query('CREATE DATABASE if not exists moviesdb', function (err, result) {
    if (err) throw err;
    if(result['affectedRows'] == 0){
        console.log('Ooops! Database already exists...')
    } else {
    console.log('Database created')
    }
  });

// create table ratings
// this syntax --> moviesdb.ratings says go and create table ratings inside moviesdb database
  var sql = 'CREATE TABLE if not exists moviesdb.ratings (row_id INT(10) UNSIGNED NOT NULL PRIMARY KEY, UserID INT(5) UNSIGNED NOT NULL, MovieID INT(5) UNSIGNED NOT NULL, Rating INT(5) NOT NULL)';
  connection.query(sql, function (err, result) {
    if (err) throw err;

    if(result['warningCount'] == 1){
        console.log('Ooops! ratings table already exists...')
    } else {
    console.log('Table ratings created');
    }
  });
// create clickedMovie table
var sql = 'CREATE TABLE if not exists moviesdb.clickedMovie (MovieID INT(10) UNSIGNED NOT NULL PRIMARY KEY, TimesClicked INT(5) NOT NULL, TimesSecondMethodClicked INT(5) NOT NULL, TimesThirdMethodClicked INT(5) NOT NULL)';
  connection.query(sql, function (err, result) {
    if (err) throw err;

    if(result['warningCount'] == 1){
        console.log('Ooops! clickedMovie table already exists...')
    } else {
    console.log('Table clickedMovie created');
    }
  });



// create movieclicked table
var sql = 'CREATE TABLE if not exists moviesdb.movieclicked (IncomingMovieID INT(10) UNSIGNED NOT NULL, SecondMethodClicked BOOLEAN NOT NULL, ThirdMethodClicked BOOLEAN NOT NULL, TimestampTemp TIMESTAMP NOT NULL, Timestamp TIMESTAMP NOT NULL)';
  connection.query(sql, function (err, result) {
    if (err) throw err;

    if(result['warningCount'] == 1){
        console.log('Ooops! movieclicked table already exists...')
    } else {
    console.log('Table movieclicked created');
    }
  });


 // drop a needless column from movieclicked table
 var sql = 'ALTER TABLE moviesdb.movieclicked DROP IF EXISTS TimestampTemp';
 connection.query(sql, function (err, result) {
   if (err) throw err;
 
   if(result['warningCount'] != 1){
       console.log('Ooops! movieclicked table does not exists...')
   } else {
   console.log('Column TimestampTemp of Table movieclicked has been dropped');
   }
 });



// create table movies
  var sql = 'CREATE TABLE if not exists moviesdb.movies (id_of_movie INT(5) UNSIGNED NOT NULL PRIMARY KEY, title VARCHAR(100) NOT NULL, year INT(5) NOT NULL)';
  connection.query(sql, function (err, result) {
    if (err) throw err;

    if(result['warningCount'] == 1){
        console.log('Ooops! movies table already exists...')
    } else {
    console.log('Table movies created');
    }
  });

// create table Genres
// the genres are defined as unique so if someone runs again this file 
// no change will occur in this table
// later when we insert into this table the word IGNORE ignores duplicate inserts
// in this table since its values are defined as unique here...
var sql = 'CREATE TABLE if not exists moviesdb.Genres (id_of_genre INT(5) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, genre VARCHAR(100) NOT NULL UNIQUE)';
connection.query(sql, function (err, result) {
  if (err) throw err;
  if(result['warningCount'] == 1){

      console.log('Ooops! Genres table already exists...')
  } else {
  console.log('Table Genres created');
  }
});

// create table lookupTable
var sql = 'CREATE TABLE if not exists moviesdb.lookupTable (MovieID INT(5) UNSIGNED NOT NULL, GenreID INT(5) UNSIGNED NOT NULL, row_id INT(5) UNSIGNED NOT NULL PRIMARY KEY, CONSTRAINT fk_for_movieID FOREIGN KEY movie_fk (MovieID) REFERENCES movies (id_of_movie) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT fk_for_genreID FOREIGN KEY genre_fk (GenreID) REFERENCES Genres (id_of_genre) ON DELETE CASCADE ON UPDATE CASCADE)';
connection.query(sql, function (err, result) {
  if (err) throw err;

  if(result['warningCount'] == 1){
      console.log('Ooops! lookupTable already exists...')
  } else {
  console.log('Table lookuptable created');
  }
});

// insert all existing genre types into resoective table ... there was a README file 
// where all genre types were stated... we'll create a reference to this table's values
// each time a movie falls under one or more existing genre types of this table...
// a lookuptable was created previously to store the relation between movies and genres
// and this will be the implementation of many2many relationship...
for(let i = 0; i < all_genre_titles.length; i++){
    
   connection.query('INSERT IGNORE INTO moviesdb.genres (genre) VALUES (?)', [all_genre_titles[i]] , function (err, result) {
        if (err) throw err;
        // result is an object with some values one them is called 
        // 'changedRows' if we console.log this object we'll see it
        // this means that no rows were affected so if no rows were affected 
        // print out a specific message... this happens when the user tries 
        // to run for a second time this file... this table's values are defined as unique
        // and the ignore word in the statement ignores any move of re-inserting into this 
        // tables and the result object brings 0 affected rows ... 
        if(result['affectedRows'] == 0){
            console.log('Ok, it looks like you tried to run this file again... Action is not permitted.')
 
        } else {
        console.log('Value Inserted...');
        }
      });
}


 const fs = require('fs')
 var readline = require('readline')
 var instream = fs.createReadStream('movies.dat')
 // create the object that will read from the stream using createInterface() function
 var rline = readline.createInterface(instream)
 

var id = []
var genre_extracted_as_array_of_strings = []
var counter = 0
var title
var year_extracted_as_number
var genre_extracted_as_array_of_strings_unified_array = []
var title_contents = []
// Here we're saying that whenever the line event occurs in 
// the stream it should call our function and pass it the content read from the stream.
// then we split the content so we separate the title the id and the year and the genre into
// different tables that we'll insert into db later...
rline.on('line', function(line){


  genre_extracted_as_array_of_strings.length = 0



    id = parseInt(line.split('::')[0].trim())

    var title_and_year_extracted = line.split('::')[1]
 
    // if this variable holds more than 2 items then this means that we have to deal with 
    // a record of this format 30::Shanghai Triad (Yao a yao yao dao waipo qiao) (1995)::Drama
    // instead of the typical one which is this one 30::Shanghai Triad (1995)::Drama
    // so we need to do extra splitting here in such case...
   title_contents = title_and_year_extracted.split('(')

   
   
   //if(title_contents.length = 2){
    // title.length = 0
     title = title_and_year_extracted.split('(')[0].trim()
   
    if(title_contents.length > 2){
    
     // temp_title = temp_title + '(' + title_and_year_extracted.split('(')[1]
      title.length = 0 // since title from first step will have this whole value in it 'Shanghai Triad (Yao a yao yao dao waipo qiao) (1995)'
      // we have to clean it first and then pass this trimmed value into it 'Shanghai Triad (Yao a yao yao dao waipo qiao)'
      // this last value is lying within temp_title variable ... 
      title = title_and_year_extracted.split('(')[0] + '(' + title_and_year_extracted.split('(')[1]
      //temp_title.length = 0
 
   }



  // if(title_contents.length = 2){

    var year_extracted_with_right_parenthesis = title_and_year_extracted.split('(')[1]
    var year_extracted = year_extracted_with_right_parenthesis.split(')')[0].trim()
    year_extracted_as_number = parseInt(year_extracted)
     if(title_contents.length > 2){// we need to do the same check here too as we did above!
  
    year_extracted_with_right_parenthesis = title_and_year_extracted.split('(')[2]
    year_extracted = year_extracted_with_right_parenthesis.split(')')[0].trim()
    year_extracted_as_number = parseInt(year_extracted)

  }

    var genre_as_extracted = line.split('::')[2].trim()
    genre_extracted_as_array_of_strings = genre_as_extracted.split('|')
    genre_extracted_as_array_of_strings_unified_array.push(genre_extracted_as_array_of_strings)
    //genre.push(genre_extracted_as_array_of_strings)

   
              

 })

 rline.on('line', function(line){
// after we've done the split it's time to query the db
    // the db has the many2many relationship scheme 
    // we have created the scheme with the create table and foreign key and 
    // all techniques needed stuff and now here we first insert into 
    // our movies table the columns for title and year as usual
    

    connection.query('INSERT INTO moviesdb.movies (id_of_movie, title, year) VALUES (?, ?, ?)', [id, title, year_extracted_as_number], function(err, result) {
       
      if(err) {
          console.log('Error no movie inserted...')
     
      }
      else {
          console.log('MOVIE Successfully inserted into DataBase')
      }
      })


      // after a line is inserted we store its id into the variable below
      connection.query('SET @id_of_movie = ?', [id])
    // and for the above last id we iterate all genres
            // in the array of arrays that we store them after splitting
            // so we add reference for the last id inserted to all genres 
            // that it corresponds from the genres table in db
            for(let i = 0; i < genre_extracted_as_array_of_strings_unified_array.length; i++){
            for(let y = 0; y  < genre_extracted_as_array_of_strings_unified_array[i].length; y++){
             
              // in order to do that we store into a variable as shown in the query below
              // the id of the genre in genres table where the name of the genre is equal to 
              // the respective name of each genre that corresponds to the last inserted title
              // from the genres array that we filled after splitting...
              // for example 'toy story movie' is of genre 'animation, children's, comedy'
              // so what this last for loop says is actually that for this i title of movie
              // iterate the ith element of the genres array (which is the genres that the i movie belongs to)
              // and commit the query below so many times for all genres of that movie...
              // the [genre[i][y]] holds each time the next genre of the movie ... for instance
              // the first time it holds the value 'animation' the 2nd time the value 'children's' and
              // the 3rd time the value 'comedy' and it does so for all movies...
                  counter++
                      connection.query('SET @id_of_genre := (SELECT id_of_genre FROM moviesdb.genres WHERE genre = ?)', [genre_extracted_as_array_of_strings[y]])		
           
                      connection.query('INSERT INTO moviesdb.lookuptable  (MovieID, GenreID, row_id) VALUES (@id_of_movie, @id_of_genre, ?)', counter, function(err, result) {
             
                        if(err) {
                            console.log('Error no record inserted into lookuptable')
                      
                        }
                        else {
                            console.log('ANOTHER RECORD Successfully inserted into LOOKUPTABLE in DataBase')
                        }
                      })
                 }
                }
                connection.query('INSERT INTO moviesdb.clickedMovie (MovieID) VALUES (?)', [id], function(err, result) {
       
                  if(err) {
                      console.log('Error no movieId inserted into clickedMovie table...')
                 
                  }
                  else {
                      console.log('MOVIE ID Successfully inserted into clickedMovie table in DataBase')
                  }
                  }) 

 })



rline.on('close', function(line){
  
  connection.end(function(err) {
    if (err) {
      return console.log('error:' + err.message);
    }
    console.log('Closing the database connection...');
  });
})



