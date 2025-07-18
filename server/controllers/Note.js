const Note = require('../models/Note');

//create a note
exports.createNote = async (req, res) => {
    try {
        //fetch the data
        const {title, description} = req.body;
        const userId = req.user.userId;

        //validation
        if(!title || !description) {
            return res.status(404).json({
                success: false,
                message: 'All fields are required',
            });
        }

        const newNote = await Note.create({
            title,
            description,
            createdBy: userId
        });

        return res.status(200).json({
            success: true,
            message: `Note created successfully by ${userId}`,
            note: newNote
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot make a note right now',
            error: err
        });
    }
};


//update a note
exports.updateNote = async (req, res) => {
    try {
        const notesId = req.params.id;
        const {title, description, updatedAt} = req.body;

        if(!title || !description) {
            return res.status(404).json({
                success: false,
                message: 'All fields are required'
            });
        }

        //find the note via id
       const updatedNote = await Note.findByIdAndUpdate(notesId,
        {title,
        description,
        updatedAt: Date.now()},
        {new: true}
       );

       return res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        note: updatedNote
       });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot update note currently'
        });
    }
};


//delete a note
exports.deleteNote = async (req, res) => {
    try {
        //fetch the note using id
        const noteId = req.params.id;

        await Note.findByIdAndDelete(noteId);

        return res.status(200).json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot delete the note currently',
            error: err
        });
    }
};


//fetch all notes for the logged-in user
exports.fetchAllNotes = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notes = await Note.find({ createdBy: userId });
        return res.status(200).json({
            success: true,
            notes
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot fetch notes currently'
        });
    }
};


//fetch a single note
exports.fetchNoteById = async (req, res) => {
    try {
        const noteId = req.params.id;

        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'fetched the note successfully',
            note
        })

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot fetch the note'
        });
    }
}