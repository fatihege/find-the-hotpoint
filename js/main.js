addEventListener('load', e => {
    const DEFAULT_GAME_MODE = 3
    const GAME_MODES = {
        1: 'baby',
        2: 'easy',
        3: 'normal',
        4: 'hard',
        5: 'extreme',
    }

    const object = document.querySelector('.container .object')
    const overScreen = document.querySelector('.container .over')
    const ui = document.querySelector('.container .ui')
    const modesElem = ui.querySelector('.modes')
    const modeElems = modesElem.querySelectorAll('span.mode')
    const playBtn = ui.querySelector('.play .play-button')
    const warm = document.querySelector('.container .warm')
    let gameMode = DEFAULT_GAME_MODE
    let started = false
    let finished = false
    let randomPos = {
        x: 0,
        y: 0,
    }
    let elapsedTime = 0
    let timeInterval = null

    if (localStorage.getItem('gameMode')) {
        const localGameMode = localStorage.getItem('gameMode')
        if (parseInt(localGameMode) && localGameMode >= 1 && localGameMode <= Object.values(GAME_MODES).length)
            gameMode = parseInt(localGameMode)
    }

    const resetGame = () => {
        warm.style.opacity = 0
        overScreen.classList.remove('show')
        ui.classList.remove('hide')
        ui.classList.remove('nonvisible')
        playBtn.classList.remove('active')
        object.style.left = '-100%'
        object.style.top = '-100%'
        started = finished = false
        clearInterval(timeInterval)
        timeInterval = null
        elapsedTime = 0
    }

    const finishGame = () => {
        overScreen.querySelector('span.time').innerText = elapsedTime
        overScreen.classList.add('show')
        ui.classList.remove('hide')
        clearInterval(timeInterval)
        timeInterval = null
        elapsedTime = 0
    }

    const initializeGame = () => {
        if (started) return
        started = true

        overScreen.classList.remove('show')

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        let randomPosX = Math.round(Math.random() * (windowWidth + 1))
        if (randomPosX > windowWidth - 50) randomPosX = windowWidth - 50
        else if (randomPosX < 50) randomPosX = 50
        let randomPosY = Math.round(Math.random() * (windowHeight + 1))
        if (randomPosY > windowHeight - 50) randomPosY = windowHeight - 50
        else if (randomPosY < 50) randomPosY = 50

        randomPos.x = randomPosX
        randomPos.y = randomPosY

        for (let i = 1; i <= Object.keys(GAME_MODES).length; i++) {
            object.classList.remove(GAME_MODES[i])
        }
        object.classList.add(GAME_MODES[gameMode])
        object.style.left = `${randomPosX}px`
        object.style.top = `${randomPosY}px`

        playBtn.classList.add('active')
        ui.classList.add('hide')
        playBtn.addEventListener('transitionend', () => {
            if (getComputedStyle(playBtn).opacity == 0) {
                ui.classList.add('nonvisible')
            }
        })

        timeInterval = setInterval(() => {
            elapsedTime += 0.5
        }, 500)
    }

    const currentGameModeBtn = modesElem.querySelector('span.mode.active')
    if (currentGameModeBtn.dataset.mode != gameMode) {
        modesElem.querySelector('span.mode.active').classList.remove('active')
        modesElem.querySelector(`span.mode[data-mode="${gameMode}"]`).classList.add('active')
    }

    addEventListener('resize', () => {
        if (!finished) resetGame()
    })

    addEventListener('keyup', e => {
        if (started && e.keyCode === 82) resetGame()
        else if (!started && e.keyCode === 32) initializeGame()
    })

    addEventListener('mousemove', e => {
        if (!started || finished) return

        const mouseX = e.clientX
        const mouseY = e.clientY
        const distanceX = Math.abs(mouseX - randomPos.x)
        const distanceY = Math.abs(mouseY - randomPos.y)
        const hip = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY))
        const objWidth = parseInt(getComputedStyle(object).width.replace('px', ''))
        const offset = objWidth + objWidth / 2
        const difference = offset - hip

        if (hip < offset) warm.style.opacity = difference / offset
        else warm.style.opacity = 0

    })

    modeElems.forEach(m => m.addEventListener('click', e => {
        let newGameMode = parseInt(e.target.dataset.mode)
        if (newGameMode !== gameMode && newGameMode >= 1 && newGameMode <= Object.values(GAME_MODES).length) {
            modesElem.querySelector('span.mode.active')
                .classList.remove('active')
            gameMode = newGameMode
            localStorage.setItem('gameMode', newGameMode)
            e.target.classList.add('active')
        }
    }))

    playBtn.addEventListener('click', () => initializeGame())

    object.addEventListener('click', () => {
        if (!started || finished) return
        finished = true
        finishGame()
    })
})
