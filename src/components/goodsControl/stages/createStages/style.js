import styled from 'styled-components';

export const CreateStagesContainer = styled.div `
    font-family: '微软雅黑';
    .ant-select-tree-dropdown {
        top: 40px!important;
        height: 500px;
    }
`;

export const CreateItem = styled.div `
    display: flex;
    height: 40px;
    line-height: 40px;
    margin: 10px 0;
    &.textarea {
        min-height: 100px;
    }
    &.qishu {
        padding-left: 105px;
    }
    button {
        margin-top: 4px;
        min-width: 60px;
    }
`;

export const Name = styled.div `
    width: 100px;
    font-size: 16px;
    margin-right: 5px;
    text-align: right;
    font-weight: 700;
    &.repeat {
        width: 170px;
    }
`;

export const InputWarp = styled.div `

`;