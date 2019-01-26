import styled from 'styled-components';

export const Warp = styled.div `
    padding: 0 15px;
    input,select,option,textarea{
        outline: none;
    }
    p{
        margin-bottom:0;
    }
    .red {
        color: red;
    }
    table{
        background:#fff;
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

`;
export const CreateTimeItem = styled.div `
    margin: 0 25px;
    height: 50px;
    line-height: 50px;
    &.crux {
        input {

        }
    }
    label{
        margin:0 8px;
    }
    .span_title{
        display:inline-block;
        width:105px;
        text-align:right;
        margin-right: 8px;
        color: skyblue;
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
    flex: 1;
    i {
        font-size: 20px;
    }
    &.edit {
        color: #009900;
    }
    &.jurisdiction {
        color: #049BCD;
    }
    &.elete {
        color: #AE0D1C;
    }
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
