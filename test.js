const fetch = require('node-fetch');

let term = 'Iron Man';

getData(term);

async function getData(searchTerm) {
    let response = await fetch('https://yts.mx/api/v2/list_movies.json?order_by=asc&query_term=' + searchTerm);
    let data = await response.json();
    for (var i = 0; i < data['data']['movie_count']; i++) {
        let temp = data['data']['movies'][i];
        console.log(temp['title']);
        console.log(temp['year']);
        console.log(temp['genres'][0]);
        console.log(temp['rating']);
        console.log(temp['runtime'] + " mins");
        let rating = temp['mpa_rating'] ? temp['mpa_rating'] : "Rating N/A";
        console.log(rating);
        console.log(temp['language']);
        console.log('https://www.youtube.com/watch?v=' + temp['yt_trailer_code']);
        console.log('Torrent: ' + temp['torrents'][0]);
        console.log('\n');
    }
}