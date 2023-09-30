require('.gitignore/.env').config();

const tmdbKey = process.env.TMDB_KEY;
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const playBtn = document.getElementById('playBtn');

const getGenres = async () => {
  const genreRequestEndpoint = '/genre/movie/list';
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;

  try { const response = await fetch(urlToFetch, {
      method: 'GET',
    });

   if (response.ok) {
    const jsonResponse = await response.json();
    const genres = jsonResponse.genres;
    return genres
   } else {
    throw new Error('Failed to fetch genres');
   }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  const discoverMovieEndpoint = '/discover/movie';
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
  const urlTofetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;

  try { const response = await fetch(urlToFetch, {
    method: 'GET',
  });

    if (response.ok === true) {
      const jsonResponse = response.json();
      const movies = jsonResponse.results;
      return movies;
    } else {
      throw new Error('Failed to fetch movies.');
    }
   } catch (error) {
    console.error('error', error.message);
  }
};

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;

  try { const response = await fetch(urlToFetch, {
    method: 'GET',
  });

    if (response.ok === true) {
      const movieInfo = await response.json();
      return movieInfo;
    }
  } catch (error) {
    console.error('error', error.message);
  }
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };
  const movies = await getMovies();
  const randomMovie = getRandomMovie(movies);
  const info = await getMovieInfo(randomMovie);
  return await displayMovie(info);
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;
