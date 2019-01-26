import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Badge } from 'antd';
import { LogoutWarp, ImgWarp, Userpic, LogutText, Notice, UserInfo } from './style';
import history from './../../history';
import Storage from '../../common/js/storage';
import http from './../../common/js/http';
import baseURL from './../../common/js/baseURL';

export default class Logout extends Component {
    state = {
        visible: false,
        userName: ''
    }
    componentWillMount() {
        const state = Storage.get('userinfo');
        this.setState({ userName: state.username });
    }
    updatePassword = () => {
        const state = Storage.get('userinfo');
        history.push('/container/updatePassword', state);
    }
    logout = () => {
        Storage.clear();
        history.push('/login');
    }
    handleVisibleChange = (flag) => {
        this.setState({ visible: flag });
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item key='0'>
                    <div
                        style={{width: '110px', fontSize: '15px'}}
                        onClick={this.updatePassword}   
                    >
                        <i style={{marginRight: '5px', color: 'rgb(135, 208, 104)', fontSize: '15px'}} className='iconfont icon-xiugaimima'></i>
                        修改密码
                    </div>
                </Menu.Item>
                <Menu.Item key='1'>
                    <div
                        style={{width: '110px', fontSize: '15px'}} 
                        onClick={this.logout}
                    >
                        <i style={{marginRight: '5px', color: 'red', fontSize: '15px'}} className='iconfont icon-tuichu'></i>
                        退出登录
                    </div>
                </Menu.Item>
            </Menu>
        );
        return (
            <LogoutWarp>
                <div style={{height: '60px'}}>
                    <UserInfo>
                        {this.state.userName}: 您好欢迎登录
                    </UserInfo>
                    <ImgWarp>
                        <Userpic src={require('./../../static/userLogo.jpg')}></Userpic>
                    </ImgWarp>
                    <Dropdown overlay={menu} placement='bottomCenter' onVisibleChange={this.handleVisibleChange}>
                        <div>
                            <span style={{fontSize: '30px', width: '60px', textAlign: 'center', cursor: 'pointer'}}>
                                <i style={{fontSize: '30px', color: '#fff'}} className='iconfont icon-caozuo'></i>
                            </span>
                        </div>
                    </Dropdown>
                </div>
            </LogoutWarp>
        );
    }
}