import noteContext from "./noteContext";
import { useState } from "react";

const host = "http://localhost:5000";
const NoteState = (props) => {
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial)

  // Get all Notes
  const getNotes = async () => {
    // API call
    const response = await fetch(
     `${host}/api/notes/fetchallnotes`,
     {
       method: "GET",
       headers: {
         "content-Type": "application/json",
         "auth-token":
           localStorage.getItem('token')
       }
       
     }
   );
   const json = await response.json()
   console.log(json)
   setNotes(json)
 };

  // Add a Note
  const addNote = async (title, description, tag) => {
     // API call
     const response = await fetch(
      `${host}/api/notes/addnote`,
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          "auth-token":
            localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}),
      }
    );
    const json = await response.json()
   console.log(json)
    // Create a new note object with the provided information
    const newNote = json;

    // Use the setter to update the state by adding the new note
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  // Delete a Note
  //TODO API call
  const deleteNote =async (id) => {
     // API call
     const response = await fetch(
      `${host}/api/notes/deletenote/${id}`,
      {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
          "auth-token":
            localStorage.getItem('token')
        }
      }
    );
    const json = await response.json()
   console.log(json)

    console.log("Deleting the Note with id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API call
    const response = await fetch(
      `${host}/api/notes/updatenote/${id}`,
      {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
          "auth-token":
            localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}),
      }
    );
    const json = await response.json()
   console.log(json)
  
   let newNotes = JSON.parse(JSON.stringify(notes))
  //Logic to edit in client
  for (let index = 0; index < newNotes.length; index++) {
    const element = newNotes[index];
    if (element._id === id) {
      newNotes[index].title = title;
      newNotes[index].description = description;
      newNotes[index].tag = tag;
      break;
    }
  }
  setNotes(newNotes);
}
  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
