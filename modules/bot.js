import TelegramBot from "node-telegram-bot-api";
import  config  from "config";

export const bot = new TelegramBot(config.get(`token`), {polling: true});
