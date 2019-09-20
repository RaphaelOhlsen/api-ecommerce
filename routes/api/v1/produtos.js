const router = require('express').Router();

import ProdutoController from '../../../controllers/ProdutoController';

import auth from '../../auth';
import Validation from 'express-validation';
import { ProdutoValidation } from '../../../controllers/validacoes/produtovalidation';
import { LojaValidation } from '../../../controllers/validacoes/lojavalidation';
const upload = require('../../../config/multer');

const produtoController = new ProdutoController();

// ADMIN
router.post('/', auth.required, LojaValidation.admin, produtoController.store);
router.put('/:id', auth.required, LojaValidation.admin, produtoController.update);
router.put('/images/:id', auth.required, LojaValidation.admin, upload.array('files', 4), produtoController.updateImages);
router.delete('/:id', auth.required, LojaValidation.admin, produtoController.remove);

// CLIENTE/VISITANTES
router.get('/', produtoController.index);
router.get('/disponiveis', produtoController.indexDisponiveis);
router.get('/search/:search', produtoController.search);
router.get('/:id', produtoController.show);

// VARIACOES

// AVALIACOES

router.get('/',)

module.exports = router;