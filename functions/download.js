const ytdl = require('youtube-dl-exec');
const { searchedb, ObjectID } = require('../additions/DB');
require('dotenv').config()

async function download(link) {
    try {
        return new Promise(async (resolve, reject) => {
            await ytdl(link, {
                socketTimeout: 300000,
                dumpSingleJson: true,
                extractAudio: true,
                format: 'm4a',
                audioFormat: 'm4a',
                addHeader: [
                  'referer:youtube.com',
                  'user-agent:googlebot'
                ],
            }).then(output => {
                let url = output.requested_downloads[0].url
                resolve(url)
                // https.get(url, response => {
                //     response.pipe(fs.createWriteStream(`./${mname}.m4a`)).on('finish', () => resolve(console.log(`Finished to download: ${mname}`))).on('error', (err) => reject(err))
                // });
            })  
        }) 
    } catch (e) {
        console.error(e)
    }
}


module.exports = {download}