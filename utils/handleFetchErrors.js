const handleFetchError = (fetchObject, setError, setErrorInfo) => {
  if (fetchObject.status_code === 401) {
    setError(true);
    setErrorInfo(fetchObject.data);
    return true;
  }
  if (fetchObject.name === "AxiosError") {
    setError(true);
    setErrorInfo(fetchObject.response.data);
    return true;
  }
  return;
};

export { handleFetchError };
