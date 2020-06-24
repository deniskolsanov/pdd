import React from 'react';

/*
Компонент варианта ответа
 */

export const Answer = ({answer, index, answered, clickAnswer}) => {
    const isRight = answer.indexOf('@') !== -1;
    const color =
        (answered === null) && '#fff' ||
        (answered === index && isRight) && '#66ff66' ||
        (answered === index && !isRight) && '#bbbbbb' ||
        (answered !== index && isRight) && '#ff6666' ||
        '#fff';
    return (
        <li className="answer" key={index} index={index} onClick={clickAnswer}
            style={{
               borderRadius: '0.5rem', border: '1px solid #000', padding: '0.8rem', margin: '0.5rem auto', width: '100%'/*, minWidth: 'fit-content'*/, maxWidth: '600px',
               cursor: (answered === null) && 'pointer' || 'default', background: color, transition: '0.2s linear'
            }}>{`${index}) ${answer.replace('@ ', '')}`}</li>
    );
};