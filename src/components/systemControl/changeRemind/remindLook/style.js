import styled from 'styled-components';

export const Wrap = styled.div `
    width:1000px;
    padding-left:40px;
    padding-top:20px;
    p{
        margin-bottom:0;
    }
    .row{
        width:800px;
        padding:16px 0;
        display:flex;
        .redCode{
            color:red;
            margin-right:4px;
        }
        textarea{
            width:500px;
            resize:none;
        }
        p{
            width:500px;
        }
    }
    .rowTitle{
        width:140px;
        text-align:right;
        margin-right:12px;
    }
`;
