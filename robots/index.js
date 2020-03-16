const robots = {
    userInput: require('./user_input/index.js'),
    text: require('./text_creator/index.js'),
    state: require('./state/index.js'),
    image: require('./image_creator/index.js')
}

async function start() {
    //robots.userInput()
    //await robots.text()
    robots.image()

    //console.dir(content, { depth: null })
}

start()