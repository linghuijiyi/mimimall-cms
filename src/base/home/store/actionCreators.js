import * as actionTypes from './action-type';

export const changeLoading = (loading) => ({
    type: actionTypes.CHANGE_LOADING,
    loading
});