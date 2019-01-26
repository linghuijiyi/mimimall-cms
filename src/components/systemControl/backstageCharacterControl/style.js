import styled from 'styled-components';

export const Warp = styled.div `
    margin-top: 15px;
    .red {
        color: red;
    }
    .ant-advanced-search-form {
        background: #fff;
    }
    .ant-advanced-search-form .ant-form-item {
        display: flex;
        label {
            font-size: 16px;
        }
    }
    .ant-advanced-search-form .ant-form-item-control-wrapper {
        flex: 1;
    }
`;

export const QueryListWarp = styled.div `
    padding: 15px 0;
    margin-bottom: 20px;
    margin-left:  -15px;
    margin-right: -15px;
    border-bottom: 1px solid #CCCCCC;
`;

export const CreateTime = styled.div `
    
`;

export const CreateTimeItem = styled.div `
    margin: 0 25px;
    height: 50px;
    line-height: 50px;
    span {
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
    margin: 0 5px;    
`;

export const CharacterName = styled.div `
    display: flex;
    height: 30px;
    line-height: 30px;
    input {
        flex: 1;
    }
`;

export const Name = styled.div `
    width: 20%;
    font-weight: 700;
`;

export const CharacterInfo = styled.div `
    margin: 20px 0;
    display: flex;
    textArea {
        flex: 1;
    }
`;

export const CharacterInfoName = styled.div `
    width: 20%;
    font-weight: 700;
`;

export const HaveJurisdiction = styled.div `
    display: flex;
`;

export const Text = styled.div `
    font-weight: 700;
    margin-right: 20px;
`;