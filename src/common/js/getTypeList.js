import fatch from './fatch.js';
import baseURL from './baseURL.js';
import { message } from 'antd';
export default function getTypeList() {
    return new Promise((reslove, reject) => {
        const url = `${baseURL}category/all/list`;
        fatch(url, 'post', {}, (err, state) => {
            message.error(err);
        }).then((res) => {
            if (res.code === '0') {
                reslove(handleFormatTypeList(res.data));
            } else {
                message.error('获取分类id失败：' + res.msg);
            }
        });
    });
}

export function handleFormatTypeList(data) {
    return data.map((item) => {
        item.value = item.name;
        item.label = item.name;
        item.children = item.thirdCategoryList;
        if (item.thirdCategoryList !== null) handleFormatTypeList(item.thirdCategoryList);
        return item;
    });
}