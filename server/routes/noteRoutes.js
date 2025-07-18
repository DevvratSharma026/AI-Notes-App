const express = require('express');
const router = express.Router();

const {auth} = require('../middlewares/auth');

const {
    createNote,
    updateNote,
    deleteNote,
    fetchAllNotes,
    fetchNoteById
} = require('../controllers/Note');

//routes
router.post('/createNote',auth, createNote);
router.put('/updateNote/:id', auth, updateNote);
router.delete('/deleteNote/:id', auth, deleteNote);
router.get('/fetchAllNotes', auth, fetchAllNotes);
router.get('/fetchNoteById/:id', auth, fetchNoteById);

module.exports = router;