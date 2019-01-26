import React from 'react';
import { LoadingWarp } from './style';

export default () => {
    return (
        <LoadingWarp>
            <div className='overlay'></div>
            <div className='loading'>
                <img src={require('./../../static/loading.gif')} />
                <span>加载中，请稍后...</span>
            </div>
        </LoadingWarp>
    );
}