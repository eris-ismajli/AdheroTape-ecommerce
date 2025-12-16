import axiosInstance from "../../utils/axiosInstance";
import {
  REVIEWS_FETCH_REQUEST,
  REVIEWS_FETCH_SUCCESS,
  REVIEWS_FETCH_FAIL,
  REVIEW_SUBMIT_REQUEST,
  REVIEW_SUBMIT_SUCCESS,
  REVIEW_SUBMIT_FAIL,
  REVIEW_DELETE_REQUEST,
  REVIEW_DELETE_SUCCESS,
  REVIEW_DELETE_FAIL,
} from "./constants";

export const fetchReviews = (productId) => async (dispatch) => {
  try {
    dispatch({ type: REVIEWS_FETCH_REQUEST });

    const res = await axiosInstance.get(`/reviews/product/${productId}`);

    dispatch({
      type: REVIEWS_FETCH_SUCCESS,
      payload: res.data.data || [],
    });
  } catch (err) {
    dispatch({
      type: REVIEWS_FETCH_FAIL,
      payload: err.response?.data?.message || "Failed to load reviews",
    });
  }
};

export const submitReview =
  ({ productId, rating, comment }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: REVIEW_SUBMIT_REQUEST });

      await axiosInstance.post("/reviews", {
        productId,
        rating,
        comment,
      });

      const { auth } = getState();

      dispatch({
        type: REVIEW_SUBMIT_SUCCESS,
        payload: {
          id: Date.now(), // temporary key
          rating,
          comment,
          created_at: new Date().toISOString(),
          user_name: auth.user.name,
          user_id: auth.user.id,
        },
      });
    } catch (err) {
      dispatch({
        type: REVIEW_SUBMIT_FAIL,
        payload: err.response?.data?.message || "Failed to submit review",
      });
    }
  };

export const editReview =
  ({ reviewId, productId, rating, comment }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: REVIEW_SUBMIT_REQUEST });

      await axiosInstance.patch(`/reviews/${productId}`, {
        rating,
        comment,
      });

      const { auth } = getState();

      dispatch({
        type: REVIEW_SUBMIT_SUCCESS,
        payload: {
          id: reviewId, // ✅ SAME ID
          rating,
          comment,
          created_at: new Date().toISOString(),
          user_name: auth.user.name,
          user_id: auth.user.id,
        },
      });
    } catch (err) {
      dispatch({
        type: REVIEW_SUBMIT_FAIL,
        payload: err.response?.data?.message || "Failed to edit review",
      });
    }
  };

export const deleteReview = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: REVIEW_DELETE_REQUEST });

    const res = await axiosInstance.delete(`/reviews/${productId}`);

    // Remove the review from current Redux state
    const { reviews } = getState();
    const updatedReviews = reviews.items.filter(
      (r) => r.user_id !== getState().auth.user.id
    );

    dispatch({
      type: REVIEW_DELETE_SUCCESS,
      payload: updatedReviews,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: REVIEW_DELETE_FAIL,
      payload: err.response?.data?.message || "Failed to delete review",
    });
  }
};
