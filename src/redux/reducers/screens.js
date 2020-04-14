import { REQUEST_SCREEN } from "../actionTypes";
import { RECEIVE_SCREEN } from "../actionTypes";

const initialState = {
    fetching: false,

};

export default function(state = initialState, action) {
    switch (action.type) {
        case REQUEST_SCREEN: {
            const { id, content } = action.payload;
            return {
                ...state,
                fetching: true
                }
            }
        case RECEIVE_SCREEN: {
            return {
                ...state,
                screen: action.screen,
                fetching: false
            }
        }
        default:
            return state;
    }
}
