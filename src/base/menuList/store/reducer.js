import * as actionTypes from './action-type';
import { fromJS } from 'immutable';

const defaultState = fromJS({
    collapsed: false,
    toggleMenu: true
});

export default (state = defaultState, action) => {
    const { MENU_COLLAPSED } = actionTypes;
    switch(action.type) {
        case actionTypes.MENU_COLLAPSED:
            return state.set('collapsed', action.collapsed);
        case actionTypes.TOGGLE_MENU:
            return state.set('toggleMenu', action.toggleMenu);
        default:
            return state;
    }
}