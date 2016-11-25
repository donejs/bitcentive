import set from 'can-set';

export var _idAlgebra = new set.Algebra(
  set.comparators.id('_id')
);

export default {
  _id: _idAlgebra
};
