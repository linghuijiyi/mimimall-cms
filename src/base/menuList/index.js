import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { connect } from 'react-redux';
import { MenuCollapsed } from './store';
import history from './../../history';
import Storage from './../../common/js/storage';
import { Logo } from './style.js';
const SubMenu = Menu.SubMenu;
const { Header, Content, Footer, Sider } = Layout;
class MenuList extends Component {
    constructor(props) {
        super(props);
        this.rootSubmenuKeys = [];
        this.state = {
            openKeys: [''],
        }
    }
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys: openKeys});
        } else {
            this.setState({openKeys: latestOpenKey ? [latestOpenKey] : []});
        }
        const { toggleMenu } = this.props;
        this.props.dispatch(MenuCollapsed.toggleMenu(false));
    }
    componentDidMount() {
        let MenuData = Storage.get('userinfo');
        this.renderKey(MenuData.menuList);
        let renderNode = this.renderMenu(MenuData.menuList);
        this.setState({renderNode});
    }
    handleChangeBreadcrumb = (path, list) => {
        history.push(path, [...list.props.openKeys, list.props.eventKey]);
    }
    renderKey = (data) => data.map((item) => (this.rootSubmenuKeys.push(item.text)));
    renderMenu = (data, key) => {
        return data.map((ele) => {
            if (ele.flag !== '1') {
                if (ele.menus && ele.menus.length) {
                    let iconEle = '';
                    if (ele.icon !== undefined) iconEle = <Icon><i className={`iconfont ${ele.icon}`}></i></Icon>;
                    return (
                        <SubMenu key={ele.text} title={<span>{iconEle}<span>{ele.text}</span></span>}>
                            {this.renderMenu(ele.menus)}
                        </SubMenu>
                    )
                }
                return (
                    <Menu.Item  key={ele.text} onClick={({ item }) => {this.handleChangeBreadcrumb(ele.url, item)}}>
                        {ele.text}
                    </Menu.Item>
                )
            }
        });
    }
    render() {
        const { openKeys, renderNode } = this.state;
        const { collapsed, toggleMenu, isMobile } = this.props;
        let MenuData = Storage.get('userinfo');
        return (
            <Sider
                collapsed={isMobile ? false : collapsed}
                width={256}
            >
                <Logo className='logo'>
                    <img src={require('./../../static/logo.png')} />
                    <h1>万&nbsp;&nbsp;鲸&nbsp;&nbsp;游&nbsp;&nbsp;后&nbsp;&nbsp;台</h1>
                </Logo>
                <Menu
                    theme='dark'
                    mode='inline'
                    openKeys={toggleMenu ? null : openKeys}
                    onOpenChange={this.onOpenChange}
                >
                    { renderNode }
                </Menu>
            </Sider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        collapsed: state.getIn(['menuList', 'collapsed']),
        toggleMenu: state.getIn(['menuList', 'toggleMenu']),
        isMobile: state.getIn(['header', 'isMobile']),
    }
}

export default connect(mapStateToProps, null)(MenuList);