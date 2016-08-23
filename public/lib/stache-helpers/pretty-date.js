import stache from "can-stache";
import moment from "moment";

stache.registerHelper("prettyDate", function(date){
  return moment.utc(date).format("MMMM YYYY");
});
