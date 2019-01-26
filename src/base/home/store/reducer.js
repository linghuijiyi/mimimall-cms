import * as actionTypes from './action-type';
import { fromJS } from 'immutable';

const defaultState = fromJS({
    loading: false
});

export default (state = defaultState, action) => {
    const { CHANGE_LOADING   } = actionTypes;
    switch(action.type) {
        case actionTypes.CHANGE_LOADING:
            return state.set('loading', action.loading);
        default:
            return state;
    }
}