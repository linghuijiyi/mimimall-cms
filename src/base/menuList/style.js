import styled from 'styled-components';

export const Logo = styled.div `
    height: 60px;
    position: relative;
    line-height: 60px;
    padding-left: 24px;
    transition: all .3s;
    background: #002140;
    overflow: hidden;
    img {
        display: inline-block;
        vertical-align: middle;
        height: 32px;
        border-radius: 50%;
    }
    h1 {
        color: #fff;
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        margin: 0 0 0 12px;
        font-family: Avenir,Helvetica Neue,Arial,Helvetica,sans-serif;
        font-weight: 600;
    }
`;