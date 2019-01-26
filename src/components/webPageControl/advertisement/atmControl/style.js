import styled from 'styled-components';

export const Warp = styled.div `
    padding: 0 15px;
`;

export const QueryBox = styled.div `
    padding: 15px 0 0 15px;
    margin-left:  -15px;
    margin-right: -15px;
    border-bottom: 1px solid #CCCCCC;
`;

export const Container = styled.div `
    width: 600px;
    display: flex;
`;

export const Left = styled.div `
    width: 15%;
    text-align: right;
    margin-right: 5px;
`;

export const Right = styled.div `
    flex: 1;
`;

export const QueryItem = styled.div `
    height: 32px;
    line-height: 32px;
    margin-bottom: 20px;
`;

export const QueryButton = styled.div `
    width: 600px;
    button {
        width: 200px;
        display: block;
        margin: 0 auto;
        margin-bottom: 20px;
    }
`;

export const CreatePoster = styled.div `
    display: flex;
`;

export const CreateLeft = styled.div `
    width: 15%;
    text-align: right;
`;

export const CreateRight = styled.div `
    flex: 1;
`;

export const CreateItem = styled.div `
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
`;


export const CreateImg = styled.div `
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

export const ReadPoster = styled.div `
    display: flex;
    .readImg {
        span {
            .ant-upload-list-picture-card .ant-upload-list-item {
                span {
                    .anticon.anticon-delete {
                        display: none;
                    }
                }
            }
        }
    }
`;

export const Options = styled.div `
    display: flex;
    div {
        flex: 1;
    }
`;