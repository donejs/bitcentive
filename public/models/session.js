import set from "can-set";
import DefineMap from "can-define/map/";
import superMap from "can-connect/can/super-map/";
import User from "./user";

var Session =  DefineMap.extend("Session", {
  user: User
});

var sessionAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

new Session({user: {email: "", pass: }}).save();

.destroy();

Session.connection = superMap({
  Map: Session,
  List: Session.List,
  url: "/api/users",
  name: "users",
  algebra: userAlgebra
});

Session.algebra = sessionAlgebra;

export default Session;
