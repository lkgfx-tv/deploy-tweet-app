import { useState } from "react";
import { createPost } from "@/services/apiFecthServices";
import { handleFetchError } from "@utils/handleFetchErrors";

function PostForm(props) {
  const { categories, setPostsList, postsList, setLoading } = props;
  const [postTitle, setpostTitle] = useState("");
  const [postsContent, setPostsContent] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setPostCategory(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const post = {
      title: postTitle,
      content: postsContent,
      categoryId: postCategory,
    };
    if (!post?.categoryId) delete post.categoryId;
    if (!postTitle || !postsContent || !postCategory) {
      setError(true);
      setErrorInfo("All 'titled' and 'content' fields are required");
      return;
    }
    const newPost = await createPost(post);
    if (handleFetchError(newPost, setError, setErrorInfo)) {
      setLoading(false);
      return;
    }
    setPostsList([...postsList, newPost]);
    onCloseModal();
    setLoading(false);
  };

  const onCloseModal = () => {
    setError(false);
    setErrorInfo("");
    setpostTitle("");
    setPostsContent("");
    setPostCategory("");
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
            <label htmlFor="postTitle" className="form-label">
              Post Title
            </label>
            <input
              type="text"
              className="form-control"
              id="postTitle"
              value={postTitle}
              onChange={(e) => setpostTitle(e.target.value)}
            />
          </div>
          <div className="mb-3 ">
            <label htmlFor="postsContent" className="form-label">
              Post Content
            </label>
            <textarea
              type="text"
              className="form-control"
              id="postsContent"
              value={postsContent}
              onChange={(e) => setPostsContent(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="postCategory" className="form-label">
              Post Category
            </label>
            <select
              value={postCategory}
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

export default PostForm;
