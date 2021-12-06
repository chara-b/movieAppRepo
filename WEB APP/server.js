const express = require('express');
const app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
   

app.use(express.json()); // χάρης αυτό μπορούμε άνετα να κάνουμε parse το εισερχόμενο json με
// τον εξής τρόπο req.body.ΤοΌνομαΤηςΜεταβλητήΤηςΟποίαςΘέλουμεΤηνΤιμή και όλο αυτό να το αποθηκεύσουμε
// σε μια καινούρια μεταβλητή έτσι var Myvar = req.body.whatever;


// Configure MySQL connection ... db connection credentials ...
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'moviesdb'
});

//Establish MySQL connection
connection.connect(function(err) {
    if (err) 
       throw err
    else {
        console.log('Connected to MySQL');
        // Start the app when connection is ready
        app.listen(3000);
        console.log('Server is listening on port 3000');
  }
 });

 
// get the ratings for a specific movie and then calculate the average of all its ratings as the final
// response ...

app.get('/ratings/:id', (req, res) => {
    var ratings_for_the_specific_movie = []
    var avg_rating
    connection.query('SELECT COUNT(Rating) AS count, SUM(Rating) AS sum FROM ratings WHERE MovieID = ?', [req.params.id] ,(err, count, sum) => {
        if(err) {
            res.send({serversais: 'Error... could not get data...'});
         } else {

          //  for (let i = 0; i < rows.length; i++) {
           //     ratings_for_the_specific_movie[i] = rows[i]['Rating']
            //}
            // calculates the sum
            //sum = ratings_for_the_specific_movie.reduce((a, b) => a + b)
            // computes the average of all ratings
            //var avg_rating_temp = sum/rows.length
            if(count[0]['count']>0){ // count is coming from the db query and it must not be 0 because we can not divide by that...
            var avg_rating_temp = count[0]['sum']/count[0]['count']
            var avg_rating_temp_rounded_string = avg_rating_temp.toFixed(1)
            avg_rating = Number(avg_rating_temp_rounded_string)
           // console.log({"avg_rating" : avg_rating})
            
            res.send({"MovieID" : req.params.id, "avg_rating" : avg_rating});    
            }else  {
                res.send({"serversais": "nothing found"});
            }
         }
        
    })
    connection.query('UPDATE moviesdb.clickedmovie SET TimesClicked = TimesClicked + 1 WHERE MovieID = ?', [req.params.id])
    connection.query('UPDATE moviesdb.clickedmovie SET TimesThirdMethodClicked = TimesThirdMethodClicked + 1 WHERE MovieID = ?', [req.params.id])
    connection.query('INSERT INTO moviesdb.movieclicked (IncomingMovieID, SecondMethodClicked, ThirdMethodClicked, Timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', [req.params.id, false, true])  
        
});





// get a specific movie's details according to a specific id ...

app.get('/movie/:id', (req, res) => {

    var data = []
    var genres = '::'
    var genres_splitted = []

    connection.query('SELECT genre, MovieID FROM genres JOIN lookuptable ON genres.id_of_genre = lookuptable.GenreID WHERE lookuptable.MovieID = ?', [req.params.id], (err, rows) => {
        if(err) {
            res.send({serversais: 'Error... could not get data...'});
         }
         else {
            connection.query('SELECT * FROM movies WHERE id_of_movie = ?', [req.params.id], (err, rows1) => {
                if(err) {
                    res.send({serversais: 'Error... could not get data...'});
                 }
                else {            
        
                    for(let i = 0; i < rows1.length; i++){
                                        
                         for(let y = 0; y < rows.length; y++){
                             if ( rows1[i]['id_of_movie'] == rows[y]['MovieID']){
                      
                                
                               genres = genres + rows[y]['genre'] + ' '
                              
                                                       
                            }
                          
                         }
                         genres = genres + '::'
                     }
                     genres_splitted = genres.split('::')
     
                     for(let i = 0; i < rows1.length; i++){
                        // if ( rows1[i]['id_of_movie'] == rows[y]['MovieID']){
                         data[i] = {'id' : rows1[i]['id_of_movie'], 'title' : rows1[i]['title'], 'year' : rows1[i]['year'], 'genre' : genres_splitted[i + 1]}
                        // }
                     }
     
                     res.send(data)
                 }
                });



         }
    
   
})
connection.query('UPDATE moviesdb.clickedmovie SET TimesClicked = TimesClicked + 1 WHERE MovieID = ?', [req.params.id])
connection.query('UPDATE moviesdb.clickedmovie SET TimesSecondMethodClicked = TimesSecondMethodClicked + 1 WHERE MovieID = ?', [req.params.id])
connection.query('INSERT INTO moviesdb.movieclicked (IncomingMovieID, SecondMethodClicked, ThirdMethodClicked, Timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', [req.params.id, true, false])  
                
})
    

    
    




// post method used as a get method...
// returns all movies found as a json array according to a title keyword...

app.post('/movie', function(req, res) {
var data = []
var genres = '::'
var genres_splitted = []

// json parsing ...
    var movie_keyword = req.body.movie_keyword; // the incoming json's key's value... 
    // body of req has a json of this form --> {'movie_keyword': 'toy'}... 
    // and here we say 'take the value of key 'movie_keyword' that lies inside 
    //the body of the request as a whole json object and save it inside a variable'

    // first we need to query the db to give us the genres of that movie we requested since we have store
    // them in an other table in order to implement the many2many relationship
    // mysql wildcards are used in order to find the movie no matter how the user entered
    // the title... pattern wildcards are used in combination with LIKE operator...
    // WHERE MovieTitle LIKE '%toy%' Finds any values that have "toy" in any position of the movie's title !
    // when we have more than one value retrieved from the db according to keyword that the user
    // entered the last select subquery brings back more than one ids of movies selected so we have a range of retrieved values
    // which means that we need the 'in' operator to specify that after the where statement... so we say where movie id of lookuptable is in the range of movie id of movies table where the title follows the pattern that the user specified...
connection.query('SELECT genre, MovieID FROM genres JOIN lookuptable ON genres.id_of_genre = lookuptable.GenreID WHERE lookuptable.MovieID in (SELECT id_of_movie FROM movies WHERE title LIKE ?)', '%' + [movie_keyword] + '%', (err, rows) => {
       
          if(err) {
              res.send({serversais: 'Error... could not get data...'});
           }
           else {
            //next we'll query the db one more time to give us all the rest info for that movie
          //this info lies inside the main table 
          // we placed this next query inside the callback of the first one...

          connection.query('SELECT * FROM movies WHERE title LIKE ?', '%' + [movie_keyword] + '%', (err, rows1) => {
            if(err) {
                res.send({serversais: 'Error... could not get data...'});
             }
            else {        
                // ok since the query returns and array of json objects each one carrying
                // one genre type and the other query returns a separate array of json objects
                // carrying all the rest movies' details we need to combine in a way 
                // these two different arrays of json objects into as many as the movies are
                // and each one will have all genres in one place...
                // so we want to end up in a form like below
                // [
                //  {
                //      "id":"1",
                //      "title":"toy story",
                //      "year":"1995",
                //--> -->      "genre":"Animation, Comedy" <-- <--
                //  }
                //  {
                //      "id":"3",
                //      "title":"toy story 2",
                //      "year":"1997",
                //-->-->      "genre":"Animation, Comedy, Children's" <-- <--
                //  }
                //  ]
                // ...instead of the original results of the query that they look something like this 
                // scheme below ... and this json response below happens because the scheme of the db is 
                // made so, by using a look up table so to interprete the many2many relationship
                // [
                //    [
                //      {"genre": "Animation"}
                //      {"genre": "Comedy"}
                //      {"genre": "Animation"}
                //      {"genre": "Comedy"}
                //      {"genre": "Children's"}
                //    ]  
                //    [
                //      {
                //          "id":"1",
                //          "title":"toy story",
                //          "year":"1995"
                //      }
                //       {
                //          "id":"3",
                //          "title":"toy story 2",
                //          "year":"1997"
                //       }
                //  ]
                //
                // ]
                // to fix all this, the code that follows converts the results into a better json format
                // that we want !
          
   
                for(let i = 0; i < rows1.length; i++){
                   //genres.length = 0
                   
                    for(let y = 0; y < rows.length; y++){
                        if ( rows1[i]['id_of_movie'] == rows[y]['MovieID']){
                 
                           
                          genres = genres + rows[y]['genre'] + ' '
                         
                                                  
                       }
                     
                    }
                    genres = genres + '::'
                }
                genres_splitted = genres.split('::')

                for(let i = 0; i < rows1.length; i++){
                   // if ( rows1[i]['id_of_movie'] == rows[y]['MovieID']){
                    data[i] = {'id' : rows1[i]['id_of_movie'], 'title' : rows1[i]['title'], 'year' : rows1[i]['year'], 'genre' : genres_splitted[i + 1]}
                   // }
                }

                res.send(data)
            }
           });





     
            }

          });

          
        })



        app.get('/movieclicked/:id', (req, res) => {

            connection.query('UPDATE moviesdb.clickedmovie SET TimesClicked = TimesClicked + 1 WHERE MovieID = ?', [req.params.id])
         
        })