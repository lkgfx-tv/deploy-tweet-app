import axios from "axios";
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://tu-aplicacion.vercel.app"
    : "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getData = async (params) => {
  try {
    const response = await api.get(params);
    return response.data;
  } catch (error) {
    console.log({ error });
    return error;
  }
};

export const postData = async (params, body = {}) => {
  try {
    const response = await api.post(params, body);
    return response.data;
  } catch (error) {
    console.log({ error });
    return error;
  }
};

export const deleteData = async (params) => {
  try {
    const response = await api.delete(params);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateData = async (params, body) => {
  try {
    const response = await api.patch(params, body);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Posts
export const getPosts = async () => {
  let params = `/api/posts`;
  return await getData(params);
};

export const getPostsByCategory = async (categoryId) => {
  console.log(categoryId);
  let params = `/api/posts?categoryId=${categoryId}`;
  return await getData(params);
};

export const deletePost = async (postId) => {
  let params = `/api/posts?postId=${postId}`;
  return await deleteData(params);
};

export const createPost = async (body) => {
  let params = `/api/posts`;
  return await postData(params, body);
};

export const getPostsByKeyword = async (keyword) => {
  let params = `/api/posts?keyword=${keyword}`;
  return await getData(params);
};

// Categories
export const getCategories = async () => {
  let params = `/api/categories`;
  return await getData(params);
};

export const createCategory = async (body) => {
  let params = `/api/categories`;
  return await postData(params, body);
};

// Tweets
export const getTweets = async () => {
  let params = `/api/tweets`;
  return await getData(params);
};

export const getTweetsByCategory = async (categoryId) => {
  let params = `/api/tweets?categoryId=${categoryId}`;
  return await getData(params);
};

export const createTweet = async (body) => {
  let params = `/api/tweets`;
  return await postData(params, body);
};

export const getTweetsByKeyword = async (keyword) => {
  let params = `/api/tweets?keyword=${keyword}`;
  return await getData(params);
};

export const deleteTweet = async (tweetId) => {
  let params = `/api/tweets?tweetId=${tweetId}`;
  return await deleteData(params);
};

// Files
export const getFiles = async () => {
  let params = `/api/files`;
  return await getData(params);
};

export const getFilesByCategory = async (categoryId) => {
  let params = `/api/files?categoryId=${categoryId}`;
  return await getData(params);
};

export const createFile = async (body) => {
  let params = `/api/files`;
  return await postData(params, body);
};

export const getFilesByKeyword = async (keyword) => {
  let params = `/api/files?keyword=${keyword}`;
  return await getData(params);
};

export const deleteFile = async (fileId) => {
  let params = `/api/files?fileId=${fileId}`;
  return await deleteData(params);
};
