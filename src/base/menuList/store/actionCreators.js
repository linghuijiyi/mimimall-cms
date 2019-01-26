import * as actionTypes from './action-type';

export const toggleCollapsed = (collapsed) => ({
    type: actionTypes.MENU_COLLAPSED,
    collapsed
});


export const toggleMenu = (toggleMenu) => ({
    type: actionTypes.TOGGLE_MENU,
    toggleMenu
});