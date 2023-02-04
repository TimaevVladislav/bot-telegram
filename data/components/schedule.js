const TelegramBot = require('node-telegram-bot-api')
const token = ''
const bot = new TelegramBot(token, {polling: true})
function getSchedule(dayOfWeek) {
    const schedule = {
        "Monday": [
            { subject: "Math", time: "9:00 AM - 10:00 AM" },
            { subject: "History", time: "10:15 AM - 11:15 AM" },
            { subject: "Science", time: "11:30 AM - 12:30 PM" }
        ],
        "Tuesday": [
            { subject: "English", time: "9:00 AM - 10:00 AM" },
            { subject: "Art", time: "10:15 AM - 11:15 AM" },
            { subject: "Physical Education", time: "11:30 AM - 12:30 PM" }
        ],
        "Wednesday": [
            { subject: "Math", time: "9:00 AM - 10:00 AM" },
            { subject: "Science", time: "10:15 AM - 11:15 AM" },
            { subject: "History", time: "11:30 AM - 12:30 PM" }
        ],
        "Thursday": [
            { subject: "English", time: "9:00 AM - 10:00 AM" },
            { subject: "Physical Education", time: "10:15 AM - 11:15 AM" },
            { subject: "Art", time: "11:30 AM - 12:30 PM" }
        ],
        "Friday": [
            { subject: "Math", time: "9:00 AM - 10:00 AM" },
            { subject: "History", time: "10:15 AM - 11:15 AM" },
            { subject: "Science", time: "11:30 AM - 12:30 PM" }
        ]
    }

    return schedule[dayOfWeek] || "No schedule found for this day.";
}

const schedule = {
    'A': {
        '5': ['Math', 'History', 'English'],
        '6': ['Science', 'Geography', 'Art']
    },
    'B': {
        '5': ['Biology', 'Chemistry', 'Physics'],
        '6': ['Literature', 'Music', 'Physical Education']
    }
}
const handlerSendSchedule = () => {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const classLetter = msg.text[0];
        const classNumber = msg.text[1];

        if (schedule[classLetter] && schedule[classLetter][classNumber]) {
            const subjects = schedule[classLetter][classNumber];
            const scheduleMessage = `Class ${classLetter}${classNumber} schedule: \n\n` + subjects.join('\n');
            bot.sendMessage(chatId, scheduleMessage);
        } else {
            bot.sendMessage(chatId, 'Class not found. Please enter a valid class letter and number.');
        }
    })
}
