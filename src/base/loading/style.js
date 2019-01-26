import styled from 'styled-components';

export const LoadingWarp = styled.div `
    .loading {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        padding:0 40px;
        height: 80px;
        line-height: 80px;
        background: rgba(0, 0, 0, 0.75);
        border-radius: 6px;
        text-align: center;
        z-index: 9999;
        color:#fff;
        img {
            width: 32px;
            vertical-align: middle;
        }
        span {
            margin-left: 12px;
        }
    }
    .overlay{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 9998;
        background: rgb(255, 255, 255);
        opacity: 0.1;
    }
`;