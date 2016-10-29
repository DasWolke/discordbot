var path = require("path");
var createPic = ((info, cb) => {
    try {
        let gd = require('node-gd');
        let f = path.join(__dirname, '../fonts/RegencieLight.ttf');
        let c = {
            black: 0x000000, white: 0xffffff, red: 0xff0000, green: 0x00ff00,
            blue: 0x0000ff, gray: 0xc6c6c6, dgray: 0x555555, lgray: 0xdcdcdc
        };
        console.log(path.join(__dirname, './assets/template.png'));
        let t = gd.createFromPng(path.join(__dirname, './assets/template.png'));
        let a = gd.createFromJpeg(path.join(__dirname, './assets/hide.jpg'));
        a.copyResampled(t, 21, 22, 0, 0, 76, 76, a.width, a.height).destroy();
// Name
        t.stringFT(c.dgray, f, 14, 0, 122, 33, info.user.username);
// EXP
        let cexp = info.xp;
        let tnexp = info.needed;
        let exp = Math.floor(cexp / tnexp * 159) + 126;
        t.filledRectangle(126, 43, exp, 55, c.gray);
        t.stringFT(c.dgray, f, 8, 0, 189, 54, `${cexp}/${tnexp}`);

// Level
        let lv = info.level.toString();
        t.stringFT(c.dgray, f, 14, 0, 130, 80, `LEVEL`);
        t.stringFT(c.dgray, f, 14, 0, 155 - (lv.length * lv.length), 100, `${lv}`);

// Rank
        let rn = info.totalXp.toString();
        t.stringFT(c.dgray, f, 14, 0, 230, 80, `RANK`);
        t.stringFT(c.dgray, f, 14, 0, 252 - (rn.length * rn.length), 100, `${rn}`);
        t.savePng(path.join(__dirname, '../temp/output.png'), 0, function (err) {
            if (err) return cb(err);
            cb(null, '../temp/output.png');
        });
        t.destroy()
    } catch (e) {
        console.log(e);
    }
});
module.exports = createPic;
