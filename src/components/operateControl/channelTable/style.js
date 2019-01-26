import styled from 'styled-components';

export const Warp = styled.div `
    padding: 0 15px;
`;

export const QueryListWarp = styled.div `
    margin-bottom: 20px;
    padding: 15px 0;
    margin-left:  -15px;
    margin-right: -15px;
    border-bottom: 1px solid #CCCCCC;
`;

export const QueryItem = styled.div `
    margin: 0 25px;
    height: 50px;
    line-height: 50px;
    display: flex;
    .name {
        display: inline-block;
        color: skyblue;
        width: 60px;
        text-align: right;
        margin-right: 5px;
    }
    
`;

export const Search = styled.div `
    width: 300px;
    margin: 0 55px;
    button {
        width: 100%;
        height: 35px;
    }
`;

export const List = styled.div `
    min-height: 500px;
    margin-bottom: 48px;
    .ant-collapse > .ant-collapse-item > .ant-collapse-header {
        color: #fff;
        text-align: center;
        background: #1890ff;
    }
    .ant-collapse {
        .ant-collapse-content-box {
            padding: 0;
        }
    }
`;