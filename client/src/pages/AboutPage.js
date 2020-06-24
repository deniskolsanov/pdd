import React, {useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/http";
import {AuthContext} from "../context/AuthContext";
import {useMessage} from '../hooks/message'
import Button from "react-bootstrap/Button";


export const AboutPage = () => {
    const message = useMessage();
    const auth = useContext(AuthContext);
    const [n, setN] = useState(null);
    const {loading, request} = useHttp();

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login_random', 'POST');
            auth.login(data.token, data.userId);
        } catch (e) {}
    };

    const clickLogin = (e) => {
        e.preventDefault();
        loginHandler();
    };

    return (
        <>
            <h3 style={{textAlign: 'center'}}>Тренажер для подготовки к теоретическому экзамену ПДД</h3>
            <div style={{margin: 'auto', width: 'fit-content'}}>
                <br/>
                <p>На этом сайте вы можете проверить себя на знание ПДД</p>
                <p>Каждый ваш ответ анализируется системой, для того чтобы наиболее быстро выявить пробелы в знаниях</p>
                <p>Система не собирает персональные данные</p>
                <p>Нажмите кнопку "Начать тест" если вы хотите пройти тестирование и соглашаетесь на использование файлов cookie</p>
                <p>Написать автору в telegram: <a href={"https://teleg.run/operarus"} target={"blanc"}>@operarus</a></p>
            </div>
            <Button variant="primary" size="lg" style={{display: 'block', width : '200px', margin: '40% auto'}} onClick={clickLogin}>
                Пройти тест
            </Button>
            {/*<a className="waves-effect waves-light btn-large" style={{display: 'block', width : '200px', margin: '40% auto'}} onClick={clickLogin}>Пройти тест</a>*/}
        </>
    )
};