const readLine = require('readline-sync')
const state = require('../state/index.js')

function robot() {
    const content = {
        maximumSentences: 7
    }

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()
    content.lang = askAndReturnLang()
    state.save(content)

    function askAndReturnSearchTerm() {
        return readLine.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The History of']
        const selectedPrefixIndex = readLine.keyInSelect(prefixes, 'Choose Prefix option: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]
        return selectedPrefixText
    }

    function askAndReturnLang() {
        const langs = ['br', 'en']
        const selectedLangIndex = readLine.keyInSelect(langs, 'Choose Language option: ')
        const selectedLangText = langs[selectedLangIndex]
        return selectedLangText
    }

}

module.exports = robot



