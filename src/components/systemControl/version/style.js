import styled from 'styled-components';

export const Warp = styled.div `
    .tableListForm {
        .ant-form-item {
        margin-bottom: 24px;
        margin-right: 0;
        display: flex;
            > .ant-form-item-label {
                width: auto;
                min-width: 95px;
                line-height: 32px;
                padding-right: 8px;
            }
            .ant-form-item-control {
                line-height: 32px;
            }
        }
        .ant-form-item-control-wrapper {
            flex: 1;
        }
    }
    @media screen and (max-width: @screen-lg) {
        .tableListForm .ant-form-item {
            margin-right: 24px;
        }
    }
    @media screen and (max-width: @screen-md) {
        .tableListForm .ant-form-item {
            margin-right: 8px;
        }
    }
`;

export const  OperationWarp = styled.div `
    margin-top: 25px;
    margin-bottom: 25px;
    display: flex;
    button {
        margin-right: 20px;
        min-width: 150px;
        height: 40px;
    }
`;