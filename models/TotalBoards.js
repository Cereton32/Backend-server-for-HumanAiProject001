const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  userPhoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['viewer', 'editor'],
    required: true,
  },
});

const TodoSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: String,
    isPriority: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, { _id: true }); 

const TotalBoardsSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  userPhoneNumber: {
    type: String,
    required: true,
  },
  roles: [RoleSchema],
  todos: [TodoSchema],
});

module.exports = mongoose.model('TotalBoards', TotalBoardsSchema);