console.log('Hello, user!');

//Premere su entra
function onClick(){
    console.log('Hai cliccato "entra"');
}

const b = document.querySelector('.button');
b.addEventListener('click', onClick);

/*Codice per mappa cittadella con modale*/

function createImage(src) {
    const image = document.createElement('img');
    image.src = src;
    return image;
  }
  
  function onThumbnailClick(event) {
    const image = createImage(event.currentTarget.src);
    modalView.appendChild(image);
    modalView.classList.remove('hidden');
  }
  
  function onModalClick() {
    modalView.classList.add('hidden');
    modalView.innerHTML = '';
  }

  const albumView = document.querySelector('#album-view');
  for (let i = 0; i < PHOTO_LIST.length; i++) {
    const photoSrc = PHOTO_LIST[i];
    const image = createImage(photoSrc);
    image.addEventListener('click', onThumbnailClick);
    albumView.appendChild(image);
  }
  
  const modalView = document.querySelector('#modal-view');
  modalView.addEventListener('click', onModalClick);

  //CODICE per API con openlibrary

  function onJson(json){
      console.log('JSON ricevuto');
      const library = document.querySelector('#library-view');
      library.innerHTLM = ''; //svuotare
  
      let num_results = json.num_found;
      if(num_results > 3) num_results = 3;
      if(num_results == 0){
          console.log("Risultato non trovato");
      }
      
      for(let i=0; i<num_results; i++){
          const doc = json.docs[i];
         // const author = doc.author_name;
          const isbn = doc.isbn[0];
          const cover_url = 'http://covers.openlibrary.org/b/isbn/' + isbn + '-M.jpg';
  
          const book = document.createElement('div');
          book.classList.add('book');
          const img = document.createElement('img');
          img.src = cover_url;
          //const caption = document.createElement('span');
          //caption.textContent = author;
  
          book.appendChild(img);
          //book.appendChild(caption);
          library.appendChild(book);
  
      }
  }
  
  function onResponse(response){
      res = response.json();
      console.log(res);
      return res;
      
  }
  
  function search(event){
      event.preventDefault(); //impedire che la pagina si aggiorni
      const title_input = document.querySelector('#title');
      const title_value = encodeURIComponent(title_input.value);
      console.log('Eseguo ricerca: ' + title_value);
  
      rest_url = 'https://openlibrary.org/search.json?title=' + title_value;
      console.log('URL: ' + rest_url);
  
      fetch(rest_url).then(onResponse).then(onJson);
  }
  
  const form = document.querySelector('form');
  form.addEventListener('submit', search);
  
  
  
  //CODICE per API con Spotify
  
  function research(event){
    event.preventDefault(); //Impedire che la pagina si ricarichi
    
    // Leggi valore del campo di testo
    const album_value = document.querySelector('#album').value;
      const text = encodeURIComponent(album_value);
    console.log('Eseguo ricerca per: ' + text);
  
          fetch("https://api.spotify.com/v1/search?type=album&q=" + text,{
              method: "get",
              headers:{
                  Authorization : `Bearer ${token}`
              }
          }).then(onResponseSpotify).then(onJson_Spotify);
      }
  
      function onJson_Spotify(json){
          console.log("Json ricevuto");
          console.log(json);
  
  
          const album_library = document.querySelector('#music-view');
          album_library.innerHTML = ''; //svuotare
  
          const results_album = json.albums.items;
          let num_results_album = results_album.length;
  
          if(num_results_album > 3) num_results_album = 3;
  
          for(let i=0; i<num_results_album; i++){
              const album_data = results_album[i];
              const title = album_data.name;
              const album_image = album_data.images[0].url;
              
              const album = document.createElement('div');
              album.classList.add('album');
  
              const img_album = document.createElement('img');
              img_album.src = album_image;
  
              //const caption = document.createElement('span');
              //caption.textContent = title;
  
              album.appendChild(img_album);
              //album.appendChild(caption);
              album_library.appendChild(album);
          }
      }
  
      function onResponseSpotify(response_token) {
          console.log('Risposta ricevuta');
          res1 = response_token.json();
          console.log(res1);
          return res1;
        }
  
      function onTokenJson(json)
      {
          token = json.access_token;
          console.log("Token ricevuto");
          console.log("TOKEN: " + token);
      }
      
      function onPromise(promise) {
        return promise.json();
      }
  
      //RICHIESTA DEL TOKEN
  
      const client_id = 'b7c2cb61dea44a4d8c68de6398a4675b';
      const client_secret = '233b16a8adfa4016a647fdf89a64a687';
  
      let token;
      fetch("https://accounts.spotify.com/api/token",
          {
          method: 'post',
          body: 'grant_type=client_credentials',
          headers:{
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
          }
          }
      ).then(onPromise).then(onTokenJson);
  
  const form2 = document.querySelector('#form_Spotify');
  form2.addEventListener('submit', research);
  