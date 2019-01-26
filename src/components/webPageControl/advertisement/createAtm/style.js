import styled from 'styled-components';

export const Warp = styled.div `
    
`;

export const Container = styled.div `
    width: 600px;
    display: flex;
    padding-top: 20px;
`;

export const Left = styled.div `
    width: 15%;
    text-align: right;
    margin-right: 5px;
`;

export const Right = styled.div `
    flex: 1;
`;

export const Item = styled.div `
    height: 32px;
    line-height: 32px;
    margin-bottom: 20px;
`;

export const AtmImg = styled.div `
    span {
        .ant-upload-list-picture-card .ant-upload-list-item {
            .ant-upload-list-item-info > span {
                height: 100%;
            }
        }
        .ant-upload.ant-upload-select-picture-card {
            span {
                padding: 0;
            }
        }
    }
`;

export const Options = styled.div `
    width: 600px;
    text-align: right;
    button {
        margin-left: 30px;
        width: 100px;
    }
`;