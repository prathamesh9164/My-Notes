const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE-1  Get all the notes using: GET"/api/notes/getuser". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch(error){
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE-2  Add a new Note using: POST"/api/notes/addnote". Login required
router.post("/addnote",fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try{
    const {title, description, tag} = req.body;
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Notes({
        title, description, tag, user: req.user.id 
    })
    const savedNote = await note.save()


    res.json(savedNote)

} catch(error){
    console.log(error.message);
    res.status(500).send("Internal server error");
}
  });

  // ROUTE-3  Update an existing Note using: PUT "/api/notes/updatenote/:id". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  // Create a newNote object
  const newNote = {};
  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;

  try {
      // Find the note to be updated and update it
      let note = await Notes.findById(req.params.id);
      if (!note) {
          return res.status(404).send("Not Found");
      }

      // Check if the logged-in user is the owner of the note
      if (note.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allowed");
      }

      // Update the note
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
      
      // Send the updated note as response
      res.json(note);
  } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
  }
});

 // ROUTE-4  Delete an existing Note using: DELETE "/api/notes/deletenote/:id". Login required
 router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
      // Find the note to be deleted and delete it
      let note = await Notes.findById(req.params.id);
      if (!note) {
          return res.status(404).send("Not Found");
      }

      // Allow deletion only if user owns this note
      if (note.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allowed");
      }

      // Update the note
      note = await Notes.findByIdAndDelete(req.params.id);
      
      // Send the updated note as response
      res.json({"Success!": "The note has been deleted", note:note});
  } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
  }
});

module.exports = router;
