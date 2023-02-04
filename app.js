const TelegramBot = require('node-telegram-bot-api')
const token = '6049310844:AAFXst432b0q3uB-yFxn1ZaGyvm8QJ2g0J4'
const bot = new TelegramBot(token, {polling: true})

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Новости школы', callback_data: '1'},
                    {text: 'Расписание уроков', callback_data: '2'}
                ]

            ]
        }
    }
    bot.sendMessage(chatId, `Добро пожаловать в школьный бот! Я здесь, чтобы помочь вам со всеми вашими школьными потребностями.`, options)
})

const schedule = {
    '5': {
        'A': ['Математика', 'История', 'Английский язык'],
        'B': ['Наука', 'География', 'Искусство']
    },
    '6': {
        'A': ['Биология', 'Химия', 'Физика'],
        'B': ['Литература', 'Музыка', 'Физическая культура']
    },
    '7': {
        'A': ['Математика', 'История', 'Английский язык'],
        'B': ['Наука', 'География', 'Искусство']
    },
    '8': {
        'A': ['Биология', 'Химия', 'Физика'],
        'B': ['Литература', 'Музыка', 'Физическая культура']
    },
    '9': {
        'A': ['Математика', 'История', 'Английский язык'],
        'B': ['Наука', 'География', 'Искусство']
    },
    '10': {
        'A': ['Биология', 'Химия', 'Физика'],
        'B': ['Литература', 'Музыка', 'Физическая культура']
    },
    '11': {
        'A': ['Математика', 'История', 'Английский язык'],
        'B': ['Наука', 'География', 'Искусство']
    }
}

const handlerSendSchedule = () => {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id
        const classLetter = msg.text[0]
        const classNumber = msg.text[1].toUpperCase()

        if (schedule[classLetter] && schedule[classLetter][classNumber]) {
            const subjects = schedule[classLetter][classNumber]
            const scheduleMessage = `Расписание ${classLetter}${classNumber} класса: \n\n` + subjects.join('\n')
            bot.sendMessage(chatId, scheduleMessage)
        } else {
            bot.sendMessage(chatId, 'Класс не найден. Пожалуйста, введите действительную букву класса и номер.')
        }
    })
}


bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message
    const chatId = message.chat.id
    const option = callbackQuery.data

    const news = [
        'Новость 1: Последнее обновление по глобальной пандемии.',
        'Новость 2: Школа возобновляется завтра с новыми мерами безопасности.',
        'Новость 3: Школьный совет анонсирует планы для виртуальной церемонии выпускников.',
    ]
    const handlerSendNews = () => {
        try {
            setTimeout(() => {
                bot.sendMessage(chatId, 'Последние новости:\n\n' + news.join('\n\n'))
            }, 2000)
        } catch (e) {
            bot.sendMessage(chatId, 'Invalid option selected')
        }
    }

    switch (option) {
        case '1':
            bot.sendMessage(chatId, 'Отправляю вам последние новости школы')
            handlerSendNews()
            break
        case '2':
            bot.sendMessage(chatId, 'Введите букву и номер вашего класса')
            handlerSendSchedule()
            break
        default:
            bot.sendMessage(chatId, 'Invalid option selected')
    }
})


