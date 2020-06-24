import React from 'react';
import ProgressBar from "react-bootstrap/ProgressBar";

/*
Компонент варианта ответа
 */

export const Progress = ({start, stop}) => {
    const average = Math.floor((start + stop) / 2);
    const size = Math.floor((stop - start) / 2);
    return (
        <>
            <ProgressBar style={{marginBottom: '2rem'}}>
                <ProgressBar striped now={start} key={1} />
                <ProgressBar striped variant="success" now={stop - start} key={2} label={`${average}±${size}%`}/>
                <ProgressBar striped now={100 - stop} key={3} />
            </ProgressBar>
        </>
    );
};