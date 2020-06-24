const fs = require('fs');
const {Router} = require('express');
const router = Router();

let bilets = [];
fs.readFile('./output.json', function (_, data) {
    bilets = JSON.parse(data);
});

router.get('/:n', async(req, res) => {
    try {
        const n = parseInt(req.params.n);
        if (n >= 0 && n < bilets.length) {
            res.json(bilets[n]);
        } else {
            res.json({});
        }
    } catch (e) {
        res.json({message: "ERROR: " + e.message})
    }
});


module.exports = router;