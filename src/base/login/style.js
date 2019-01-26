import styled from 'styled-components';
import login_icon from '../../static/login_ico.png';

export const LoginWarp = styled.div `
    width: 100%;
    min-height: 100vh;
    position: relative;
    background-image: url(${require('../../static/login.jpg')});
    background-size: cover;
    background-position: center center;
    overflow: hidden;
    z-index: 1;
    .clearfix {
        span {
            .ant-upload-list-picture-card .ant-upload-list-item {
                width: 150px;
                height: 150px;
                .ant-upload-list-item-info > span {
                    height: 100%;
                }
            }
            .ant-upload.ant-upload-select-picture-card {
                span {
                    padding: 0;
                }
            }
        }
    }
`;

export const LoginBox = styled.div `
    width: 400px;
    height: 500px;
    padding: 35px;
    color: #EEE;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -250px;
    box-sizing: border-box;
`;

export const LoginTitle = styled.h3 `
    text-align: center;
    height: 20px;
    font: 20px "microsoft yahei",Helvetica,Tahoma,Arial,"Microsoft jhengHei",sans-serif;
    color: #FFFFFF;
    height: 20px;
    line-height: 20px;
    padding: 0 0 35px 0;
`;

export const LoginInput = styled.div `
    height: 46px;
    padding: 0 5px;
    margin-bottom: 30px;
    border-radius: 50px;
    position: relative;
    border: rgba(255,255,255,0.2) 2px solid !important;
`;

export const InputItem = styled.input `
    width: 220px;
    height: 46px;
    outline: none;
    display: inline-block;
    font: 14px "microsoft yahei",Helvetica,Tahoma,Arial,"Microsoft jhengHei";
    margin-left: 50px;
    border: none;
    background: none;
    line-height: 46px;
    color: #fff;
`;

export const LoginIncon = styled.span `
    &.u_user {
        width: 25px;
        height: 25px;
        background: url(${login_icon});
        background-position: -125px 0;
        position: absolute;
        margin: 10px 13px;
    }
    &.us_uer {
        width: 25px;
        height: 25px;
        background: url(${login_icon});
        background-position: -125px -34px;
        position: absolute;
        margin: 10px 13px;
    }
`;

export const Submit = styled.div `
    margin-bottom: 20px;
    button {
        width: 100%;
        border-radius: 50px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
    }
`;
