
// const router = require("express").Router();
import { Router } from "express";
const router = new Router();


const auth = require("../../auth");
const Validation = require('express-validation');
import LojaValidation from '../../../controllers/validacoes/lojaValidation';

const LojaController = require("../../../controllers/LojaController");
const lojaController = new LojaController();

router.get('/', lojaController.index);
router.get('/:id', Validation(LojaValidation.show), lojaController.show);

router.post('/', auth.required,Validation(LojaValidation.store),lojaController.store);
router.put('/:id', auth.required, LojaValidation.admin, Validation(LojaValidation.update), lojaController.update);
router.delete('/:id', auth.required, LojaValidation.admin, lojaController.remove);

module.exports = router;