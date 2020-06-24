const {Router} = require('express');
const Link = require('../models/Link');
const shortid = require('shortid');
const auth = require('../middleware/auth');
const router = Router();

router.post('/generate', auth, async (req, res) => {
    try {
        const {url} = req.body;

        const code = shortid.generate();

        const existing = await Link.findOne({url});

        if (existing) {
            return res.json({link : existing});
        }
        const link = new Link({
            code, url, owner: req.user.userId
        });

        await link.save();
        res.status(201).json({link});
    } catch (e) {
        res.status(500).json({
            message: 'Error: ' + e.message
        })
    }
});
router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({owner: req.user.userId});
        res.json(links);
    } catch (e) {
        res.status(500).json({
            message: 'Error: ' + e.message
        })
    }
});
router.get('/:id', auth, async (req, res) => {
    try {
        const links = await Link.findById(req.params.id);
        res.json(links);
    } catch (e) {
        res.status(500).json({
            message: 'Error: ' + e.message
        })
    }
});

module.exports = router;