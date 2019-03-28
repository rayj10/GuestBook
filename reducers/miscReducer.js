import * as t from '../actions/actionTypes/miscTypes';

let initialState = { adminOptions: true };

/**
 * Updates store's state based on actionTypes
 * @param {Object} state: initial/current state of the reducer 
 * @param {Object} action: simple object containing actionType and update on states
 */
export default function miscReducer(state = initialState, action) {
    switch (action.type) {
        case t.HIDE_ADMIN:
            return Object.assign({}, state, { adminOptions: false });
        case t.SHOW_ADMIN:
            return Object.assign({}, state, { adminOptions: true });
        default:
            return state;
    }
}
