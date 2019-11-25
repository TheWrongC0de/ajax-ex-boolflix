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
                 imglink: 'https://image.tmdb.org/t/p/w500' + elementi.poster_path,
                 titoloOriginale: elementi.original_title,
                 lingua: elementi.original_language,
                 voto: elementi.vote_average
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
