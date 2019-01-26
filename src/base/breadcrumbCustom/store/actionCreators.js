import * as actionTypes from './action-type';
import { fromJS } from 'immutable';
export const changeBreadcrumb = (list) => ({
    type: actionTypes.CHANGE_BREADCRUMB_LIST,
    list: fromJS(list)
});
