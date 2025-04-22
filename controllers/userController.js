const User = require('../models/User');
const Board = require('../models/Board');
const TotalBoards = require('../models/TotalBoards');

// create a new user

exports.createUser = async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      // user exist or not 
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        return res.status(200).json(existingUser); // Return existing user instead of error
      }
      
      const user = new User({ phoneNumber });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// phone numebr
exports.getUser = async (req, res) => {
    try {
      const user = await User.findOne({ phoneNumber: req.params.phoneNumber })
        .populate('boards.boardId');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// delete 
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ phoneNumber: req.params.phoneNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    await TotalBoards.deleteMany({ userPhoneNumber: req.params.phoneNumber });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getOrCreateUser = async (req, res) => {
    try {
      let user = await User.findOne({ phoneNumber: req.params.phoneNumber })
        .populate('boards.boardId');
      
      if (!user) {
       
        user = new User({ phoneNumber: req.params.phoneNumber });
        await user.save();
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };