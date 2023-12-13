import { useState } from "react";
import { createCategory } from "@/services/apiFecthServices";
import { handleFetchError } from "@utils/handleFetchErrors";
import { capitalize } from "@utils/capitalizeStr";

function CategoryForm(props) {
  const { categories, setCategories } = props;
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  const handleSubmit = async () => {
    if (!categoryName) {
      setError(true);
      setErrorInfo("All 'name' field are required");
      return;
    }
    const category = {
      name: capitalize(categoryName),
    };

    const newCategory = await createCategory(category);
    if (handleFetchError(newCategory, setError, setErrorInfo)) {
      //setLoading(false);
      return;
    }
    setCategories([...categories, newCategory]);
    onCloseModal();
  };

  const onCloseModal = () => {
    setError(false);
    setCategoryName("");
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
              Category Title
            </label>
            <input
              type="text"
              className="form-control"
              id="postTitle"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
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

export default CategoryForm;
