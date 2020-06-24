const auth = require('../middleware/auth');
const {Router} = require('express');
const User = require('../models/User');

const router = Router();

router.get('/:n&:m', auth, async function (req, res) {
    try {
        const n = parseInt(req.params.n);
        const m = parseInt(req.params.m);

        if (n < 0 || n >= 1000 || m < 0 || m > 10) {
            return res.status(401).json({message: `WRONG DATA n=${n} m=${m}`});
        }

        User.findOneAndUpdate(
            {_id : req.user.userId},
            {$push: {test: {ts: Date.now(), n: n, answer: m}}},
            (e, success) => {
                if (e) {
                    res.status(401).json({message: 'SERVER ERROR: ' + e.message});
                } else {
                    res.json({message: 'Ответ сохранён'});
                }
            }
        );
    } catch (e) {
        res.status(401).json({message: 'SERVER ERROR: ' + e.message});
    }
});

router.get('/delete', async function (req, res) {
    try {
        await User.remove({});
        res.json({message: 'Все данные удалены'});
    } catch (e) {
        res.status(401).json({message: 'SERVER ERROR: ' + e.message});
    }
});

// http://localhost:8888/api/answer/backup
router.get('/backup', async function (req, res) {
    try {
        res.json(await User.find({}));
    } catch (e) {
        res.status(401).json({message: 'SERVER ERROR: ' + e.message});
    }
});

module.exports = router;
