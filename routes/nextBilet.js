const fs = require('fs');
const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

let bilets = [];
fs.readFile('./output.json', function (_, data) {
    bilets = JSON.parse(data);
});

let data = [];
let Ak = [];
let CjAk = [];
let CjnAk = [];
let CjeAk = [];

let CnAk = [];
let CnnAk = [];
let CneAk = [];
fs.readFile('./data.csv', function (_, data2) {
    data = data2.toString().split('\n');
    data.shift();
    data.pop();
    data = data.map((a) => {
        const temp = a.split(',');
        temp.shift();
        return temp.map((val) => ~~val);
    });
    for (let i = 0; i < 800; i++) {
        const _Ak = data.reduce((acc, val) =>
            (val[i] !== 0) && [acc[0] + (val[i] + 1) / 2, acc[1] + 1] || acc, [0.0005, 0.001]);
        Ak.push(_Ak[0] / _Ak[1]);

        const _CjAk = data.reduce((acc, val) => {
            if (val[i] === 1) {
                const userMean = val.reduce((acc, val) =>
                    (val !== 0) && [acc[0] + (val + 1) / 2, acc[1] + 1] || acc, [0.0005, 0.001]);
                return [acc[0] + userMean[0] / userMean[1], acc[1] + 1];
            } else {
                return acc;
            }
        }, [0.0005, 0.001]);
        CjAk.push(_CjAk[0] / _CjAk[1]);

        const _CjnAk = data.reduce((acc, val) => {
            if (val[i] === -1) {
                const userMean = val.reduce((acc, val) =>
                    (val !== 0) && [acc[0] + (val + 1) / 2, acc[1] + 1] || acc, [0.0005, 0.001]);
                return [acc[0] + userMean[0] / userMean[1], acc[1] + 1];
            } else {
                return acc;
            }
        }, [0.0005, 0.001]);
        CjnAk.push(_CjnAk[0] / _CjnAk[1]);

        const _CjeAk = data.reduce((acc, val) => {
            if (val[i] === 0) {
                const userMean = val.reduce((acc, val) =>
                    (val !== 0) && [acc[0] + (val + 1) / 2, acc[1] + 1] || acc, [0.0005, 0.001]);
                return [acc[0] + userMean[0] / userMean[1], acc[1] + 1];
            } else {
                return acc;
            }
        }, [0.0005, 0.001]);
        CjeAk.push(_CjeAk[0] / _CjeAk[1]);

        let _CnAk = [];
        for (let j = 0; j < 800; j++) {
            _CnAk.push(data.reduce((acc, val) =>
                (val[j] === 1 && val[i] !== 0) && [acc[0] + (val[i] + 1) / 2, acc[1] + 1] || acc, [0.0005, 0.001]));
        }
        CnAk.push(_CnAk.map((val) => val[0] / val[1]));

        let _CnnAk = [];
        for (let j = 0; j < 800; j++) {
            _CnnAk.push(data.reduce((acc, val) =>
                (val[j] === -1 && val[i] !== 0) && [acc[0] + (val[i] + 1) / 2, acc[1] + 1] || acc, [0.0005, 0.001]));
        }
        CnnAk.push(_CnnAk.map((val) => val[0] / val[1]));

        let _CneAk = [];
        for (let j = 0; j < 800; j++) {
            _CneAk.push(data.reduce((acc, val) =>
                (val[j] === 0 && val[i] !== 0) && [acc[0] + (val[i] + 1) / 2, acc[1] + 1] || acc, [0.0005, 0.001]));
        }
        CneAk.push(_CneAk.map((val) => val[0] / val[1]));
    }
    //console.log(CnAk)
    // for (let i = 0; i < 800; i++) {
    //      console.log(Ak[i])
    // }
});


const getRightsFromUser = (user) => {
    const isRight = {};

    for (let answer of user.test) {
        isRight[answer.n] = (bilets[parseInt(answer.n)].answers[answer.answer].indexOf('@') !== -1);
    }

    return isRight;
};

const getFalsesFromUser = (user) => {
    const isRight = {};

    for (let answer of user.test) {
        isRight[answer.n] = (bilets[parseInt(answer.n)].answers[answer.answer].indexOf('@') === -1);
    }

    return isRight;
};

router.get('/', auth, async(req, res) => {
    try {
        const user = await User.findOne({_id: req.user.userId});

        if (!user) {
            return res.json({message: 'user doesnt exists'});
        }

        //const users = await User.find({});

        const isRight = getRightsFromUser(user);
        const isFalse = getFalsesFromUser(user);


        let probs = [];
        for (let i = 0; i < 800; i++) {
            let prob = Ak[i] / Math.max(1 - Ak[i], 0.001);
            for (let j = 0; j < 800; j++) {
                prob *= CjAk[j] * 0.1 / CjnAk[j];
            }
            probs.push([prob, i]);
        }
        for (let answer of user.test) {
            console.log(answer.n);
            probs[answer.n][0] = 1e200;

        }

        const k = Math.min(user.test.length / 10, 0.5);
        let mScore = 0;
        for (let i = 0; i < 800; i++) {
            if (isRight[i]) {
                mScore += k / user.test.length;
            } else if (!isFalse[i]) {
                for (let j = 0; j < 800; j++) {
                    if (isRight[j])
                        mScore += CnAk[i][j] * (1-k) / 800 / (800 - user.test.length);
                    else if (isFalse[j])
                        mScore += CnnAk[i][j] * (1-k) / 800 / (800 - user.test.length);
                    else
                        mScore += CneAk[i][j] * (1-k) / 800 / (800 - user.test.length);
                }
            }
        }

        let interval = Math.pow(-Math.log10(user.test.length / 890 + 0.1), 5);

        probs.sort((a, b) => a[0] - b[0]);
        console.log(probs);
        console.log('mScore: ' + mScore);
        console.log('interval: ' + interval);

        return res.json({n: probs[0][1], probs: probs, mScore: mScore, interval: interval, message: 'ok'});
    } catch (e) {
        console.log(e.message);
        res.json({message: "ERROR: " + e.message})
    }
});


module.exports = router;