const express = require('express');
const ClienteController = require('../controllers/clienteController');

const router = express.Router();

router.post('/', ClienteController.create);
router.get('/', ClienteController.findAll);
router.get('/:id', ClienteController.findById);
router.put('/:id', ClienteController.update);
router.delete('/:id', ClienteController.delete);

module.exports = router;

