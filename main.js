const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config');


const app = express();

app.use(express.json({extended: true}));
/*app.use(morgan('combined'));
app.use(cors());*/


app.use('/api/auth', require('./routes/auth'));
app.use('/api/bilet', require('./routes/bilet'));
app.use('/api/answer', require('./routes/answer'));
app.use('/api/nextBilet', require('./routes/nextBilet'));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

app.get('/t', async (req, res) => {
    res.json({'qwe': 'qwe'});
});

app.listen(process.env.PORT || config.port,
    () => console.log('Server started on port: ' + (process.env.PORT || config.port)));


async function start() {
    try {

        await mongoose.connect(config.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    } catch (e) {
        console.log('[[SERVER ERROR]]', e.message);
        process.exit(1);
    }
}
start();