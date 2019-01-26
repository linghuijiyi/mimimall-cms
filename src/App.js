import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import store from './store';
import history from './history';
import './style/style';
import './style/font/iconfont';
import 'zent/css/index.css';
import 'moment/locale/zh-cn';

class App extends Component {
    render() {
        return (
            <LocaleProvider locale={zh_CN}>
                <Provider store={store}>
                    <Router history={history}>
                        { this.props.children  }
                    </Router>
                </Provider>
            </LocaleProvider>
        );
    }
}

export default App;