import React, { Component, Fragment } from 'react'
export default class Container extends Component {
    render() {
        return (
            <Fragment>
                {this.props.children}
            </Fragment>
        );
    }
}