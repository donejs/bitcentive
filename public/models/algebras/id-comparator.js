/**
 * Most models use a simple "_id" comparator algebra. As soon as a model
 * needs a more complex algebra, create a new algebra file for that model.
 * Make sure to update both the model and the fixture to use the new algebra!
 */

import set from 'can-set';

export default new set.Algebra(
  set.comparators.id("_id")
);