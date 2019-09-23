const router = require("express").Router();

const VariacaoController = require("../../../controllers/VariacaoController");

const { LojaValidation } = require("../../../controllers/validacoes/lojaValidation");
const Validation = require("express-validation");
const { VariacaoValidation } = require("../../../controllers/validacoes/variacaoValidation");
const auth = require("../../auth");
const upload = require('../../../config/multer');

const variacaoController = new VariacaoController();

// CLIENTES/VISITANTES
router.get("/", Validation(VariacaoValidation.index), variacaoController.index);
router.get("/:id", Validation(VariacaoValidation.show), variacaoController.show);

// ADMIN
router.post("/", auth.required, LojaValidation.admin, Validation(VariacaoValidation.store), variacaoController.store);
router.put('/:id', auth.required, LojaValidation.admin, Validation(VariacaoValidation.update), variacaoController.update);
router.post('/images/:id', auth.required, LojaValidation.admin, Validation(VariacaoValidation.updateImages), upload.array('files', 4), variacaoController.updateImages)
router.delete("/:id", auth.required, LojaValidation.admin, Validation(VariacaoValidation.remove), variacaoController.remove);


module.exports = router;