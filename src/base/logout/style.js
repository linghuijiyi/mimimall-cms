import styled from 'styled-components';

export const LogoutWarp = styled.div `
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    div {
        display: flex;
        float: right;
    }
`;

export const ImgWarp = styled.div `
    box-sizing: border-box;
    height: 60px;
    padding-top: 12px;
`;

export const Userpic = styled.img `
    width: 36px;
    height: 36px;
    border-radius: 50%;
`;

export const Notice = styled.div `
    width: 60px;
    height: 60px;
    padding-top: 15px;
    cursor: pointer;
    .ant-badge {
        margin: 0 auto;
    }
`;

export const UserInfo = styled.div `
    color: #fff;
    margin-right: 5px;
`;