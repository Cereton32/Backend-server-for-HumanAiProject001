const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  boards: [
    {
      boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
      },
      name: String,
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);