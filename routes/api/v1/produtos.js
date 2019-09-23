const router = require('express').Router();

import ProdutoController from '../../../controllers/ProdutoController';

import auth from '../../auth';
import Validation from 'express-validation';
import { ProdutoValidation } from '../../../controllers/validacoes/produtoValidation';
import { LojaValidation } from '../../../controllers/validacoes/lojaValidation';
const upload = require('../../../config/multer');

const produtoController = new ProdutoController();

// ADMIN
router.post('/', auth.required, LojaValidation.admin, Validation(ProdutoValidation.store), produtoController.store);
router.put('/:id', auth.required, LojaValidation.admin,Validation(ProdutoValidation.update),  produtoController.update);
router.put('/images/:id', auth.required, LojaValidation.admin, Validation(ProdutoValidation.updateImages) ,upload.array('files', 4), produtoController.updateImages);
router.delete('/:id', auth.required, LojaValidation.admin, Validation(ProdutoValidation.remove), produtoController.remove);

// CLIENTE/VISITANTES
router.get('/', Validation(ProdutoValidation.index),produtoController.index);
router.get('/disponiveis', Validation(ProdutoValidation.indexDisponiveis), produtoController.indexDisponiveis);
router.get('/search/:search', Validation(ProdutoValidation.search), produtoController.search);
router.get('/:id', Validation(ProdutoValidation.show), produtoController.show);

// VARIACOES
router.get('/:id/variacoes', Validation(ProdutoValidation.showVariacoes), produtoController.showVariacoes);

// AVALIACOES
router.get('/:id/avaliacoes', Validation(ProdutoValidation.showAvaliacoes), produtoController.showAvaliacoes);


module.exports = router;