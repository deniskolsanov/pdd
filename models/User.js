const {Schema, model, Types} = require('mongoose');


const schema = new Schema({
    email: {type: String},
    password: {type: String},
    links : [{type: Types.ObjectId, ref: 'Link'}],
    test: [{
        ts: {type: Date}, // answer timestamp
        n: {type: Number}, // question index
        answer: {type: Number} // answer index
    }]
});

module.exports = model('User', schema);
