export default (data, callback) => {
    if (data.totalCount < 0) data.totalCount = 0;
    return {
        onChange: (current) => {
            callback(current);
        },
        current: data.pageNo || 0,
        pageSize: data.pageSize || 0,
        total: data.totalCount || 0,
        showTotal: () => {
            return `共${data.totalCount || 0}条数据`;
        },
        showQuickJumper: true // 分頁
    }
}