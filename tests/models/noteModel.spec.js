import { describe, it } from 'mocha';
import { expect } from 'chai';
import NoteModel from '../../models/noteModel';

describe('note', () => {
	describe('title', () => {
		it('should be invalid if title is empty', (done) => {
			const note = new NoteModel({
				ownerId: '5d55847007e7fe30baac1767'
			});

			const validationError = note.validateSync();

			try {
				expect(validationError, 'validationError is undefined')
					.to.exist;
				expect(validationError.errors.title, 'errors.title doesn\'t exist')
					.to.exist;
				expect(validationError.errors.title.message)
					.to.equal('title is required', 'error message is wrong');
			}
			catch (e) {
				return done(e);
			}

			return done();
		});
	});

	describe('ownerId', () => {
		it('should be invalid if ownerId is empty', (done) => {
			const note = new NoteModel({
				title: 'hellooooo'
			});

			const validationError = note.validateSync();

			try {
				expect(validationError, 'validationError is undefined')
					.to.exist;
				expect(validationError.errors.ownerId, 'errors.ownerId doesn\'t exist')
					.to.exist;
				expect(validationError.errors.ownerId.message)
					.to.equal('ownerId is required', 'error message is wrong');
			}
			catch (e) {
				return done(e);
			}

			return done();
		});

		it('should be invalid if ownerId is not an ObjectId', (done) => {
			const note = new NoteModel({
				title: 'hellooooo',
				ownerId: 'ret'
			});

			const validationError = note.validateSync();

			try {
				expect(validationError, 'validationError is undefined')
					.to.exist;
				expect(validationError.errors.ownerId, 'errors.ownerId doesn\'t exist')
					.to.exist;
				expect(validationError.errors.ownerId.message)
					.to.contain('Cast to ObjectID failed for value', 'wrong error message');
			}
			catch (e) {
				return done(e);
			}

			return done();
		});
	});
});
