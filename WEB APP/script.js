function search() {

    var xhttp
    var movie_keyword = {
        movie_keyword: document.getElementById('input-field').value
      }
    var id = parseInt(document.getElementById('input-id-field').value) // the value of the id field in html

// if user hasn't entered a title do not let the rest steps of calling the backend proceed...
if(movie_keyword['movie_keyword'] == "" && isNaN(id)){
  alert('You must enter a title keyword or at least a movie id to proceed !')
}


    // if this if is valid then the user entered a keyword and not an id...
    if( movie_keyword['movie_keyword'] != "" && isNaN(id)){


// if user entered a number inside the input keyword alert him not to do that
      if(/\d/.test( movie_keyword['movie_keyword'])){
        alert('Number found in the input !!! Input here must not contain numbers only keywords! If you want to make a search according to a specific id please fill the id field')
      // else if everything is ok and the user has entered a valid string keyword proceed the steps
      } else {


// first erase all contents that the table might have so the new results of the new searching 
// keyword won't be printed underneath the ones of the previous search inside the table
// and then proceed to requesting the results
var new_tbody = document.createElement('tbody')
var tbody = document.getElementsByTagName('tbody')[0]
tbody.parentNode.replaceChild(new_tbody, tbody)

    xhttp = new XMLHttpRequest();
     

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
         // the response is of type json since we need to parse we parse it below and we save it 
         // as an array in parsed_response variable ... then for each movie return (each movie is 
         // each row of this array) we create a new row in html table to display the movie in the frontend
         // this way we managed to generate an html table according to how many movies returned each time
         // so we can decide how many rows we need each time dynamically...
      
        parsed_response = JSON.parse(xhttp.response);
if(parsed_response.length != 0){ // if the response from server is of no length then 
  // that means that the server couldn't find any movie so in this case the code goes to the 'else'
  // statement of this if and prints out a respective message otherwise if we've got a response the code 
  // goes into this if statement here and prints out the response...
  // no response occurs when the user entered a keyword that has no similar pattern with a movie
  // title in the dataset... for example if the user enters troy instead of toy as a keyword then
  // the code prints out the else statement of this if otherwise it runs this if block
        // getElementsByTagName returns a NodeList...
        // we have to access individual items with an index so we can later use the appendChild function
        // otherwise it'll throw an error... since appendChild is not of type NodeList...
        var tbody = document.getElementsByTagName('tbody')[0]

        for (let i = 0; i < parsed_response.length; i++) {
          var tr = document.createElement('tr');
          // we set here these attributes just like we would do in html respective elements 
          // in order to toggle the modal to open when the user clicks upon one row of the table
          // to select a movie to see its details inside the pop up modal...
          tr.setAttribute("data-toggle", "modal");
          tr.setAttribute("data-target","#myModal")
          tr.setAttribute("data-backdrop","static")

// so number of row = number of item in the response json array
// since this is the order we filled the table it's the same order as the json array gave us its items...
// inside the modal now we have the details of the movie that it needs to display
// so i added an onclick event inside the loop and i got each time the id of the row clicked
// and compared it with the json array response we got earlier from the server so i can retrieve now
// all details based on the id of the movie corresponding to the row clicked...          
          
// pass the details of the movie selected by clicking upon a row into the modal
// to be displayed to the user...
      tr.onclick = function(){



        var id_span = document.getElementById('id-span')
        id_span.innerHTML="";
        id_span.appendChild(document.createTextNode(parsed_response[i]['id']))
 // we'll now do the same thing for all the rest properties of the json response so we fill
      // all details' of the movie fields inside the modal...
          //----------------------------------------------------------------------//
      var title_span = document.getElementById('title-span')
      // this is a simple way to clean this element from its previous content and then pass 
      // into it the new content of the new row clicked
      title_span.innerHTML="";
// now that we have span element cleaned we append into it 
      title_span.appendChild(document.createTextNode(parsed_response[i]['title']))
//-----------------------------------------------------------------------------------------//
        var year_span = document.getElementById('year-span')
        year_span.innerHTML="";
        year_span.appendChild(document.createTextNode(parsed_response[i]['year']))
        //-------------------------------------------------------------------------------//
        var genre_span = document.getElementById('genre-span')
        genre_span.innerHTML="";
        genre_span.appendChild(document.createTextNode(parsed_response[i]['genre']))
               
     
// on a tr click update the db that this row's movie id is clicked... this is done with the first
// 3 lines below...
xhttp.open("GET", "http://127.0.0.1:3000/movieclicked/"+parsed_response[i]['id'], true)
//xhttp.setRequestHeader('Content-Type', 'application/json')
xhttp.send(parsed_response[i]['id']);
      
          
        
      
      }
     
            var td = document.createElement('td')
            td.appendChild(document.createTextNode(parsed_response[i]['title']))
            
            tr.appendChild(td)

          tbody.appendChild(tr)
        }

        document.getElementById("myForm").reset();

        
        }
        ////// end of if statement to check if the length of the response array is != 0 ...
      // if it is not equal to 0 this means that movies were found according to user's keyword so the
      // code proceeds otherwise tells the user that the app couldn't find any movie with that keyword
      // in the db...
      else{
        alert('No movie found with keyword:   ' + movie_keyword['movie_keyword'])
      }
      }
     
 }
      
    // true value means that we want an asynchronous call
    xhttp.open("POST", "http://127.0.0.1:3000/movie", true)
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(JSON.stringify(movie_keyword));
    
    }
  } else if(movie_keyword['movie_keyword'] == "" && !isNaN(id)){
    // if this if is valid then the user entered an id and not a keyword...
    // it is the same code as above the only difference id that here we change the open() method
    // of the xhttp object since we send an id to the respective endpoint...
if(id > 0 && id <= 3952){
  // refresh the body of the table each time to display only the new movies of the latest search...
    var new_tbody = document.createElement('tbody')
    var tbody = document.getElementsByTagName('tbody')[0]
    tbody.parentNode.replaceChild(new_tbody, tbody)
    
        xhttp = new XMLHttpRequest();
         
    
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
    
    parsed_response = JSON.parse(xhttp.response);
    if(parsed_response.length != 0){
    
    var tbody = document.getElementsByTagName('tbody')[0]
    
            for (let i = 0; i < parsed_response.length; i++) {
              var tr = document.createElement('tr');
    
    tr.setAttribute("data-toggle", "modal");
              tr.setAttribute("data-target","#myModal")
              tr.setAttribute("data-backdrop","static")
    tr.onclick = function(){
    
            var id_span = document.getElementById('id-span')
            id_span.innerHTML="";
            id_span.appendChild(document.createTextNode(parsed_response[i]['id']))
    
    var title_span = document.getElementById('title-span')
     title_span.innerHTML="";
    title_span.appendChild(document.createTextNode(parsed_response[i]['title']))
    
    var year_span = document.getElementById('year-span')
            year_span.innerHTML="";
            year_span.appendChild(document.createTextNode(parsed_response[i]['year']))
    
    var genre_span = document.getElementById('genre-span')
            genre_span.innerHTML="";
            genre_span.appendChild(document.createTextNode(parsed_response[i]['genre']))
                      
          }
         
                var td = document.createElement('td')
                td.appendChild(document.createTextNode(parsed_response[i]['title']))
                
                tr.appendChild(td)
    
              tbody.appendChild(tr)
            }
    
            document.getElementById("myForm").reset();
    
     } else {
       alert('Ooops... although the id you entered is between the desirable range of (0-3952] this specific id does not exist in our database... We are so sorry for the inconvenience... We will make it up to you next time you search for a movie, we will sure be able to find your next search!!!')
     }
    
    
          }
         
     }
          
    
     xhttp.open("GET", "http://127.0.0.1:3000/movie/"+id, true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send(id);
        
    
  }
 else {
  alert('You entered a negative id or 0 or greater than 3952... you must enter a positive id > 0 and less than 3952')
 }
}
  else if(movie_keyword['movie_keyword'] != "" && !isNaN(id)) {
    alert('You must enter one value at a time... Enter an id OR a keyword not both!')
  }
   
    }








    function SearchAVGRating() {

      var xhttp

      var id_ = parseInt(document.getElementById('input-id-field').value) // the value of the id field in html
      
      if(id_ > 0 && id_ <= 3952){
       
      xhttp = new XMLHttpRequest();
           
      
          xhttp.onreadystatechange = function() {
           
              if (this.readyState == 4 && this.status == 200) {      
                parsed_response2 = JSON.parse(xhttp.response);
                if(parsed_response2['serversais'] == 'nothing found'){
                  alert('Ooops... although the id you entered is between the desirable range of (0-3952] this specific id does not exist in our database... We are so sorry for the inconvenience... We will make it up to you next time you search for a movie`s rating!!!')
                }
                
                  // parsed_response2 is the rating's response json object
                  if(!isNaN(id_) && parsed_response2['serversais'] != 'nothing found'){
                   // data-toggle="modal", data-target="#myRatingsModal", data-backdrop="static"
                 

                    alert('Movie of ID = '+parsed_response2['MovieID']+ ' is of an average rating of '+parsed_response2['avg_rating']+ ' stars!')
                    
                   
               
               }  
               document.getElementById("myForm").reset();
               
          }
         
      }
      
        // true value means that we want an asynchronous call
        xhttp.open("GET", "http://127.0.0.1:3000/ratings/"+id_, true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        
    }
    else if (id_ <= 0 || id_ > 3952) {

      alert('You entered a negative id or 0 or greater than 3952... you must enter a positive id > 0 and less than 3952 ! Negative IDs, equal to 0 or greater than 3952 will be discarded')
      
      
      }
        if(isNaN(id_)){
          alert('Enter an ID first...')
        }// else if(id_ <= 0){
         // alert('You must enter a positive ID... Negative IDs or equal to 0 will be discarded')
       // }
         else {
        xhttp.send(id_);
        }

      
    }
    