import connect from 'can-connect';
import feathersClient from './feathers-client';

export default connect.behavior('data/feathers', function (baseConnection) {
  var service = this.feathersService = feathersClient.service(this.url);

  return {
    getListData: function (params) {
      return service.find(params);
    },

    getData: function (params) {
      var id = null;
      if (typeof params === 'string' || typeof params === 'number') {
        id = params;
        params = {};
      } else if (params && typeof params[this.idProp] !== 'undefined') {
        id = params[this.idProp];
        delete params[this.idProp];
      }
      return service.get(id, params);
    },

    createData: function (data) {
      return service.create(data);
    },

    updateData: function (instance) {
      return service.update(instance[this.idProp], instance);
    },

    destroyData: function (instance) {
      return service.remove(instance[this.idProp]);
    },

    init: function () {
      service.on('created', this.createInstance.bind(this));
      service.on('updated', this.updateInstance.bind(this));
      service.on('patched', this.updateInstance.bind(this));
      service.on('removed', this.destroyInstance.bind(this));
    }
  };
});
