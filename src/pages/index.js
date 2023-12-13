import { useEffect, useState } from "react";
import Tweets from "@/components/Tweets/Tweets";
import Posts from "@/components/Posts/Posts";
import Files from "@/components/Files/Files";
import CreateModal from "@/components/CreateModal/CreateModal";
import CategoryForm from "@/components/Categories/CategoriesForm";
import { getCategories } from "@/services/apiFecthServices";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [showOptions, setShowOptions] = useState("tweets");

  const handleShowOptions = (event) => {
    setShowOptions(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    fetchData();
  }, []);

  return (
    <div className="d-flex flex-column vh-100 w-100 align-items-center justify-content-start">
      <select
        value={showOptions}
        onChange={handleShowOptions}
        className="d-flex my-4 w-50 form-select align-items-center justify-content-center"
      >
        <option className="text-dark" value="tweets">
          Tweets
        </option>
        <option className="text-dark" value="posts">
          Posts
        </option>
        <option className="text-dark" value="files">
          Files
        </option>
      </select>
      <CreateModal type="category">
        <CategoryForm categories={categories} setCategories={setCategories} />
      </CreateModal>
      {showOptions === "tweets" && <Tweets categories={categories} />}
      {showOptions === "posts" && <Posts categories={categories} />}
      {showOptions === "files" && <Files categories={categories} />}
    </div>
  );
}
