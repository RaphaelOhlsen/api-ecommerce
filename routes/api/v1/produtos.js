const router = require('express').Router();
import ProdutoController from '../../../controllers/ProdutoController';

import auth from '../../auth';
import Validation from 'express-validation';
import { ProdutoValidation } from '../../../controllers/validacoes/produtovalidation';

const produtoController = new ProdutoController();

router.get('/',)

module.exports = router;