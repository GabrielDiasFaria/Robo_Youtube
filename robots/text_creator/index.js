const algorithmia = require('algorithmia')
const sentenceBoundaryDetection = require('sbd')

const state = require('../state/index.js')

const apiKeyAlgorithmia = require('../Credentials/algorithmia.json').apiKey

const apiKeyWatson = require('../Credentials/watson.json').apikey
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
    /*username: 'gabrieldiasfaria@gmail.com',
    password: 'Anima1532',*/
    iam_apikey: apiKeyWatson,
    version: '2019-07-12',
    url: 'https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/41f42235-6f19-42b9-a408-d669ee7cb952'
});

async function robot() {
    const content = state.load()

    await getContentFromWikpedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
    limitMaximumSentences(content)
    await getKeywordsOfAllSentences(content)

    state.save(content)

    async function getContentFromWikpedia() {
        const algorithmiaAuthenticated = algorithmia(apiKeyAlgorithmia)
        const wikpediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')

        const wikpediaResponse = await wikpediaAlgorithm.pipe({
            "articleName": content.searchTerm,
            "lang": content.lang
        })
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

            return withoutBlankLines.join(' ')
        }
    }

    function breakContentIntoSentences(content) {
        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            //if (content.sentences.length <= content.maximumSentences)
            content.sentences.push({
                text: sentence,
                keyWords: [],
                images: []
            })
        })
    }

    function limitMaximumSentences(content) {
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }

    async function getKeywordsOfAllSentences(content) {
        for (const sentence of content.sentences) {
            sentence.keyWords = await getWatsonAndReturnKeywords(sentence.text)
        }
    }

    async function getWatsonAndReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                }
            }, (error, response) => {
                if (error) {
                    reject(error)
                    return
                }

                const keywords = response.keywords.map((keyword) => {
                    return keyword.text
                })

                resolve(keywords)
            })
        })
    }
}

module.exports = robot