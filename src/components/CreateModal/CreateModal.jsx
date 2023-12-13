import { useState } from "react";

function CreateModal(props) {
  const { type, children } = props;
  return (
    <>
      <button
        type="button"
        className="btn btn-success my-2"
        style={{ height: "40px", width: "180px", maxWidth: "180px" }}
        data-bs-toggle="modal"
        data-bs-target={`#${type}`}
      >
        Create {type}
      </button>

      <div
        className="modal fade"
        id={`${type}`}
        tabIndex="-1"
        aria-labelledby={`${type}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`${type}Label`}>
                Create {type}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateModal;
