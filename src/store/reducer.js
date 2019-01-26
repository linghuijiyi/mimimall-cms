import { combineReducers } from 'redux-immutable';
import { reducer as breadcrumbReducer } from './../base/breadcrumbCustom/store';
import { reducer as homeReducer } from './../base/home/store';
import { reducer as HeaderIsMobile } from './../base/header/store';
import { reducer as MenuCollapsed } from './../base/menuList/store';
// 整合reducer合并成一个大的reducer
export default combineReducers({
    breadcrumb: breadcrumbReducer,
    home: homeReducer,
    header: HeaderIsMobile,
    menuList: MenuCollapsed
});