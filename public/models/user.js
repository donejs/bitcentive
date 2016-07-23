import set from "can-set";
import DefineMap from "can-define/map/";
import superMap from "can-connect/can/super-map/";

var User =  DefineMap.extend("User", {
  _id: "string",
  email: "string",
  password: "string"
});

var userAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

User.connection = superMap({
  Map: User,
  List: User.List,
  url: "/api/users",
  name: "users",
  algebra: userAlgebra
});

User.algebra = userAlgebra;

export default User;
