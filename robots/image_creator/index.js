const state = require('../state/index.js')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const googleSearch = require('../Credentials/google.json')

async function robot() {
    const content = state.load()

    await fetchImagesOfAllSentences(content)
    state.save(content)

    console.dir(content, { depth: null })

    async function fetchImagesOfAllSentences(content) {
        for (const sentence of content.sentences) {
            const query = `${content.searchTerm} ${sentence.keyWords[0]}`
            sentence.images = await fetchGoogleAndReturnImagesLinks(query)

            sentence.googleSearchQuery = query
        }
    }

    async function fetchGoogleAndReturnImagesLinks(query) {
        const response = await customSearch.cse.list({
            auth: googleSearch.engineKey, //"AIzaSyAjRZ7YuL7dODEm0GUPBxSTdffiM4zNpqQ",
            cx: googleSearch.searchKey,   //"008452738890827765661:xkwqnlzoplf",
            q: query,
            searchType: 'image',
            num: 2
        })

        const imagesUrl = response.data.items.map((item) => {
            return item.link
        })

        return imagesUrl
    }

}

module.exports = robot