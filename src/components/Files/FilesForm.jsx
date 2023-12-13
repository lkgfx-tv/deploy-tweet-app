import { useState } from "react";
import S3 from "aws-sdk/clients/s3";
import { createFile } from "@/services/apiFecthServices";
import { handleFetchError } from "@utils/handleFetchErrors";

// AWS S3
const config = {
  bucketName: process.env.NEXT_PUBLIC_AWS_STORAGE_BUCKET_NAME,
  dirName: process.env.NEXT_PUBLIC_AWS_S3_DIR_NAME,
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION_NAME,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
};
const s3 = new S3(config);

function FilesForm(props) {
  const { categories, setFilesList, filesList, setLoading } = props;
  const [filesName, setFilesName] = useState("");
  const [image, setImage] = useState(null);
  const [filesCategory, setFilesCategory] = useState("");
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setFilesCategory(value);
  };

  const saveImage = async (location) => {
    const file = {
      name: filesName,
      url: location,
      categoryId: filesCategory,
    };
    if (!file?.categoryId) delete file.categoryId;
    const newFile = await createFile(file);
    if (handleFetchError(newFile, setError, setErrorInfo)) {
      setLoading(false);
      return;
    }
    setFilesList([...filesList, newFile]);
  };

  const handleSubmit = async () => {
    if (!filesName || !image) {
      setError(true);
      setErrorInfo("All 'name' and 'file' fields are required");
      return;
    }
    setLoading(true);
    const params = {
      Bucket: config.bucketName,
      Key: `${config.dirName}/${image.name}`,
      Body: image,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        setLoading(false);
      } else {
        console.log(data);
        console.log(data.Location);
        saveImage(data.Location);
        setLoading(false);
      }
    });

    onCloseModal();
  };

  const onCloseModal = () => {
    setError(false);
    setErrorInfo("");
    setFilesName("");
    setImage("");
    setFilesCategory("");
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
            <label htmlFor="filesName" className="form-label">
              Files Name
            </label>
            <input
              type="text"
              className="form-control"
              id="filesName"
              value={filesName}
              onChange={(e) => setFilesName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Image
            </label>
            <input
              type="file"
              className="form-control"
              id="imageInput"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="filesCategory" className="form-label">
              Image Category
            </label>
            <select
              value={filesCategory}
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

export default FilesForm;
