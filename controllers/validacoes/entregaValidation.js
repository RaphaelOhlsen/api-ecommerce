import Joi from 'joi';

const EntregaValidation = {
  show: {
    paramas: {
      id: Joi.string().alphanum(24).required()
    },
    query: {
      loja: Joi.string().alphanum(24).required()
    }
  }
}

module.exports = { EntregaValidation};