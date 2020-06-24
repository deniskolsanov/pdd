import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http";
import {useMessage} from "../hooks/message";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password: ''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form});
            message(data.message);
        } catch (e) {}
    };

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form});
            message(data.message);
            auth.login(data.token, data.userId);
        } catch (e) {}
    };

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Auth Page</h1>
                <div className="card blue lighten-2">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input placeholder="email" name="email"
                                       id="email" type="text" className="yellow-input"
                                       value={form.email}
                                       onChange={changeHandler}/>
                                <label htmlFor="email">Введите email</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="password" name="password"
                                       id="password" type="password" className="yellow-input"
                                       value={form.password}
                                       onChange={changeHandler}/>
                                <label htmlFor="password">Введите пароль</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn yellow darken-4" style={{marginRight: 10}}
                            onClick={loginHandler}>Войти</button>
                        <button className="btn grey lighten-1 black-text"
                                onClick={registerHandler}
                                disabled={loading}>Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
};