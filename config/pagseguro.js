module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  sandbox: process.env.NODE_ENV === 'production' ? false : true,
  sandbox_email: process.env.NODE_ENV === 'production' ? null : "c47576278704541190487@sandbox.pagseguro.com.br",
  email: "raphael.ohlsen@gmail.com",
  token: "433BF048481D4FDDAB12D81F3AED67CC", 
  notificationURL: 'https://api.loja-teste.ampliee.com/v1/api/pagamentos/notificacao'
}