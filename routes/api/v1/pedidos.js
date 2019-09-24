router = require('express').Router();

const PedidoController = require('../../../controllers/PedidoController');

const { LojaValidation } = require('../../../controllers/validacoes/lojaValidation');
const  Validation  = require('express-validation');
const { PedidoValidation } = require('../../../controllers/validacoes/pedidoValidation');
const auth = require('../../auth');

const pedidoController = new PedidoController();

// ADMIN
router.get('/admin', auth.required, LojaValidation.admin, pedidoController.indexAdmin);
router.get('/admin/:id', auth.required, LojaValidation.admin, pedidoController.showAdmin);

router.delete('/admin/:id', auth.required, LojaValidation.admin, pedidoController.removeAdmin);

// -- carrinho
router.get('/admin/:id/carrinho', auth.required, LojaValidation.admin, pedidoController.showCarrinhoPedidoAdmin);

// -- entrega


// -- pagamento


//CLIENTE
router.get('/', auth.required, pedidoController.index);
router.get('/:id', auth.required, pedidoController.show);

router.post('/:id', auth.required, pedidoController.store);
router.delete('/:id', auth.required, pedidoController.remove);

// -- carrinho
router.get('/:id/carrinho', auth.required, pedidoController.showCarrinho);

// -- entrega


// -- pagamento


module.exports = router;