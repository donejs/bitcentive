import set from "can-set";
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import superMap from "can-connect/can/super-map/";

var userAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

var User = DefineMap.extend("User", {
  _id: "string",
  email: {
    type: "string"
  },
  password: {
    type: "string"
  },
  role: {
    type: "string"
  },
  accessList:{
    type: DefineList.List,
    serialize:false
  }
});

User.List = DefineList.extend({"*": User});



User.connection = superMap({
  idProp: "_id",
  Map: User,
  List: User.List,
  url: "/api/users",
  name: "users",
  algebra: userAlgebra
});

User.algebra = userAlgebra;

export default User;
