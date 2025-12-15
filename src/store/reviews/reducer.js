import {
  REVIEWS_FETCH_REQUEST,
  REVIEWS_FETCH_SUCCESS,
  REVIEWS_FETCH_FAIL,
  REVIEW_SUBMIT_REQUEST,
  REVIEW_SUBMIT_SUCCESS,
  REVIEW_SUBMIT_FAIL,
} from "./constants";

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
};

export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case REVIEWS_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case REVIEWS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };

    case REVIEWS_FETCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case REVIEW_SUBMIT_REQUEST:
      return {
        ...state,
        submitting: true,
        error: null,
      };

    case REVIEW_SUBMIT_SUCCESS:
      return {
        ...state,
        submitting: false,
        items: [action.payload, ...state.items],
      };

    case REVIEW_SUBMIT_FAIL:
      return {
        ...state,
        submitting: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
