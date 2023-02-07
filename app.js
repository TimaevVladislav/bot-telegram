const { config } = require("dotenv")
const express = require("express")
const { Configuration, OpenAIApi } = require("openai")
const TelegramBot = require('node-telegram-bot-api')
const app = express()

config()

const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const configuration = new Configuration({ apiKey: process.env.OPENAI_TOKEN })
const openai = new OpenAIApi(configuration)

const { schedule } = require("./data/components/schedule")

bot.on('callback_query', async (callbackQuery) => {
    const action = callbackQuery.data
    const message = callbackQuery.message

    if(action !== "2") {
        bot.on('message', async () => {
            try {
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
                        return bot.sendMessage(chatId, 'Пожалуйста, попробуйте ещё раз, Бот не смог отправить данные...')
                    }

                    return bot.sendMessage(chatId, basePromptOuput.text)
                }
            } catch (e) {
                console.log(e)
            }
        })
    }
})

bot.onText(/\/start/, async (message) => {
   try {
       const chatId = message.chat.id

       const options = {
           reply_markup: {
               inline_keyboard: [
                   [
                       {text: 'Интересный факт', callback_data: '1'},
                       {text: 'Расписание уроков', callback_data: '2'},
                   ]

               ]
           }
       }
       return bot.sendMessage(chatId, `Добро пожаловать в школьный бот! Я здесь, чтобы помочь вам со всеми вашими школьными потребностями.`, options)
   } catch (e) {
       console.log(e)
   }
})


bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data
    const message = callbackQuery.message
    const chatId = message.chat.id

    if (action) {
        // Отловить нажатие на кнопку
        bot.sendMessage(chatId, 'Пожалуйста, ожидайте, Я отправляю вам данные...')
    }
})

bot.on('callback_query', async (callbackQuery) => {
    try {
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
            bot.sendMessage(chatId, 'Пожалуйста, попробуйте ещё раз, Бот не смог отправить данные...')
        }

        if(option === "2") {
            bot.sendMessage(chatId, 'Введите номер и букву вашего класса на английском')

            bot.on('message', (message) => {
                const chatId = message.chat.id
                const classLetter = message.text[0]
                const classNumber = message.text[1].toUpperCase()


                if(message.text !== "/start") {
                    if (schedule[classLetter] && schedule[classLetter][classNumber]) {
                        const subjects = schedule[classLetter][classNumber]
                        const scheduleMessage = `Расписание ${classLetter}${classNumber} класса: \n\n` + subjects.join('\n')
                        bot.sendMessage(chatId, scheduleMessage)

                    } else {
                        bot.sendMessage(chatId, 'Класс не найден. Пожалуйста, введите действительную букву класса и номер.')
                    }
                }
            })
        } else {
            await bot.sendMessage(chatId, basePromptOuput.text)
        }

    } catch (e) {
        console.log(e)
    }
})

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), () => { console.log('Bot is running, server is listening on port', process.env.PORT) })


