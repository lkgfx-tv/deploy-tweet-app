import { useState, useEffect } from "react";
import {
  getPosts,
  getPostsByCategory,
  deletePost,
  getPostsByKeyword,
} from "@/services/apiFecthServices";
import FilterSelection from "../FilterSelection/FilterSelection";
import CreateModal from "../CreateModal/CreateModal";
import PostForm from "./PostForm";

function Posts(props) {
  const { categories } = props;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [postsList, setPostsList] = useState([]);
  const [copyText, setCopyText] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const posts = await getPosts();
      setPostsList(posts);
    };
    fetchData();
    setLoading(false);
  }, []);

  const copyContent = (content) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopyText(true);
        setTimeout(() => setCopyText(false), 2000);
      })
      .catch((err) => {
        console.error("Copy error: ", err);
      });
  };

  const handleSelectChange = async (event) => {
		setLoading(true);
    setSelectedCategory(event.target.value);
    if (!event.target.value || event.target.value === "") {
      const posts = await getPosts();
      setPostsList(posts);
    } else {
      const posts = await getPostsByCategory(event.target.value);
      setPostsList(posts);
    }
		setLoading(false);
  };

  const handleDeletePost = async (postId) => {
		setLoading(true);
    await deletePost(postId);
    let posts = await getPosts();
    setPostsList(posts);
		setLoading(false);	
  };

  const handleInputChange = async (event) => {
    const { value } = event.target;
    setKeyword(value);
  };

  const handleFilterByKeyword = async () => {
    const posts = await getPostsByKeyword(keyword);
    setPostsList(posts);
  };

  return (
    <div className="container d-flex w-100 mx-1 pb-3 align-items-center justify-content-center">
      <div className="row justify-content-center w-100">
        <div className="col-md-10">
          <div className="card w-100">
            <div className="card-header">
              <div className="d-flex justify-content-center">
                <h5 className="card-title p-2 my-2 text-center">Posts</h5>
                <FilterSelection
                  categories={categories}
                  selectedCategory={selectedCategory}
                  handleSelectChange={handleSelectChange}
                />
                <CreateModal type="post">
                  <PostForm
                    categories={categories}
                    postsList={postsList}
                    setPostsList={setPostsList}
										setLoading={setLoading}
                  />
                </CreateModal>
              </div>
              <div className="d-flex justify-content-center">
                <input
                  type="text"
                  id="keyword"
                  className="form-control w-50"
                  placeholder="Search"
                  onChange={(e) => handleInputChange(e)}
                />
                <button
                  type="button"
                  className="btn btn-primary mx-1"
                  onClick={() => handleFilterByKeyword()}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="list-group">
                  {postsList.map((post) => (
                    <div
                      key={post.id}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <div className="w-90">
                        <h5>{post.title}</h5>
                        <p>{post.content}</p>
                      </div>
                      <div className="w-10 d-flex flex-column justify-content-center align-items-center">
                      <button
                          className="btn btn-secondary my-2 px-2"
                          style={{ height: "40px", width: "80px" }}
                          onClick={() => copyContent(post.content)}
                        >
                          Copy
                        </button>
                        <button
                          className="btn btn-danger my-2 px-2"
                          style={{ height: "40px", width: "80px" }}
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Posts;
