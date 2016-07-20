import fixture from "can-fixture";
import assign from "can-util/js/assign/";

// Main file that loads all model fixtures
fixture("GET /api/contribution_months", function(){

  var osProject = {
    _id: "somethingCrazey",
    name: "CanJS"
  };
  var clientProject = {
    _id: "asl;dfal;sfj ;lakwj",
    name: "HualHound"
  };

  return {
    data: [
      {
        _id: "aslkfalsjklas",
        date: 124234211310000,
        monthlyOSProjects: [{
          significance: 80,
          commissioned: true,
          osProjectId: osProject._id,
          osProject: assign({}, osProject)
        }],
        monthlyClientProjects: [{
          monthlyClientProjectsOsProjects: [{
            osProjectId: osProject._id,
            osProject: assign({}, osProject)
          }],
          hours: 100,
          clientProjectId: clientProject._id,
          clientProject: assign({}, clientProject)
        }]
      }
    ]
};
});
window.fixture = fixture;
