import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './../../../base/breadcrumbCustom/store';

class SensitiveTerms extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            num: 1,
            title: 'react study'
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
    }
    componentWillMount() {
        this.props.dispatch(actionCreators.changeBreadcrumb(['系统管理', '敏感词汇']));
    }
    handleClick() {
        this.setState({
            num: this.state.num += 1,
        });
    }
    handleTitle() {
        this.setState({
            title: 'react study add',
        });
    }
    render() {
        console.log('App render 执行中');
        return (
            <div>
                <h2>I am demo, {this.state.title}</h2>
            </div>
        );
    }
}

export default connect(null, null)(SensitiveTerms);