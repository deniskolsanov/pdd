import React, {useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http";
import {Answer} from "../components/Answer";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from '../hooks/message'
import {Progress} from "../components/Progress";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

/*
Страница прохождения теста
 */

export const TestPage = (props) => {
    const message = useMessage();
    const auth = useContext(AuthContext);
    const [n, setN] = useState(null);
    const {loading, request} = useHttp();
    const [question, setQuestion] = useState(null);
    const [answered, setAnswered] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [start, setStart] = useState(27);
    const [stop, setStop] = useState(89);

    const fetchBilet = async () => {
        try {
            const fetched = await request(`/api/bilet/${n}`, 'GET');

            console.log(fetched);
            fetched.hint = fetched.hint.split('<a ').map(
                (val) => val.slice(val.indexOf('>') + 1).replace('</a>', '')
            ).join('');

            props.history.push('/bilet/' + n);
            setQuestion(fetched);
        } catch (e) {}
    };

    const testHandler = async () => {
        try {

        } catch (e) {}
    };

    useEffect(() => {(n !== null) && fetchBilet()}, [n]);

    const clickAnswer = async (e) => {
        e.preventDefault();
        if (answered === null) {
            try {
                const newAnswered = parseInt(e.target.getAttribute('index'));
                setAnswered(newAnswered);
                const answer = await request(`/api/answer/${n}&${newAnswered}`, 'GET', null, {
                    Authorization: 'Bearer ' + auth.token
                });
                message(answer.message);
            } catch (e) {
                message(e.message);
                if (e.message.indexOf('invalid') !== -1) {
                    auth.logout();
                }
            }
        }
    };

    const loadN = async() => {
        try {
            const fetched = await request(`/api/nextBilet`, 'GET', null, {
                Authorization: 'Bearer ' + auth.token
            });
            console.log(fetched);
            message(fetched.message);

            if (fetched.message === 'user doesnt exists') {
                auth.logout();
                return;
            }

            setQuestions(fetched.probs.slice(0, 10));
            setN(fetched.n);
            setStart(Math.max(fetched.mScore - fetched.interval / 2, 0) * 100);
            setStop(Math.min(fetched.mScore + fetched.interval / 2, 1) * 100);
        } catch (e) {
            console.log(e.message);
            message(e.message);
            if (e.message.indexOf('expired') !== -1) {
                auth.logout();
            }
        }
    };

    /*const deleteAll = async() => {
        try {
            const fetched = await request(`/api/answer/delete`, 'GET');
            message(fetched.message);
        } catch (e) {
            console.log(e.message);
            message(e.message);
            if (e.message.indexOf('expired') !== -1) {
                auth.logout();
            }
        }
    };*/

    const clickNext = async(e) => {
        e.preventDefault();
        setAnswered(null);
        await loadN();
    };

    useEffect(() => {
        if (n === null) {
            /*if (props.location.pathname.indexOf('/bilet/') !== -1) {
                setN(props.location.pathname.split('/bilet/')[1]);

                let questions = [];
                for (let i = 0; i < 10; i++)
                    questions.push([0, i]);
                setQuestions(questions);
            } else {
                loadN();
            }*/
            loadN();
        }
    }, [n]);

    const niceColor = (val) => {
        return `rgb(${val * 255}, ${200 - Math.abs(val * 255 - 128) / 2}, 128)`;
    };


    return (
        <>
            {question && question.question &&
            <div className="col s6 offset-s3" style={{marginTop: "5%"}}>
                <div style={{width: 'fit-content', marginBottom: '1rem', marginLeft: 'auto', marginRight: '0'}}>
                    <ButtonToolbar aria-label="Toolbar with button groups">
                        <ButtonGroup className="mr-2" aria-label="First group">
                            {/*<Button onClick={deleteAll}>Удалить данные</Button>*/} <Button onClick={auth.logout}>Удалить данные о прохождении</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                    {/*{
                        questions.map((pair) => <a className="waves-effect waves-light btn" key={pair[1]}
                                                   style={{margin: '0.5rem', backgroundColor: niceColor(pair[0])}}
                                                   onClick={() => {setN(pair[1]); fetchBilet()}}>{pair[1]}</a>)
                    }*/}
                </div>
                <Progress start={start} stop={stop}/>
                <h5 style={{textAlign: 'center'}}>{question.question}</h5>
                {question.img.length && <img src={`https://biletpdd.ru${question.img}`} alt="img"
                                             style={{display: 'block', maxWidth: '100%', margin: '0 auto', transition: '1s'}}/> || ''}
                <ul>
                    {question.answers.map((answer, i) => {
                        return <Answer key={i} answer={answer} index={i} answered={answered}
                                       clickAnswer={clickAnswer}/>
                    })}
                </ul>
                {(answered !== null) && <p style={{textAlign: 'center'}}>{question.hint}</p>}
                {answered !== null && <Button variant="primary" size="lg" style={{display: 'block', width: 'fit-content', margin: '0 auto', marginTop: '2rem', marginBottom: '5rem'}} onClick={clickNext}>Далее ></Button>}
            </div>
            || <h1>Loading...</h1>}
        </>
    )
};