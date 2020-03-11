const algorithmia = require('algorithmia')
const apyKey = require('../credentials.json').apiKey

async function robot(content) {
    await getContentFromWikpedia(content)
    sanitizeContent(content)
    //breakContentIntoSentences(content)

    async function getContentFromWikpedia() {
        const algorithmiaAuthenticated = algorithmia(apyKey)
        const wikpediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikpediaResponse = await wikpediaAlgorithm.pipe(content.searchTerm)
        const wikpediaContent = wikpediaResponse.get()
        content.sourceContentOriginal = wikpediaContent.content
    }

    function sanitizeContent(content) {
        const sanitizeText = withoutBlankLinesAndMarkDown(content.sourceContentOriginal)

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
}

module.exports = robot