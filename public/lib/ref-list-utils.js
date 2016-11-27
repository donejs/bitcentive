export const indexOfRefForModel = (refList, model, refPropertyName = 'ref') => {
  let index = -1;
  refList.forEach( (ref, i) => { // eslint-disable-line consistent-return
    if (ref[refPropertyName].id === model.id) {
      index = i;
      return false;
    }
  });
  return index;
};
