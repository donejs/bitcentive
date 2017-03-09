/**
 * @module {can-set/Algebra} bitcentive/models/algebra algebra
 * @parent bitcentive.clientModels
 *
 * A `can-set` algebra that is used for all models
 *
 * Configuration:
 *   - `_id` id property
 *   - `$sort` custom sort
 *   - `$populate` is ignored
 */

import set from 'can-set';
import moment from "moment";

export default new set.Algebra(
  set.comparators.id("_id"),
  set.comparators.sort("$sort", function($sort, cm1, cm2){
    if($sort.date) {
      if(parseInt($sort.date, 10) === 1) {
        return moment(cm1.date).toDate() - moment(cm2.date).toDate();
      }
      return moment(cm2.date).toDate() - moment(cm1.date).toDate();
    }
    throw "can't sort that way";
  }),
  {
    "$populate": function(){
      return true;
    },
    "token": function(){
      // token is added by feathers
      return true;
    }
  }
);
