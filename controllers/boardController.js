const Board = require('../models/Board');
const User = require('../models/User');
const TotalBoards = require('../models/TotalBoards');
const mongoose = require('mongoose')
//-for a creaete board
exports.createBoard = async (req, res) => {
  try {
    const { name, userPhoneNumber } = req.body;
    
  
    const user = await User.findOne({ phoneNumber: userPhoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
   
    const board = new Board({ name });
    await board.save();
    
  //adding
    user.boards.push({ boardId: board._id, name });
    await user.save();
    
//entry api 
    const totalBoard = new TotalBoards({
      boardId: board._id,
      userPhoneNumber,
      roles: [{ userPhoneNumber, role: 'editor' }], // Creator is automatically an editor
    });
    await totalBoard.save();
    
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBoard = async (req, res) => {
    try {
      const { boardId } = req.params;
      
      // Validate the boardId
      if (!mongoose.Types.ObjectId.isValid(boardId)) {
        return res.status(400).json({ message: 'Invalid board ID' });
      }
  
      const board = await TotalBoards.findOne({ boardId })
        .populate('boardId');
      
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }
      
      res.json(board);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getUserBoards = async (req, res) => {
    try {
      const { phoneNumber } = req.params;
      const user = await User.findOne({ phoneNumber }).populate('boards.boardId');
      const createdBoards = user ? user.boards.map(b => ({ 
        boardId: b.boardId._id.toString(),
        name: b.boardId.name 
      })) : [];
      
      const sharedBoards = await TotalBoards.find({
        'roles.userPhoneNumber': phoneNumber,
        'userPhoneNumber': { $ne: phoneNumber }
      }).populate('boardId');
  
      res.json({
        createdBoards,
        sharedBoards: sharedBoards.map(b => ({
          boardId: b.boardId._id.toString(),
          name: b.boardId.name,
          role: b.roles.find(r => r.userPhoneNumber === phoneNumber).role
        }))
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// board name
exports.updateBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const board = await Board.findByIdAndUpdate(
      req.params.boardId,
      { name },
      { new: true }
    );
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    // update name in boadr
    await User.updateOne(
      { 'boards.boardId': req.params.boardId },
      { $set: { 'boards.$.name': name } }
    );
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete 
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.boardId);
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
  //remove 
    await User.updateMany(
      { 'boards.boardId': req.params.boardId },
      { $pull: { boards: { boardId: req.params.boardId } } }
    );
    
    //remove form total boards 
    await TotalBoards.deleteOne({ boardId: req.params.boardId });
    
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//role adding
exports.addRole = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userPhoneNumber, role } = req.body;
    
//board exists or niot 
    const board = await TotalBoards.findOne({ boardId });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
  //role exist 
    const existingRole = board.roles.find(r => r.userPhoneNumber === userPhoneNumber);
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists for this user' });
    }
    
    board.roles.push({ userPhoneNumber, role });
    await board.save();
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.removeRole = async (req, res) => {
  try {
    const { boardId, userPhoneNumber } = req.params;
    
    const board = await TotalBoards.findOneAndUpdate(
      { boardId },
      { $pull: { roles: { userPhoneNumber } } },
      { new: true }
    );
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//todo addingn
exports.addTodo = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name, description, isPriority } = req.body;
    
    const board = await TotalBoards.findOne({ boardId });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    const newTodo = {
      name,
      description,
      isPriority: isPriority || false,
    };
    
    board.todos.push(newTodo);
    await board.save();
    
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update todo
exports.updateTodo = async (req, res) => {
  try {
    const { boardId, todoId } = req.params;
    const { name, description, isPriority } = req.body;
    
    const board = await TotalBoards.findOne({ boardId });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    const todo = board.todos.id(todoId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    if (name) todo.name = name;
    if (description) todo.description = description;
    if (isPriority !== undefined) todo.isPriority = isPriority;
    
    await board.save();
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
  try {
    const { boardId, todoId } = req.params;
    
    const board = await TotalBoards.findOne({ boardId });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    board.todos.pull({ _id: todoId });
    await board.save();
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


