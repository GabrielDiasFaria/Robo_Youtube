const robots = {
    userInput: require('./user_input/index.js'),
    text: require('./text_creator/index.js')
}

async function start() {
    const content = {
        maximumSentences: 7
    }

    robots.userInput(content)
    await robots.text(content)

    console.log(JSON.stringify(content, null, 4))
}

start()