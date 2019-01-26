import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';

class InformationTemplate extends Component {
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['系统管理', '短信模板']));
    }
    render() {
        return (
            <div>
               短信模板
            </div>
        );
    }
}

export default connect(null, null)(InformationTemplate);