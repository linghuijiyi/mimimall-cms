import styled from 'styled-components';

export const Wrap = styled.div `
    padding: 0 15px;
`;

export const QueryBox = styled.div `
    padding: 15px;
    margin: 0 -15px 20px -15px;
    border-bottom: 1px solid #CCCCCC;
`;

export const CreateItem = styled.div `
    display:flex;
    justify-content:flex-start;
    line-height: 40px;
`;


export const QueryItem = styled.div `
    height: 40px;
    line-height: 40px;
    margin-right:20px;
    margin-bottom: 10px;
    .btn {
        width: 300px;
        height: 40px;
        margin-left:20px;
    }
`;

export const QyeryTitle = styled.h3 `
    width:110px;
    text-align: right;
    font-weight: normal;
    color: skyblue;
    margin-right: 12px;
    float:left;
`;

export const QueryButton = styled.div `
    width: 100%;
    height: 45px;
    margin-bottom: 25px;
`;

export const  OperationWarp = styled.div `
    margin-top: 25px;
    margin-bottom: 25px;
    button {
        margin-right: 20px;
        width: 150px;
        height: 40px;
    }
`;
export const Options = styled.div `
    button {
        margin: 0 10px;
    }
`;
