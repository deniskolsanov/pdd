import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom';

import {AuthPage} from "./pages/AuthPage";
import {TestPage} from "./pages/TestPage";
import {AboutPage} from "./pages/AboutPage";



export const useRoutes = (isAuthenticated, props) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/" render={routeProps => <TestPage {...props} {...routeProps}/>} exact/>
                <Route path="/bilet/:id" render={routeProps => <TestPage {...props} {...routeProps}/>}/>
                <Redirect to="/" />
            </Switch>
        )
    } else {
        return (
            <Switch>
                <Route path="/" exact>
                    <AboutPage/>
                </Route>
                <Redirect to="/"/>
            </Switch>
        )
    }
};