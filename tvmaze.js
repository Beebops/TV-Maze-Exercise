'use strict'

const $showsList = $('#shows-list')
const $episodesArea = $('#episodes-area')
const $episodesList = $('#episodes-list')
const $searchForm = $('#search-form')
const missingImage = 'http://tinyurl.com/missing-tv'

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const shows = []
  const response = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${term}`
  )
  let results = response.data
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const showObj = {
      id: result.show.id,
      name: result.show.name,
      id: result.show.id,
      summary: result.show.summary,
      imageURL: result.show.image ? result.show.image.medium : missingImage,
    }
    shows.push(showObj)
  }
  return shows
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty()

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.imageURL}"
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-dark btn-sm Show getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    )
    $showsList.append($show)
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $('#search-query').val()
  const shows = await getShowsByTerm(term)

  $episodesArea.hide()
  populateShows(shows)
}

$searchForm.on('submit', async function (evt) {
  evt.preventDefault()
  await searchForShowAndDisplay()
})

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await axios.get(
    ` https://api.tvmaze.com/shows/${id}/episodes`
  )
  // return an array of episode objects
  let episodeList = response.data
  // for every episode obj in episodeList--> { id, name, season, number }
  const episodes = episodeList.map((episode) => {
    episode = {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    }
    return episode
  })

  return episodes
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty()
  for (let episode of episodes) {
    const $li = $(
      `<li>${episode.name} (season ${episode.season} number ${episode.number})</li>`
    )
    $episodesList.append($li)
  }
  $episodesArea.show()
}

$('#shows-list').on('click', '.getEpisodes', async (e) => {
  console.log('clicked')
  let showId = $(e.target).closest('[data-show-id').data('show-id')
  console.log(showId)
  let episodes = await getEpisodesOfShow(showId)
  console.log(episodes)
  populateEpisodes(episodes)
})
