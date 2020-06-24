const {Router} = require('express');
const Link = require('../models/Link');
const router = Router();

router.get('/:code', async (req, res) => {
    try {
        const link = await Link.findOne({code: req.params.code});

        console.log(link);
        if (link) {
            link.clicks++;
            await link.save();

            return res.redirect(link.url);
        } else {
            res.status(404).json('Link doesnt exists');
        }
    } catch (e) {
        res.status(500).json({
            message: 'Error: ' + e.message
        })
    }
});

module.exports = router;
