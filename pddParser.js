
// модуль парсинга билетов ПДД

const parser = require('node-html-parser');
const request = require('request');
const fs = require('fs');

async function getBilet(n) {
    return new Promise(function (resolve, reject) {
        request.get('https://biletpdd.ru/test/ab/bilet' + n + '.htm', function(err, msg, body) {
            const root = parser.parse(body);
            var rawTickets = root.querySelectorAll('.q_container');
            var tickets = [];

            for (var ticket in rawTickets) {
                var rawAnswers = rawTickets[ticket].querySelectorAll('li');
                var answers = [];
                for (var answer in rawAnswers) {
                    var right = (rawAnswers[answer].toString().indexOf('right') !== -1);
                    answers.push((right ? '@' : '') + rawAnswers[answer].innerHTML.slice(2));
                }
                var img = '';
                if (rawTickets[ticket].querySelector('img'))
                    img = rawTickets[ticket].querySelector('img').attributes.src;
                tickets.push({
                    question : rawTickets[ticket].querySelector('.q_text').innerHTML.trim(),
                    answers : answers,
                    hint : rawTickets[ticket].querySelector('.hint_text').innerHTML.trim(),
                    img : img
                })
            }

            resolve(tickets);
        });
    })
}

async function parseAndSave() {
    var tickets = [];
    for (var i = 1; i <= 40; i++) {
        console.log('loading ticket #' + i);
        tickets = tickets.concat(await getBilet(i));
    }

    console.log(tickets);


    fs.writeFile('output.json', JSON.stringify(tickets), function (err) {});
}
parseAndSave();