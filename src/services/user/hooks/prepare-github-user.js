module.exports = function(){
  return function(hook){
    return new Promise((resolve, reject) => {
      console.log(">>> ", hook.data);

      if (hook.data.github) {
        hook.data.email = hook.data.github.email;
      } else {
        if(!hook.data.password){
          return reject(new Error('Password is required.'));
        }
      }
      return resolve(hook);
    });
  };
};
