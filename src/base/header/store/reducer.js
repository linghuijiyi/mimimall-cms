import * as actionTypes from './action-type';
import { fromJS } from 'immutable';

const defaultState = fromJS({
    isMobile: false
});

export default (state = defaultState, action) => {
    const { HEADER_MENULIST } = actionTypes;
    switch(action.type) {
        case actionTypes.HEADER_MENULIST:
            return state.set('isMobile', action.isMobile);
        default:
            return state;
    }
}