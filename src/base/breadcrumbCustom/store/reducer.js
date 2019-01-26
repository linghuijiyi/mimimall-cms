import * as actionTypes from './action-type';
// immutable保证不会修改state的对象
import { fromJS } from 'immutable';
// 控制输入框动画的数据
const defaultState = fromJS({
    breadcrumb: [],
});

export default (state = defaultState, action) => {
    switch(action.type) {
        case actionTypes.CHANGE_BREADCRUMB_LIST:
            return state.set('breadcrumb', action.list);
        default:
            return state;
    }
}