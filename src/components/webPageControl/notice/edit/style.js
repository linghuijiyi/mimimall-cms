import styled from 'styled-components';

export const Warp = styled.div `
    .rdw-editor-wrapper {
        background: #f5f5f5;
        flex: 1;
        min-height: 400px;
        border: 1px solid #d9d9d9;
        .rdw-editor-toolbar {
            background: skyblue;
            border: none;
            border-bottom: 1px solid #d9d9d9;
        }
        .rdw-editor-main {
            height: auto;
        }
    }
`;

export const EditItem = styled.div `
    display: flex;
    height: 32px;
    line-height: 32px;
    margin-bottom: 15px;
    p {
        width: 100px;
        text-align: right;
        margin-right: 3px;
    }
    
`;

export const EditInfo = styled.div `
    display: flex;
    .BraftEditor-container {
        flex: 1;
        border: 1px solid #d9d9d9;
        .BraftEditor-controlBar {
            background: skyblue;
        }
    }
`;

export const EditSubmit = styled.div `
    button {
        width: 300px;
        display: block;
        margin: 30px auto;
    }
`;