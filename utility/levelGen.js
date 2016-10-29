var path = require("path");
var createPic = ((cb) => {
    try {
        console.log('owo');
        let gd = require('node-gd');
        let f = '../fonts/RegencieLight.ttf';
        let c = {
            black: 0x000000, white: 0xffffff, red: 0xff0000, green: 0x00ff00,
            blue: 0x0000ff, gray: 0xc6c6c6, dgray: 0x555555, lgray: 0xdcdcdc
        };
        console.log('OwO');
        console.log(path.join(__dirname, './assets/template.png'));
        let t = gd.createFromPng(path.join(__dirname, './assets/template.png'));
        console.log('hide');
        let a = gd.createFromJpeg(path.join(__dirname, './assets/hide.jpg'));
        console.log('uwu!');
        a.copyResampled(t, 21, 22, 0, 0, 76, 76, a.width, a.height).destroy();
// Name
        t.stringFT(c.dgray, f, 14, 0, 122, 33, '[Hidekazu]');
// EXP
        let cexp = 1000;
        let tnexp = 1695;
        let exp = Math.floor(cexp / tnexp * 159) + 126;
        t.filledRectangle(126, 43, exp, 55, c.gray);
        t.stringFT(c.dgray, f, 8, 0, 189, 54, `${cexp}/${tnexp}`);

// Level
        let lv = '10'
        t.stringFT(c.dgray, f, 14, 0, 130, 80, `LEVEL`);
        t.stringFT(c.dgray, f, 14, 0, 155 - (lv.length * lv.length), 100, `${lv}`);

// Rank
        let rn = '1';
        t.stringFT(c.dgray, f, 14, 0, 230, 80, `RANK`);
        t.stringFT(c.dgray, f, 14, 0, 252 - (rn.length * rn.length), 100, `${rn}`);
        console.log('saved file');
        t.savePng('../temp/output.png', 0, function (err) {
            console.log('cb called!');
            if (err) return cb(err);
            cb(null, '../temp/output.png');
        });
        t.destroy()
    } catch (e) {
        console.log(e);
    }
});
module.exports = createPic;
