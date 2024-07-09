require("dotenv").config()
const { Client, GatewayIntentBits } = require('discord.js');
const { connectMongoDb } = require('./connection');
connectMongoDb("mongodb://127.0.0.1:27017/url-short")
const shortid = require("shortid")
const URL = require("./models/url");
const urlRoute = require('./routes/url');
const express = require("express")

const app = express()
app.use("/url" , urlRoute)
const client = new Client({ intents: [GatewayIntentBits.Guilds , GatewayIntentBits.GuildMessages , GatewayIntentBits.MessageContent] });

async function urlCreator(url) {
    const shortId = shortid(8) ; 
    await URL.create({
        shortId: shortId , 
        redirectURL: url , 
    })
    return shortId
}



client.on("messageCreate" , async (message) => {
    console.log(message.content)
    if(message.author.bot) {
        return 
    }
    if(message.content.startsWith('generate short url:')) {
        const url = message.content.split('generate short url:')[1] ; 
        const shortId = await urlCreator(url)
        return message.reply({
            content: "Generated short url is http://127.0.0.1:8000/url/" + shortId
        })
        
    }
    return message.reply({
        content: "Hi this is bot from subhan's server.How may I help you!"
    })
})
client.on("interactionCreate" , (interaction) => {
    interaction.reply("Pong")
})

client.login(`${process.env.DISCORD_BOT_TOKEN}`)
const PORT = 8000 
app.listen(PORT ,() => console.log("Server started at PORT: " , PORT))