import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AllComponents from './components';
import routesConfig from './components/config';
const App = AllComponents.App;
const Login = AllComponents.Login;
const Home = AllComponents.Home;
const Container = AllComponents.Container;
const UpdatePassword = AllComponents.UpdatePassword;
export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <App>
                        <Fragment>
                            <Route path='/login' component={Login} />
                            <Switch>
                                <Route path='/container' render={() =>
                                    <Container>
                                        <Route path='/container/updatePassword' component={UpdatePassword}/>
                                    </Container>
                                } />
                                <Route path='/' render={() =>
                                    <Home>
                                        <Switch>
                                            {
                                                routesConfig.map((item) => {
                                                    const Component = AllComponents[item.component];
                                                    return (
                                                        <Route 
                                                            key={item.key} 
                                                            path={item.key} 
                                                            exact={item.exact} 
                                                            component={props => <Component {...props} />} 
                                                        />
                                                    )
                                                })
                                            }
                                            <Redirect to='/home' />
                                        </Switch>
                                    </Home>
                                } />
                            </Switch>
                        </Fragment>
                    </App>
                </Switch>
            </BrowserRouter>
        );
    }
}