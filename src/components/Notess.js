import React, { useContext, useEffect, useState } from "react";
import noteContext from "../context/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

export const Notes = (props) => {
  const context = useContext(noteContext);
  let  navigate = useNavigate();
  const { notes, getNotes, editNote } = context;
  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes()
    }
    else{
      navigate("/login")
    }
    // eslint-disable-next-line
  }, []);
  const [modalVisible, setModalVisible] = useState(false); // Track modal visibility
  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "default",
  });

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
    setModalVisible(true); // Show the modal when editing a note
  };

  const handleClose = () => {
    setModalVisible(false); // Close the modal
  };

  const handleSave = () => {
    // Implement your save logic here
    editNote(note.id, note.etitle, note.edescription, note.etag)
    setModalVisible(false); // Close the modal after saving
    props.showAlert("Updated Successfully","success")
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote showAlert={props.showAlert} />
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container mx-2">
          {notes.length===0 && 'No Notes to Display'}
        </div>
        {notes.map((note) => {
          return <Noteitem updateNote={updateNote} showAlert={props.showAlert} note={note} />;
        })}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div
          className="modal fade show"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="false" // Modal is visible
          style={{ display: "block" }} // Ensure the modal is visible
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Note
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleClose} // Close modal when clicked
                  aria-label="Close"
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="Title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="etitle"
                      name="etitle"
                      value={note.etitle}
                      onChange={onChange}
                      minLength={5} required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="edescription"
                      name="edescription"
                      value={note.edescription}
                      onChange={onChange}
                      minLength={5} required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tag" className="form-label">
                      Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="etag"
                      name="etag"
                      value={note.etag}
                      onChange={onChange}
                      minLength={5} required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose} // Close the modal
                >
                  Close
                </button>
                <button
                  disabled={note.etitle.length<5 || note.edescription.length<5} 
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave} // Save and close the modal
                >
                  Update Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notes;
