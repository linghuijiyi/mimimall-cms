import React, { Component } from 'react';
import { Menu, Icon, Layout, Badge, Popover } from 'antd';
import { MenuCollapsed } from './../menuList/store';
import MenuList from './../menuList';
import { HeaderWarp } from './style';
import { connect } from 'react-redux';

class Header extends Component {
    state = {
        visible: false,
        collapsed: true
    }
    handleToggleClick = () => {
        const { collapsed } = this.state;
        this.setState({ collapsed: !collapsed });
        this.props.dispatch(MenuCollapsed.toggleCollapsed(collapsed));
    }
    handleVisibleChange = () => {
        this.setState({ visible: !this.state.visible })
    }
    render() {
        const { collapsed } = this.state;
        const { isMobile } = this.props;
        return (
            <HeaderWarp>
                {
                    isMobile ? (
                        <Popover content={<MenuList />} trigger="click" visible={this.state.visible} onVisibleChange={this.handleVisibleChange} placement="bottomLeft">
                            <Icon
                                type="bars"
                                style={{color: '#fff', fontSize: '24px', padding: '0 18px', cursor: 'pointer'}}
                            />
                        </Popover>
                    ) : (
                        <Icon
                            style={{color: '#fff', fontSize: '24px', padding: '0 18px', cursor: 'pointer'}}
                            type={!collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.handleToggleClick}
                        />
                    )
                }
            </HeaderWarp>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isMobile: state.getIn(['header', 'isMobile']),
        collapsed: state.getIn(['menuList', 'collapsed'])
    }
}

export default connect(mapStateToProps, null)(Header);