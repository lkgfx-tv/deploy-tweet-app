import { useState } from "react";
import { createTweet } from "@/services/apiFecthServices";
import { handleFetchError } from "@utils/handleFetchErrors";

function TweetForm(props) {
  const { categories, setTweetsList, tweetsList, setLoading } = props;
  const [tweetTitle, setTweetTitle] = useState("");
  const [tweetUrl, setTweetUrl] = useState("");
  const [tweetCategory, setTweetCategory] = useState("");
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setTweetCategory(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const tweet = {
      title: tweetTitle,
      url: tweetUrl,
      categoryId: tweetCategory,
    };
    console.log("tweet: ", tweet);
    if (!tweet?.categoryId) delete tweet.categoryId;
    if (!tweetTitle || !tweetUrl) {
      setError(true);
      setErrorInfo("All 'title' and 'url' fields are required");
      return;
    }
    const newTweet = await createTweet(tweet);
    if (handleFetchError(newTweet, setError, setErrorInfo)) {
      setLoading(false);
      return;
    }
    setTweetsList([...tweetsList, newTweet]);
    onCloseModal();
    setLoading(false);
  };

  const onCloseModal = () => {
    setError(false);
    setErrorInfo("");
    setTweetTitle("");
    setTweetUrl("");
    setTweetCategory("");
  };

  return (
    <>
      <div className="col-md W-100">
        {error && (
          <div className="alert alert-danger w-100" role="alert">
            {errorInfo}
          </div>
        )}
        <form>
          <div className="mb-3">
            <label htmlFor="tweetTitle" className="form-label">
              Tweet Title
            </label>
            <input
              type="text"
              className="form-control"
              id="tweetTitle"
              value={tweetTitle}
              onChange={(e) => setTweetTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tweetUrl" className="form-label">
              Tweet URL
            </label>
            <input
              type="text"
              className="form-control"
              id="tweetUrl"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tweetCategory" className="form-label">
              Tweet Category
            </label>
            <select
              value={tweetCategory}
              onChange={handleSelectChange}
              className="form-select  h-1 my-2"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
      <div className="modal-footer w-100">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
          onClick={() => onCloseModal()}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-dismiss="modal"
          onClick={() => handleSubmit()}
        >
          Create
        </button>
      </div>
    </>
  );
}

export default TweetForm;
