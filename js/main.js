/*
Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
Titolo
Titolo Originale
Lingua
Voto
*/

$(document).ready(function () {

   //imposto una variabile per iltasto cerca
   var search = $(".search");

   //quando clicco sul cerca parte le funzione esterna
   search.on("click",function(){
      $(".zona-film").html("")
      callAjax();
   });

   $(".input").keyup(function(k){
      console.log(k.keycode)
      if (k.keyCode == "13"){

         $(".zona-film").html("")
         callAjax();
      }
   });

});



function callAjax(){
   //salvo una variabile dove è segnato cosa scrive l'utente
      var userInput = $(".input").val();
      console.log(" cerchi " + userInput)

      $.ajax({
         url: "https://api.themoviedb.org/3/search/movie?api_key=86ad7638c6e9361746024a7df74fcc2a&query=" + userInput,
         method: "GET",
         success: function (data) {
           console.log(data.results)
           for (var i=0; i<data.results.length;i++){

              var elementi = data.results[i]

              var source = $(".global-film").text();

              var template = Handlebars.compile(source);

              var globalFilm  = {
                 titolo: elementi.title,
                 imglink: createPoster(elem.poster_path),
                 titoloOriginale: elementi.original_title,
                 lingua: elementi.original_language,
                 voto: Math.ceil(elementi.vote_average),
                 flag: creazioneBandiera(elementi.original_language),
                 stella: creazioneStelle(Math.ceil(elementi.vote_average))
              };
              //Creounavar per l'html dove appariranno i film
              var html = template(globalFilm);
              console.log(html);

              //stampo in pagina
              $(".zona-film").append(html);
           }

            $(".input").val("")
         },
         error: function (richiesta, stato, errori) {
            alert("C'è stato un errore " + " " + richiesta + " " + stato + " " + errori);
        }
      })
}

/*
Trasformiamo il numero da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
Qui un esempio di chiamata per le serie tv:
https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs
 */

//Creo funzioni per sostituire stelle e bandiere

 function creazioneStelle(voto){

   var voto = voto/2;

   var stella = "";

   for(var i=1; i<=5;i++){
      if(i<=voto){
         stella += '<i class="fas fa-star"></i>';

      } else{
         stella += '<i class="far fa-star"></i>';
      }
   }
   return stella;
};


function creazioneBandiera(flag){
   var bandieraimg;

   switch (flag) {

      case "it":
            bandieraimg = "<img src='img/eu.jpg' width='30px'>";
         break;
      case "usa":
            bandieraimg = "<img src='img/usa.png' width='30px'>";
         break;
      default:
         bandieraimg = "<img src='img/terra.jpg' width='30px'>";
   }
   return bandieraimg;
};

//genero i poster
function createPoster(posterPath){
   var poster = 'https://image.tmdb.org/t/p/w500';

   if (posterPath == null){
      poster = "https://fontmeme.com/permalink/191126/4afe42c72da796daf5f2206c7126a97a.png"
   }else{
      poster += posterPath
   }

   return poster;
}

//funzione  per la chiamate delle serie tv
function callAjaxSeries() {

   var userInput = $("#my_input").val();
   console.log("stai cercando " + userInput)

   $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method: "GET",
      data: {
         api_key: "86ad7638c6e9361746024a7df74fcc2a",
         query: userInput,
         language: "it-IT"

      },
      success: function (data) {
         console.log(data.results)
         var series = data.results;
         var target = $(".blocco-serie");
         printFilmSeries(series,target,false)
         //ripulisco l'input inserito dall'user
         $("#my_input").val("")
      },
      error: function (richiesta, stato, errori) {
         alert("E' avvenuto un errore. " + " " + richiesta + " " + stato + " " + errori);
      }
   })
}

//funzione per serie tv e film
function printFilmSeries(film, printHere, isFilm){

   for (var i = 0; i < film.length; i++) {
      var elem = film[i];

      var source = $(".global-film-series").text();

      var template = Handlebars.compile(source);


      if(isFilm == true){
         var titolo = elem.title;
         var titoloOriginale = elem.original_title;
      }else{
         var titolo = elem.name;
         var titoloOriginale = elem.original_name
      }

      var globalFilm  = {
         titolo: elementi.title,
         imglink: createPoster(elem.poster_path),
         titoloOriginale: elementi.original_title,
         lingua: elementi.original_language,
         voto: Math.ceil(elementi.vote_average),
         flag: creazioneBandiera(elementi.original_language),
         stella: creazioneStelle(Math.ceil(elementi.vote_average))
      };
      var html = template(globalFilm);
      console.log(html);
      printHere.append(html);
   }

}
