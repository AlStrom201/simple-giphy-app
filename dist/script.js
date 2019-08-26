const API_KEY = 'lLq1u2VZFOrm5xQ0zvpccPqc2GepOS84';
const RATING = 'G';

let model = {
  gifs: [],
  searchField: '',
  limit: 4,
  offset: 0
};

//lazy load observer
let observer = new IntersectionObserver(
  function(entries, self) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        preloadImage(entry.target);
      } else {
        console.log('yo');
        fallbackImage(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0,
    rootMargin: '0px'
  }
);

// Getting request by using the fetch api
function getTrending(observeImg) {
  reset();
  document.querySelector('#js-back-trending').classList.remove('trending-show');
  document.querySelector('#js-header').style.display = 'flex';
  fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${model.limit}&rating=G`
  )
    .then(response => {
      return response.json();
    })
    .then(json => {
      json.data.forEach(item => {
        appendGif(item.images.fixed_height.url);
      });
      observeImg();
    });
}

function getSearch(observeImg) {
  reset();
  document.querySelector('#js-back-trending').classList.add('trending-show');
  document.querySelector('#js-header').style.display = 'none';
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${model.searchField}&limit=${model.limit}&offset=0&rating=${RATING}&lang=en1`
  )
    .then(response => {
      return response.json();
    })
    .then(json => {
      if (json.data.length < 1) {
        notFound();
      } else {
        json.data.forEach(item => {
          appendGif(item.images.fixed_height.url);
        });
        observeImg();
      }
    });
}

// Getting request using xhr for educational purposes
function loadMore(observeImg) {
  let data = '';
  var req = new XMLHttpRequest();
  if (model.searchField) {
    req.open(
      'GET',
      `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${
        model.searchField
      }&limit=${model.limit}&rating=${RATING}&offset=${(model.offset += 4)}`
    );
  } else {
    req.open(
      'GET',
      `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${
        model.limit
      }&rating=${RATING}&offset=${(model.offset += 4)}`
    );
  }

  req.addEventListener('load', function() {
    data = JSON.parse(this.responseText).data;
    data.forEach(function(item) {
      appendGif(item.images.fixed_height.url);
    });
    observeImg();
  });
  req.send();
}

// Main way to interact with the DOM.
// This function inserts GIF into the document.
function appendGif(gifURL) {
  let html = `<a href="${gifURL}" class="gif">
          <img
            class="gif-img none"
            src="/images/loading.gif"
            data-src="${gifURL}"

          />
        </a>`;
  document.getElementById('js-list').insertAdjacentHTML('beforeend', html);
}
//lazy load functions
function preloadImage(img) {
  img.src = img.getAttribute('data-src');
}

function fallbackImage(img) {
  img.src = 'images/loading.gif';
  console.log(img.src);
}

// Small Functions
function updateSearch(e) {
  model.searchField = e.target.value;
}

function notFound() {
  document.getElementById('js-error').classList.add('error-show');
  document.getElementById(
    'js-error'
  ).innerHTML = `Sorry, "${model.searchField}" could not be found.`;
}

function clearGIF() {
  document.getElementById('js-list').innerHTML = '';
}

// Resets DOM Elements and Current State
function reset() {
  clearGIF();
  document.getElementById('js-error').classList.remove('error-show');
  let resetModel = {
    gifs: model.gifs,
    searchField: model.searchField,
    limit: 4,
    offset: 0
  };
  model = resetModel;
}

function init() {
  function addObs() {
    document.querySelectorAll('.gif-img').forEach(img => {
      observer.observe(img);
    });
  }
  getTrending(addObs);

  document.getElementById('js-search').addEventListener('input', updateSearch);
  document.getElementById('js-search').addEventListener('keydown', e => {
    if (e.keyCode === 13) getSearch(addObs);
  });
  document.querySelector('#js-load').addEventListener('click', () => {
    loadMore(addObs);
  });
  document.getElementById('js-back-trending').addEventListener('click', () => {
    getTrending();
  });
}

init();
