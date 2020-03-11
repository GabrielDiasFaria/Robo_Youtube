const robots = {
    userInput: require('./user_input/index.js'),
    text: require('./text_creator/index.js')
}

async function start() {
    const content = {}

    robots.userInput(content)
    await robots.text(content)

    //console.log(content)
}

start()