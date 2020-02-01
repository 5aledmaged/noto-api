import { Note } from '../models/noteModel';
import AccessController from '../lib/access-control/access-controller';
import AuthorizationError from '../errors/AuthorizationError';

export default class NoteService {
	constructor() {
		this.noteModel = Note;
		this.accessController = new AccessController();
	}

	/**
	 * add a new note
	 * @param {object} user authenticated user
	 * @param {AddNoteDTO} addNoteDTO new note data
	 * @return {Promise} resolves to the added document
	 */
	addOne(user, addNoteDTO) {
		return this.noteModel.create({
			...addNoteDTO,
			ownerId: user.id
		});
	}

	/**
	 * get the requested note
	 * @param {object} user authenticated user
	 * @param {string} noteId requested note id
	 * @return {object} requested note document
	 * @throws {AuthorizationError} if user doesn't have access to requested note
	 */
	async getOne(user, noteId) {
		const note = await this.noteModel.findOne({ _id: noteId }).exec();

		const permission = this.accessController.canRead(user, note);

		if (!permission) {
			throw new AuthorizationError('user doesn\'t have access to requested note');
		}

		return note;
	}

	/**
	 * get all notes added by authenticated user
	 * @param {object} user authenticated user
	 * @return {object[]} array of note documents added by authenticated user
	 */
	getMany(user) {
		return this.noteModel.find({ ownerId: user.id }).exec();
	}

	/**
	 * edit requested note
	 * @param {object} user authenticated user
	 * @param {UpdatedNoteDTO} updatedNoteDTO updated note data
	 * @param {string} noteId id of note to be updated
	 */
	async updateOne(user, updatedNoteDTO, noteId) {
		const oldNote = await this.getOne(noteId);

		const permission = this.accessController.canEdit(user, oldNote);

		if (!permission) {
			throw new AuthorizationError('user doesn\'t have permission to edit note');
		}

		for (const key of Object.keys(updatedNoteDTO)) {
			if (updatedNoteDTO[key] !== null) {
				oldNote[key] = updatedNoteDTO[key];
			}
		}

		if (oldNote.isModified()) {
			await oldNote.save();
		}
	}

	deleteOne(user, noteId) {
		const noteToDelete = this.getOne(user, noteId);

		const permission = this.accessController.canDelete(user, noteToDelete);

		if (!permission) {
			throw new AuthorizationError('user doesn\'t have permission to edit note');
		}

		return this.noteModel.deleteOne({ _id: noteId }).exec();
	}
}