const express = require('express');
const ReservaController = require('../controllers/reservaController');

const router = express.Router();

router.post('/', ReservaController.create);
router.get('/', ReservaController.findAll);
router.get('/:id', ReservaController.findById);
router.put('/:id', ReservaController.update);
router.delete('/:id', ReservaController.delete);

module.exports = router;

