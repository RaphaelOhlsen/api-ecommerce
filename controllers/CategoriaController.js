const mongoose = require('mongoose');

const Categoria = mongoose.model('Categoria');

class CategoriaController {


  //GET / index
  index(req,res,next){
    Categoria.find({ loja: req.query.loja })
    .select('_id produtos nome codigo loja')
    .then((categorias => res.send({ categorias })))
    .catch(next);
  }

  //GET /disponiveis
  indexDisponiveis(req,res,next){
    Categoria.find({ loja: req.query.loja, disponibilidade: true})
    .select('_id produtos nome codigo loja')
    .then((categorias => res.send({ categorias })))
    .catch(next);
  }

  //GET /:id show
  show(req,res,next){
    Categoria.findOne({loja: req.query.loja, _id: req.params.id})
    .select('_id produtos nome codigo loja')
    .populate(['produtos'])
    .then((categoria => res.send({ categoria })))
    .catch(next);
  }

  //POST / store
  store(req,res,next){
    const { nome, codigo } = req.body;
    const { loja } = req.query;

    const categoria = new Categoria({ nome, codigo, loja, disponibildade: true});
    categoria.save()
    .then(() => res.send({ categoria }))
    .catch(next);
  }

  //PUT /:id update
  async update(req,res,next){
    const { nome, codigo, disponibildade, produtos } = req.body;
    try {
      const categoria = await Categoria.findById(req.params.id);

      if(nome) categoria.nome = nome;
      if(disponibilidade !== indefined) categoria.disponibilidade = disponibildade;
      if(codigo) categoria.codigo = codigo;
      if(produtos) categoria.produtos;

      await categoria.save();
      return res.send({ categoria });
    } catch(e){
        next(e);
    }
  }

  //DELETE /:id remove
  async remove(req,res,next){
    try {
      const categoria = await Categoria.findById(req.params.id);
      await categoria.remove();
      return res.send({ deletado: true });
    }catch(e){
        next(e)
    }
  }

  /**
   * PRODUTOS
   */

}

export default CategoriaController;