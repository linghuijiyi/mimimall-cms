import * as actionTypes from './action-type';

export const changeMenuList = (isMobile) => ({
    type: actionTypes.HEADER_MENULIST,
    isMobile
});