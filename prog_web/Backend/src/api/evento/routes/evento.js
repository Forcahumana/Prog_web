// src/api/evento/routes/evento.js

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/eventos',
      handler: 'evento.find',
    },
    {
      method: 'GET',
      path: '/eventos/:id',
      handler: 'evento.findOne',
    },
    {
      method: 'POST',
      path: '/eventos',
      handler: 'evento.create',
    },
    {
      method: 'PUT',
      path: '/eventos/:id',
      handler: 'evento.update',
    },
    {
      method: 'DELETE',
      path: '/eventos/:id',
      handler: 'evento.delete',
    },
  ],
};