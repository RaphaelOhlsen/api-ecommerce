import Router from "express";
import EntregaController from "../../../controllers/EntregaController";

import { LojaValidation } from "../../../controllers/validacoes/lojaValidation";
import  Validation from "express-validation";
import { EntregaValidation } from '../../../controllers/validacoes/entregaValidation';
import auth from "../../auth";

const entregaController = new EntregaController();
const router = new Router();

router.get('/:id', auth.required, Validation(EntregaValidation.show) ,entregaController.show);
router.put('/:id', auth.required, LojaValidation.admin, Validation(EntregaValidation.update), entregaController.update);
router.post('/calcular',Validation(EntregaValidation.calcular), entregaController.calcular);

module.exports =  router;