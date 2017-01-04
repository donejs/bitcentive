var canMap = require('can-connect/can/map/map');
var smartMerge = require('can-connect/helpers/map-deep-merge');

export default {
  updatedInstance: function(instance, props){
    smartMerge( instance, props );
    canMap.callbackInstanceEvents('updated', instance);
  }
}
