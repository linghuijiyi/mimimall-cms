import styled from 'styled-components';

export const Warp = styled.div `
    padding: 0 15px;
    .red {
        color: red;
    }
`;

export const QueryListWarp = styled.div `
    margin-bottom: 20px;
    padding: 15px 0;
    margin-left:  -15px;
    margin-right: -15px;
    border-bottom: 1px solid #CCCCCC;
`;


export const CreateTimeItem = styled.div `
    margin: 0 25px;
    height: 50px;
    line-height: 50px;
    display: flex;
    span {
        display: inline-block;
        width: 60px;
        text-align: right;
        color: skyblue;
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


export const Operation = styled.div `
    display: flex;
`;

export const Item = styled.span `
    width: 108px;
    padding: 0 3px;
    height: 35px;
    line-height: 35px;
    button {
        width: 100%;
        height: 100%;
        font-size: 14px;
        &.close {
            background: red;
            border: red;
        }
        &.see {
            background: rgb(135, 208, 104);
            border: rgb(135, 208, 104);
        }
        &.pushMsm {
            background: rgb(255, 85, 0);
            border: rgb(255, 85, 0);
        }
    }
    i {
        font-size: 16px;
        margin-right: 3px;
    }
`;

export const SendWarp = styled.div `

`;

export const SendPlatform = styled.div `
    display: flex;
    height: 30px;
    line-height: 30px;
    span {
        width: 60px;
        text-align: right;
        display: block;
        margin-right: 5px;
    }
`;

export const SendInfo = styled.div `
    display: flex;
    min-height: 100px;
    padding: 10px 0;
    span {
        width: 60px;
        text-align: right;
        display: block;
        margin: auto;
        margin-right: 5px;
    }
`;

export const SendType = styled.div `
    display: flex;
    p {
        width: 60px;
        text-align: right;
        display: block;
        margin-right: 5px;
    }
`;

export const PushWrap = styled.div `
    display: flex;
    min-height: 100px;
    span {
        width: 60px;
        text-align: right;
        display: block;
        margin: auto;
        margin-right: 5px;
    }
`;

export const CreateItem = styled.div `
    display: flex;
    margin: 10px 0;
    min-height: 40px;
    p {
        width: 60px;
        text-align: right;
        display: block;
        margin: auto;
        margin-right: 5px;
    }
    span {
        flex: 1;
        margin: auto;
        .ant-upload-list {
            display: inline-block;
            .ant-upload-list-item {
                margin-top: 0;
            }
        }
    }
`;