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

export const CreateTime = styled.div `
    display: flex;
`;

export const CreateTimeItem = styled.div `
    margin: 0 25px;
    display: flex;
    line-height: 50px;
    span {
        color: skyblue;
        margin-right: 5px;
    }
    div {
        margin: auto 0;
    }
    input {
        margin: auto 0;
    }
`;

export const Search = styled.div `
    line-height: 50px;
    button {
        width: 150px;
    }
`;

export const Operation = styled.div `
    display: flex;
`;

export const Item = styled.span `
    width: 50%;
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
    Select {
        flex: 1;
    }
`;

export const CharacterInfoName = styled.div `
    width: 20%;
    font-weight: 700;
`;