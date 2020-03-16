const state = require('../state/index.js')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const googleSearch = require('../Credentials/google.json')
const downloader = require('image-downloader')

async function robot() {
    const content = state.load()

    //await fetchImagesOfAllSentences(content)
    await downloadAllImages(content)

    //state.save(content)

    async function downloadAllImages(content) {
        content.downloadedImages = []

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            const images = content.sentences[sentenceIndex].images

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const imageUrl = images[imageIndex]

                try {
                    await downloadImageAndSave(imageUrl, `${sentenceIndex}-original.png`)
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error('Imagem já baixada')
                    }
                    content.downloadedImages.push(imageUrl)
                    console.log(`>>> [${sentenceIndex}][${imageIndex}] SUCESSO - Download da Imagem: ${imageUrl}`)
                    break
                } catch (error) {
                    console.log(`>>> [${sentenceIndex}][${imageIndex}] ERROR - Download da Imagem: ${imageUrl}: ${error}`)
                }
            }
        }
    }

    async function downloadImageAndSave(url, fileName) {
        return downloader.image({
            url, url,
            dest: `./images/${fileName}`
        })
    }

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