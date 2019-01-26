import styled from 'styled-components';

export const Card = styled.div `
    display: flex;
    flex-wrap: wrap;
`;

export const View = styled.div `
    flex: 1;
    min-height: 210px;
    background: rgba(242, 242, 242, 1);
    padding: 8px 0;
`;

export const Item = styled.div `
    display: flex;
    width: 100%;
    min-height: 32px;
    line-height: 32px;
    padding: 8px 0;
    &.treeSelect {
        .ant-select-tree-dropdown {
            top: 98px!important;
            height: 300px;
        }
    }
`;

export const Title = styled.div `
    width: 150px;
    max-width: 150px;
    font-size: 16px;
    font-weight: 700;
    text-align: right;
    margin-right: 10px;
`;

export const Info = styled.div `
    flex: 1;
`;


export const OptionWarp = styled.div `
    margin-top: 50px;
    text-align: center;
    button {
        width: 80px;
        height: 40px;
        line-height: 40px;
        margin: 0 20px;
    }
`;