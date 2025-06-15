import { GENERATE } from '../../constants/ActionTypes';

const initialState = {
  error: null,
  response: '',
  loaded: false,
  loading: false,
};

export default function generator(state = initialState, action = {}) {
  switch (action.type) {
    case `${GENERATE}_PENDING`:
      return {
        ...state,
        error: null,
        response: '',
        loaded: false,
        loading: true,
      };
    case `${GENERATE}_SUCCESS`:
      return {
        ...state,
        error: null,
        response: action.result.response,
        loaded: true,
        loading: false,
      };
    case `${GENERATE}_FAIL`:
      return {
        ...state,
        error: action.error,
        response: '',
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
