import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { BreadcrumbCustomWarp } from './style';
import formatDateTime from './../../common/js/formatDateTime';
class breadcrumbCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sysTime: '2018-00-00 00:00:00'
        }
    }
    componentWillMount() {
        this.timer = setInterval(() => {
            let sysTime = formatDateTime(new Date().getTime());
            this.setState({ sysTime });
        }, 1000);
    }
    renderBreadcrume(data) {
        return data.map((item) => (<Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>));
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    render() {
        const { breadcrumb } = this.props;
        return (
            <BreadcrumbCustomWarp>
                <Breadcrumb className='breadcrumb'>
                    <Breadcrumb.Item>
                        <Link style={{color: '#ff5400'}} to={{pathname: '/home'}}>首页</Link>
                    </Breadcrumb.Item>
                    {this.renderBreadcrume(breadcrumb.toJS())}
                </Breadcrumb>
            </BreadcrumbCustomWarp>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        breadcrumb: state.getIn(['breadcrumb', 'breadcrumb'])
    }
}

export default connect(mapStateToProps, null)(breadcrumbCustom);
