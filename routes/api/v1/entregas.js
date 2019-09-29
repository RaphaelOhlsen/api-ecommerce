import { Router } from 'express';
import EntregaController from '../../../controllers/EntregaController';

import { LojaValidation } from '../../../controllers/validacoes/lojaValidation';
import auth from '../../auth';

const entregaController = new EntregaController();
const router = new Router();

router.get('/:id', auth.required, entregaController.show);
router.put('/:id', auth.required, LojaValidation.adinm, entregaController.update);
router.post('/calcular'. entregaController.calcular);

export default router;