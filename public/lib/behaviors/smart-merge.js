import canMap from 'can-connect/can/map/map';
import smartMerge from 'can-connect/helpers/map-deep-merge';
import canBatch from 'can-event/batch/batch';

export default {
  updatedInstance: function(instance, props){
    smartMerge( instance, props );
    canMap.callbackInstanceEvents('updated', instance);
  },
  updatedList: function(list, listData){
  	canBatch.start();
    smartMerge( list, listData.data );
    canBatch.stop();
  }
}
