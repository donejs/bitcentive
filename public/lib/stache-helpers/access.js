import stache from "can-stache";

var accessControl = (item, accessProp, options) => {
  if(item.isComputed){
    item = item();
  }

  if(!item.accessList){
    return options.inverse();
  }

  if(item.accessList.indexOf(accessProp) !== -1){
    return options.fn();
  }
  return options.inverse();
};

stache.registerHelper("accessCanCreate", (item,options) => {
  return accessControl(item, "create", options);
});

stache.registerHelper("accessCanRead", (item,options) => {
  return accessControl(item, "read", options);
});

stache.registerHelper("accessCanUpdate", (item,options) => {
  return accessControl(item, "update", options);
});

stache.registerHelper("accessCanDelete", (item,options) => {
  return accessControl(item, "delete", options);
});
