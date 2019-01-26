import styled from 'styled-components';

export const Warp = styled.div `
    padding: 0 15px;
    .ant-list-bordered .ant-list-item {
        padding: 0;
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
    }
    .ant-list-bordered .ant-list-header {
        padding: 0;
        height: 40px;
        line-height: 40px;
    }
    div {
        &.left.ant-list-bordered {
            border-right: none;
        }
        .ant-list-bordered {
            border-radius: 0;
        }
    }
`;