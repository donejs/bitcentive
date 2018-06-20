import canMap from 'can-connect/can/map/map';
import smartMerge from 'can-connect/helpers/map-deep-merge';
import queues from 'can-queues';

export default {
  updatedInstance: function(instance, props){
    smartMerge( instance, props );
    canMap.callbackInstanceEvents('updated', instance);
  },
  updatedList: function(list, listData){
  	queues.batch.start();
    smartMerge( list, listData.data );
    queues.batch.stop();
  }
}
