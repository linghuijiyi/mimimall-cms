import React, { Component, Fragment } from 'react';
import { Layout, Menu, Icon, Spin, Popover, Drawer } from 'antd';
import { connect } from 'react-redux';
import { HeaderIsMobile } from './../header/store';
import { MenuCollapsed } from './../menuList/store'
import Headers from '../../base/header';
import { Redirect } from 'react-router-dom';
import Storage from './../../common/js/storage';
import BreadcrumbCustom from './../breadcrumbCustom';
import Loading from './../loading';
import MenuList from './../menuList';
import Logout from './../logout';
import { AntdComponents } from './style.js';
const { Header, Sider, Content } = Layout;
class Home extends Component {
    state = {
        visible: false,
        collapsed: true,
        drawerVisible: false,
        drawerSetting: false
    }
    componentWillMount() {
        this.getClientWidth();
        window.onresize = () => {
            this.getClientWidth();
        }
    }
    handleToggleClick = () => {
        const { collapsed } = this.state;
        const { toggleMenu } = this.props;
        this.setState({ collapsed: !collapsed });
        this.props.dispatch(MenuCollapsed.toggleCollapsed(collapsed));
        this.props.dispatch(MenuCollapsed.toggleMenu(!toggleMenu));
    }
    handleVisibleChange = () => {
        this.setState({ visible: !this.state.visible });
    }
    getClientWidth = () => {
        this.setState({ visible: false });
        const clientWidth = window.innerWidth;
        this.props.dispatch(HeaderIsMobile.changeMenuList(clientWidth <= 992));
    }
    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    }
    onSettingClose = () => {
        this.setState({
            drawerSetting: false,
        });
    }
    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    }
    showSettingDrawer = () => {
        this.setState({
            drawerSetting: true,
        });
    }
    authLogin() {
        const userinfo = Storage.get('userinfo');
        const { loading, isMobile, collapsed } = this.props;
        let right = '17px';
        if (isMobile) {
            right = '0px';
        } else {
            right = '17px';
        }
        const headerStyle = {
            padding: '0',
            height: 60,
            position: 'fixed',
            top: 0,
            zIndex: 111,
            width: '100%'
        }
        if (userinfo === undefined) {
            return <Redirect to='/login' />;
        } else {
            return (
                <Fragment>
                    { loading ? <Loading /> : null }
                    <Layout style={{ background: '#fff' }}>
                        { !isMobile && <MenuList /> }
                        <Layout style={{height: '100vh', flexDirection: 'column'}}>
                            <div style={{position:'relative', transform: 'translate(0,0)'}}>
                                <Header className="custom-theme header" style={headerStyle}>
                                    {
                                        isMobile ? (
                                            <Icon
                                                type="bars"
                                                onClick={this.showDrawer}
                                                style={{color: '#fff', fontSize: '24px', padding: '0 18px', cursor: 'pointer'}}
                                            />
                                        ) : (
                                            <Icon
                                                style={{color: '#fff', fontSize: '24px', padding: '0 18px', cursor: 'pointer'}}
                                                type={!collapsed ? 'menu-unfold' : 'menu-fold'}
                                                onClick={this.handleToggleClick}
                                            />
                                        )
                                    }
                                    <div style={{float: 'right', color: '#fff'}}>
                                        <Logout />
                                    </div>
                                </Header>
                            </div>
                            <Content style={{ background: '#fff', paddingTop: 60 }}>
                                <BreadcrumbCustom />
                                {this.props.children}
                            </Content>
                        </Layout>
                        <Drawer
                            placement='left'
                            closable={false}
                            style={{background: '#001529', height: '100%'}}
                            visible={this.state.drawerVisible}
                            onClose={this.onClose}
                        >
                            <MenuList />
                        </Drawer>
                        <Drawer
                            placement='right'
                            closable={true}
                            style={{marginTop: '60px'}}
                            visible={this.state.drawerSetting}
                            onClose={this.onSettingClose}
                        >
                            
                        </Drawer>
                    </Layout>
                </Fragment>
            );
        }
    }
    render() {
        return this.authLogin();
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.getIn(['home', 'loading']),
        isMobile: state.getIn(['header', 'isMobile']),
        collapsed: state.getIn(['menuList', 'collapsed']),
        toggleMenu: state.getIn(['menuList', 'toggleMenu']),
    }
}

export default connect(mapStateToProps, null)(Home);

/*
    
*/