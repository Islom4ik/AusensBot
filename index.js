const { Telegraf, Markup } = require('telegraf');
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN);
const { Client, MusicClient } = require("youtubei");
const ytubes = new Client();
const music = new MusicClient();

const { collection, searchedb, ObjectId } = require('./additions/DB');
const { client } = require('./additions/Spotyfi');
const { download } = require('./functions/download');
const { createsearch } = require('./additions/create-canv');

// ----------------------------------------------------------------------- \\

bot.start((ctx) => {
    ctx.replyWithPhoto({source: './start.png'}, {caption: 'БУ-ДУМ-ТСС - Добро пожаловать! \nВы можете написать название вашей любимой музыки боту, а замен вы получите: \n- Музыку в формате m4a \n- Ссылку на видео в YouTube данной музыки \nПомощь по боту - /help'});
});

bot.help((ctx) => ctx.reply('🔗 Для поиска треков пришлите мне название желанной музыки:'));

bot.on("text", async (ctx) => {
    try {
        const links = ctx.message.text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g)
        if (links) {
            let vidid = await links[0].substring(32);
            const vid = await ytubes.getVideo(vidid);
            let alink = await `https://www.youtube.com/watch?v=${vidid}`;
            let athumb = await vid.thumbnails.pop().url;
            let adur = await vid.duration;
            let downloaded = await collection.findOne({music_name: vid.title});
            if (downloaded == null) {
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                const audiotochan = await ctx.replyWithAudio({url: url, filename: vid.title}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: vid.channel.name, title: vid.title, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                let chaneldbsaved = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, audiotochan.message_id)
                await collection.insertOne(
                    {
                        music_id: chaneldbsaved.message_id,
                        music_name: vid.title
                    }
                )
            } else {
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            const params = {
                q: ctx.message.text,
                limit: 10,
            }
            let serchimg = createsearch(ctx.message.text);
            await client.search(params)
            .then(async data => {    
                await ctx.replyWithPhoto({source: serchimg.toBuffer()}, {protect_content: true, parse_mode: "HTML", reply_markup: {inline_keyboard: [
                    [Markup.button.callback(`${data.tracks.items[0].artists[0].name} - ${data.tracks.items[0].name}`, 'b1')],
                    [Markup.button.callback(`${data.tracks.items[1].artists[0].name} - ${data.tracks.items[1].name}`, 'b2')],
                    [Markup.button.callback(`${data.tracks.items[2].artists[0].name} - ${data.tracks.items[2].name}`, 'b3')],
                    [Markup.button.callback(`${data.tracks.items[3].artists[0].name} - ${data.tracks.items[3].name}`, 'b4')],
                    [Markup.button.callback(`${data.tracks.items[4].artists[0].name} - ${data.tracks.items[4].name}`, 'b5')],
                    [Markup.button.callback(`${data.tracks.items[5].artists[0].name} - ${data.tracks.items[5].name}`, 'b6')],
                    [Markup.button.callback(`${data.tracks.items[6].artists[0].name} - ${data.tracks.items[6].name}`, 'b7')],
                    [Markup.button.callback(`${data.tracks.items[7].artists[0].name} - ${data.tracks.items[7].name}`, 'b8')],
                    [Markup.button.callback(`${data.tracks.items[8].artists[0].name} - ${data.tracks.items[8].name}`, 'b9')],
                    [Markup.button.callback(`${data.tracks.items[9].artists[0].name} - ${data.tracks.items[9].name}`, 'b10')],
                    [Markup.button.url('- AusenS -', 'https://t.me/AusensBot')]
                ]}})
                
                let userindb = await searchedb.findOne({user_id: ctx.from.id})
                if (userindb == null) {
                    return await searchedb.insertOne(
                        {
                            user_id: ctx.from.id,
                            forwardtochan: 0,
                            lastsearched: {
                                dataf: `${data.tracks.items[0].artists[0].name} - ${data.tracks.items[0].name}`,
                                dataftitle: `${data.tracks.items[0].name}`,
                                datafart: `${data.tracks.items[0].artists[0].name}`,
                                datas: `${data.tracks.items[1].artists[0].name} - ${data.tracks.items[1].name}`,
                                datastitle: `${data.tracks.items[1].name}`,
                                datasart: `${data.tracks.items[1].artists[0].name}`,
                                datat: `${data.tracks.items[2].artists[0].name} - ${data.tracks.items[2].name}`,
                                datattitle: `${data.tracks.items[2].name}`,
                                datatart: `${data.tracks.items[2].artists[0].name}`,
                                datafo: `${data.tracks.items[3].artists[0].name} - ${data.tracks.items[3].name}`,
                                datafotitle: `${data.tracks.items[3].name}`,
                                datafoart: `${data.tracks.items[3].artists[0].name}`,
                                datafi: `${data.tracks.items[4].artists[0].name} - ${data.tracks.items[4].name}`,
                                datafititle: `${data.tracks.items[4].name}`,
                                datafiart: `${data.tracks.items[4].artists[0].name}`,
                                datasix: `${data.tracks.items[5].artists[0].name} - ${data.tracks.items[5].name}`,
                                datasixtitle: `${data.tracks.items[5].name}`,
                                datasixart: `${data.tracks.items[5].artists[0].name}`,
                                datasev: `${data.tracks.items[6].artists[0].name} - ${data.tracks.items[6].name}`,
                                datasevtitle: `${data.tracks.items[6].name}`,
                                datasevart: `${data.tracks.items[6].artists[0].name}`,
                                dataeig: `${data.tracks.items[7].artists[0].name} - ${data.tracks.items[7].name}`,
                                dataeigtitle: `${data.tracks.items[7].name}`,
                                dataeigart: `${data.tracks.items[7].artists[0].name}`,
                                datanine: `${data.tracks.items[8].artists[0].name} - ${data.tracks.items[8].name}`,
                                dataninetitle: `${data.tracks.items[8].name}`,
                                datanineart: `${data.tracks.items[8].artists[0].name}`,
                                dataten: `${data.tracks.items[9].artists[0].name} - ${data.tracks.items[9].name}`,
                                datatentitle: `${data.tracks.items[9].name}`,
                                datatenart: `${data.tracks.items[9].artists[0].name}`
                            }
                        }
                    )
                } else {
                    await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$unset: {lastsearched: {}}})
                    return await searchedb.findOneAndUpdate({user_id: ctx.from.id},
                        {$set: {
                            lastsearched: {
                                dataf: `${data.tracks.items[0].artists[0].name} - ${data.tracks.items[0].name}`,
                                dataftitle: `${data.tracks.items[0].name}`,
                                datafart: `${data.tracks.items[0].artists[0].name}`,
                                datas: `${data.tracks.items[1].artists[0].name} - ${data.tracks.items[1].name}`,
                                datastitle: `${data.tracks.items[1].name}`,
                                datasart: `${data.tracks.items[1].artists[0].name}`,
                                datat: `${data.tracks.items[2].artists[0].name} - ${data.tracks.items[2].name}`,
                                datattitle: `${data.tracks.items[2].name}`,
                                datatart: `${data.tracks.items[2].artists[0].name}`,
                                datafo: `${data.tracks.items[3].artists[0].name} - ${data.tracks.items[3].name}`,
                                datafotitle: `${data.tracks.items[3].name}`,
                                datafoart: `${data.tracks.items[3].artists[0].name}`,
                                datafi: `${data.tracks.items[4].artists[0].name} - ${data.tracks.items[4].name}`,
                                datafititle: `${data.tracks.items[4].name}`,
                                datafiart: `${data.tracks.items[4].artists[0].name}`,
                                datasix: `${data.tracks.items[5].artists[0].name} - ${data.tracks.items[5].name}`,
                                datasixtitle: `${data.tracks.items[5].name}`,
                                datasixart: `${data.tracks.items[5].artists[0].name}`,
                                datasev: `${data.tracks.items[6].artists[0].name} - ${data.tracks.items[6].name}`,
                                datasevtitle: `${data.tracks.items[6].name}`,
                                datasevart: `${data.tracks.items[6].artists[0].name}`,
                                dataeig: `${data.tracks.items[7].artists[0].name} - ${data.tracks.items[7].name}`,
                                dataeigtitle: `${data.tracks.items[7].name}`,
                                dataeigart: `${data.tracks.items[7].artists[0].name}`,
                                datanine: `${data.tracks.items[8].artists[0].name} - ${data.tracks.items[8].name}`,
                                dataninetitle: `${data.tracks.items[8].name}`,
                                datanineart: `${data.tracks.items[8].artists[0].name}`,
                                dataten: `${data.tracks.items[9].artists[0].name} - ${data.tracks.items[9].name}`,
                                datatentitle: `${data.tracks.items[9].name}`,
                                datatenart: `${data.tracks.items[9].artists[0].name}`
                            }
                        }}
                    )
                }
            }) 
        }   
    }catch(e) {
        console.error(e);
    }
})


bot.action('ques', async ctx => {
    try {
        let db = await collection.findOne({_id: ObjectId('63bad876b60a25d996ba189d')})
        if (db.queues == 1) {
            await ctx.answerCbQuery('Очередь: вы первый в очереди.', {show_alert: true})
        } else {
            await ctx.answerCbQuery(`Очередь: ${db.queues} чел. ждут своей посылки.`, {show_alert: true})
        }
    } catch (e) {
        console.error(e);
    }
})

// --------------------------------------------- \\
    // ACTIONS

bot.action('b1', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.dataf);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.dataf});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.dataftitle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.datafart, title: searchedmusic.lastsearched.dataftitle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.dataf
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})

bot.action('b2', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.datas);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.datas});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.datastitle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.datasart, title: searchedmusic.lastsearched.datastitle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.datas
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})

bot.action('b3', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.datat);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.datat});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.datattitle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.datatart, title: searchedmusic.lastsearched.datattitle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.datat
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})

bot.action('b4', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.datafo);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.datafo});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.datafotitle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.datafoart, title: searchedmusic.lastsearched.datafotitle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.datafo
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})
 
bot.action('b5', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.datafi);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.datafi});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.datafititle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.datafiart, title: searchedmusic.lastsearched.datafititle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.datafi
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})
 
bot.action('b6', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.datasix);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.datasix});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.datasixtitle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.datasixart, title: searchedmusic.lastsearched.datasixtitle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.datasix
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})
 
bot.action('b7', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.datasev);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.datasev});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.datasevtitle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.datasevart, title: searchedmusic.lastsearched.datasevtitle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.datasev
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})
 
bot.action('b8', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.dataeig);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.dataeig});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.dataeigtitle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.dataeigart, title: searchedmusic.lastsearched.dataeigtitle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.dataeig
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})
 
bot.action('b9', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.datanine);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.datanine});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.dataninetitle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.datanineart, title: searchedmusic.lastsearched.dataninetitle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.datanine
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})
 
bot.action('b10', async ctx => {
    try {
        const searchedmusic = await searchedb.findOne({user_id: ctx.from.id})
        if (searchedmusic.lastsearched) {
            const vid = await ytubes.search(searchedmusic.lastsearched.dataten);
            let alink = `https://www.youtube.com/watch?v=${vid.items[0].id}`;
            let athumb = vid.items[0].thumbnails.pop().url;
            let adur = vid.items[0].duration;
            let downloaded = await collection.findOne({music_name: searchedmusic.lastsearched.dataten});
            if (downloaded == null) {
                await ctx.answerCbQuery('Отправляю...', {show_alert: false})
                let waittext = await ctx.reply('🔄 Ожидайте, идет загрузка трека...')
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {waittext: waittext.message_id}})
                let url = await download(alink)
                let dur = adur;
                let audio = await ctx.replyWithAudio({url: url, filename: searchedmusic.lastsearched.datatentitle}, {parse_mode: "HTML", duration: dur, thumb: {url: athumb}, performer: searchedmusic.lastsearched.datatenart, title: searchedmusic.lastsearched.datatentitle, reply_markup: {inline_keyboard: [[Markup.button.url('Ссылка на видео в YouTube', alink)]]}})
                let deletewitt = await searchedb.findOne({user_id: ctx.from.id})
                await ctx.tg.deleteMessage(ctx.chat.id, deletewitt.waittext)
                await searchedb.findOneAndUpdate({user_id: ctx.from.id}, {$set: {forwardtochan: audio.message_id}})
                let aoudiotochan = await searchedb.findOne({user_id: ctx.from.id})
                let forwardedtochan = await ctx.tg.forwardMessage(-1001837066864, ctx.chat.id, aoudiotochan.forwardtochan)
                await collection.insertOne(
                    {
                        music_id: forwardedtochan.message_id,
                        music_name: searchedmusic.lastsearched.dataten
                    }
                )
            } else {
                await ctx.answerCbQuery('Отправляю', {show_alert: false})
                await ctx.tg.forwardMessage(ctx.chat.id, -1001837066864, downloaded.music_id)
            }
        } else {
            return await ctx.reply('⚠️ Вы ещё ничего не искали...')
        }
    } catch (e) {
        await ctx.reply('⚠️ Извините, произошла ошибка при установке вашей музыки.\n\n(Музыка может быть не доступна для скачивания)')
        console.log(e);
    }
})
 

bot.launch({dropPendingUpdates: true});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));