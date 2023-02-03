const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')

const token = 'YOUR_TELEGRAM_BOT_TOKEN'
const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/news/, (msg) => {
    const chatId = msg.chat.id

    // Получение последних новостей из аккаунта Instagram
    async function getInstagramData(username) {
        const response = await fetch(`https://www.instagram.com/${username}/?__a=1`)
        const data = await response.json()

        return data
    }

    getInstagramData('instagram')
        .then(data => {
        console.log(data)
    })


    bot.sendMessage(chatId, 'Here is the latest news: ' + latestNews)
})
