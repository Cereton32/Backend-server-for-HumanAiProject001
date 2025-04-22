const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// Board CRUD
router.post('/', boardController.createBoard);
router.get('/:boardId', boardController.getBoard);
router.put('/:boardId', boardController.updateBoard);
router.delete('/:boardId', boardController.deleteBoard);

// role management
router.post('/:boardId/roles', boardController.addRole);
router.delete('/:boardId/roles/:userPhoneNumber', boardController.removeRole);

// todo management
router.post('/:boardId/todos', boardController.addTodo);
router.put('/:boardId/todos/:todoId', boardController.updateTodo);
router.delete('/:boardId/todos/:todoId', boardController.deleteTodo);

// Get all boards for a user
router.get('/user/:phoneNumber', boardController.getUserBoards);



module.exports = router;