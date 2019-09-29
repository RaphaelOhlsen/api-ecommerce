import Joi from 'joi';

const EntregaValidation = {
  show: {
    paramas: {
      id: Joi.string().alphanum(24).required()
    },
    query: {
      loja: Joi.string().alphanum(24).required()
    }
  },
  update: {
    body: {
      situacao: Joi.string().optional(),
      codigoRastreamento: Joi.string().optional()
    },
    query: {
      loja: Joi.string().alphanum(24).required()
    },
    paramas: {
      id: Joi.string().alphanum(24).required()
    }
  },
  calcular: {
    body: {
      cep: Joi.string().required(),
      carrinho: Joi.array().items(Joi.object({
        produto: Joi.string().alphanum(24).required(),
        variacao: Joi.string().alphanum(24).required(),
        precoUnitario: Joi.number().required(),
        quantidade: Joi.number().required()
      })).required()
    }
  }
}

module.exports = { EntregaValidation };