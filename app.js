const { config } = require("dotenv")

const { Configuration, OpenAIApi } = require("openai")
const TelegramBot = require('node-telegram-bot-api')

config()

const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const configuration = new Configuration({ apiKey: process.env.OPENAI_TOKEN })
const openai = new OpenAIApi(configuration)

bot.on('message', async (message) => {
   if(message.text !== "/start") {
       const baseCompletion = await openai.createCompletion({
           model: 'text-davinci-003',
           prompt: `${message.text}.\n`,
           temperature: 0.8,
           max_tokens: 1000,
       })

       const chatId = message.chat.id

       const basePromptOuput = baseCompletion.data.choices.pop()

       if (!basePromptOuput.text) {
           return bot.sendMessage(chatId, "Пожалуйста, попробуйте ещё раз, Бот не смог отправить данные...")
       }

       return bot.sendMessage(chatId, basePromptOuput.text)
   }
})
bot.onText(/\/start/, async (message) => {
    const chatId = message.chat.id

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Интересный факт', callback_data: '1'},
                    {text: 'Расписание уроков', callback_data: '2'}
                ]

            ]
        }
    }
    return bot.sendMessage(chatId, `Добро пожаловать в школьный бот! Я здесь, чтобы помочь вам со всеми вашими школьными потребностями.`, options)
})

bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data
    const message = callbackQuery.message
    const chatId = message.chat.id

    if (action) {
        // Отловить нажатие на копку
        return bot.sendMessage(chatId, "Пожалуйста, ожидайте, Я отправляю вам данные...")
    }
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
            return bot.sendMessage(chatId, scheduleMessage)
        } else {
            return bot.sendMessage(chatId, 'Класс не найден. Пожалуйста, введите действительную букву класса и номер.')
        }
    })
}

bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message
    const chatId = message.chat.id
    const option = callbackQuery.data

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Интересный факт.\n`,
        temperature: 0.8,
        max_tokens: 1000,
    })

    const basePromptOuput = baseCompletion.data.choices.pop()

    if (!basePromptOuput.text) {
        return bot.sendMessage(chatId, "Пожалуйста, попробуйте ещё раз, Бот не смог отправить данные...")
    }

    switch (option) {
        case '1':
            await bot.sendMessage(chatId, basePromptOuput.text)
            break
        case '2':
            await bot.sendMessage(chatId, 'Введите номер и букву вашего класса')
            handlerSendSchedule()
            break
        default:
           return bot.sendMessage(chatId, 'Invalid option selected')
    }
})


