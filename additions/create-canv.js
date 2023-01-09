const { registerFont ,createCanvas, loadImage, Image } = require('canvas')
registerFont('./font/durik.ttf', { family: 'durik' })

function createsearch(title) {
        let text = title.toUpperCase();
        const canvas = createCanvas(1000, 300)
        let ctx = canvas.getContext('2d');
        ctx.font = "44px durik";
        ctx.rect(0, 0, 1000, 300);
        ctx.fillStyle = '#252525';
        ctx.tex
        ctx.fill();
        ctx.fillStyle = 'White';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 500, 150)
        return canvas
}

module.exports = {createsearch}