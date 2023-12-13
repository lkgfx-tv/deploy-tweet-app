import { useState, useEffect } from "react";
const AWS = require("aws-sdk");
import {
  getFiles,
  getFilesByCategory,
  getFilesByKeyword,
  deleteFile,
} from "@/services/apiFecthServices";
import FilterSelection from "../FilterSelection/FilterSelection";
import CreateModal from "../CreateModal/CreateModal";
import FilesForm from "./FilesForm";

// AWS S3
AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION_NAME,
});
const s3 = new AWS.S3();

function Files(props) {
  const { categories } = props;
  const [filesList, setFilesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const files = await getFiles();
      setFilesList(files);
    };
    fetchData();
    setLoading(false);
  }, []);

  const handleSelectChange = async (event) => {
    setLoading(true);
    setSelectedCategory(event.target.value);
    if (!event.target.value || event.target.value === "") {
      const files = await getFiles();
      setFilesList(files);
    } else {
      const files = await getFilesByCategory(event.target.value);
      setFilesList(files);
    }
    setLoading(false);
  };

  const handleInputChange = async (event) => {
    const { value } = event.target;
    setKeyword(value);
  };

  const handleFilterByKeyword = async () => {
    setLoading(true);
    const files = await getFilesByKeyword(keyword);
    setFilesList(files);
    setLoading(false);
  };

  const handleDeleteImage = async (id, url) => {
    setLoading(true);
    const imageName = url.split("/")[4];
    console.log(imageName);
    const deleteParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_STORAGE_BUCKET_NAME,
      Key: `files/${imageName}`,
    };
    s3.deleteObject(deleteParams, function (err, data) {
      if (err) {
        console.log("Error al eliminar el objeto:", err);
      } else {
        console.log("Objeto eliminado con éxito");
      }
    });
    await deleteFile(id);
    const files = await getFiles();
    setFilesList(files);
    setLoading(false);
  };

  function getFileComponent(files) {
    const extension = files.url.split(".").pop(); // Obtener la extensión del archivo

    if (
      extension === "mp4" ||
      extension === "avi" /* o cualquier extensión de video */
    ) {
      return (
        <video
          controls
          style={{
            maxWidth: "100%",
            maxHeight: "200px",
            minHeight: "200px",
            objectFit: "contain",
          }}
        >
          <source src={files.url} type={`video/${extension}`} />
          Tu navegador no soporta este video.
        </video>
      );
    } else if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png" /* o cualquier extensión de imagen */
    ) {
      return (
        <img
          src={files.url}
          className="card-img-top"
          alt={files.name}
          style={{
            maxWidth: "100%",
            maxHeight: "200px",
            minHeight: "200px",
            objectFit: "contain",
          }}
        />
      );
    } else {
      // Si no es ni imagen ni video, puedes manejarlo de otra manera
      return <p>No se puede mostrar el archivo.</p>;
    }
  }

  return (
    <div className="container d-flex  mx-auto align-items-center justify-content-center">
      <div className="row justify-content-center w-100">
        <div className="col-md-10">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-center">
                <h5 className="card-title p-2 my-2 text-center">Files</h5>
                <FilterSelection
                  categories={categories}
                  selectedCategory={selectedCategory}
                  handleSelectChange={handleSelectChange}
                />
                <CreateModal type="file">
                  <FilesForm
                    categories={categories}
                    filesList={filesList}
                    setFilesList={setFilesList}
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
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {filesList.map((files) => (
                    <div
                      className="col-md-3 mb-3"
                      key={files.id}
                      style={{ minWidth: "265px" }}
                    >
                      <div className="card" style={{ maxWidth: "18rem" }}>
                        {getFileComponent(files)}
                        <div className="card-body w-100">
                          <h5 className="card-title">{files.name}</h5>
                          <a
                            href={files.url}
                            className="btn btn-primary"
                            style={{ width: "100px" }}
                          >
                            Download
                          </a>
                          <button
                            className="btn btn-danger mx-2"
                            onClick={() =>
                              handleDeleteImage(files.id, files.url)
                            }
                          >
                            Eliminar
                          </button>
                        </div>
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

export default Files;
