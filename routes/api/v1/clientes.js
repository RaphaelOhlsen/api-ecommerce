import { Router } from 'express';

import ClienteController from '../../../controllers/ClienteController';
import { LojaValidation } from '../../../controllers/validacoes/lojaValidation';
import { ClienteValidation } from '../../../controllers/validacoes/     clienteValidation';
import Validation from 'express-validation';
import auth from '../../auth';

const router = new Router();
const clienteController = new ClienteController();

//Admin
router.get('/', auth.required, LojaValidation.admin, clienteController.index);
// router.get('/search/:search/pedidos', 
//   auth.required, LojaValidation.admin, clienteController.searchPedidos);
router.get('/search/:search', 
  auth.required, LojaValidation.admin, clienteController.search);
router.get('/admin/:id',
auth.required, LojaValidation.admin, clienteController.showAdmin);
// router.get('/admin/:id/:pedidos',
// auth.required, LojaValidation.admin, clienteController.showPedidosCliente);

router.put('/admin/:id',
auth.required, LojaValidation.admin, clienteController.updateAdmin);

//Cliente
router.get('/:id', auth.required, clienteController.show);

router.post('/:id', clienteController.store);
router.put('/:id', auth.required, clienteController.update);
router.delete('/:id', auth.required, clienteController.remove);

export default router;