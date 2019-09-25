import Joi from 'joi';

const PedidoValidation = {
  indexAdmin: {
    query: {
      offset: Joi.number().required(),
      limit: Joi.number().required(),
      loja: Joi.string().alphanum().length(24).required(),
    }
  },
  showAdmin: {
    query: { 
      loja: Joi.string().alphanum().length(24).required()
    },
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  removeAdmin: {
    query: { 
      loja: Joi.string().alphanum().length(24).required()
    },
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  showCarrinhoPedidoAdmin: {
    query: { 
      loja: Joi.string().alphanum().length(24).required()
    },
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  index: {
    query: {
      offset: Joi.number().required(),
      limit: Joi.number().required(),
      loja: Joi.string().alphanum().length(24).required(),
    }
  },
  show: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  remove: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  showCarrinhoPedido: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  store: {
    body: {
      carrinho: Joi.array().items(Joi.object({
        produto: Joi.string().alphanum().length(24).required(),
        variacao: Joi.string().alphanum().length(24).required(),
        precoUnitario: Joi.number().required(),
        quantidade: Joi.number().required()
      })).required(),
      pagamento: Joi.object({
        valor: Joi.number().required(),
        forma: Joi.string().required()
      }).required(),
      entrega: Joi.object({
        custo: Joi.number().required(),
        prazo: Joi.number().required()
      }).required(),
    },
    query: {
      loja: Joi.string().alphanum().length(24).required()
    }
  }

}

module.exports = { PedidoValidation };