const algorithmia = require('algorithmia')
const apyKey = require('../credentials.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content) {
    await getContentFromWikpedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)

    async function getContentFromWikpedia() {
        const algorithmiaAuthenticated = algorithmia(apyKey)
        const wikpediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikpediaResponse = await wikpediaAlgorithm.pipe(content.searchTerm)
        const wikpediaContent = wikpediaResponse.get()
        content.sourceContentOriginal = wikpediaContent.content
    }

    function sanitizeContent(content) {
        const sanitizeText = withoutBlankLinesAndMarkDown(content.sourceContentOriginal)

        content.sourceContentSanitized = sanitizeText

        function withoutBlankLinesAndMarkDown(text) {
            const allLines = text.split('\n')

            const withoutBlankLines = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('='))
                    return false
                return true
            })

            return withoutMarkDown.join(' ')
        }
    }

    function breakContentIntoSentences(content) {
        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keyWords: [],
                images: []
            })
        })
    }
}

module.exports = robot