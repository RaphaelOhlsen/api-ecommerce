const router = require("express").Router();
const auth = require("../../auth");
const UsuarioController = require("../../../controllers/UsuarioController");

const usuarioController = new UsuarioController();

router.post('/login', usuarioController.login);
router.post('/resgistrar', usuarioController.store);
router.put('/', auth.required, usuarioController.update);
router.delete('/', auth.required, usuarioContoller.remove);

router.get('/recuperar-senha', usuarioController.showRecovery);
router.post('/recuperar-senha', usuario.Controller.createRecovery);
router.get('/senha-recuperada', usuarioController.showCompleteRecovery);
router.post('/senha-recuperada', usuarioController.completeRecovery);

router.get('/', auth.required, usuarioController.index);
router.get('/:id', auth.required, usuarioController.show);

module.exports = router;