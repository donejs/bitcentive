import QUnit from 'steal-qunit';
import OSProject from '../../os-project';
import ClientProject from '../../client-project';
import MonthlyClientProject from '../monthly-client-project';

QUnit.module('models/monthly-os-project', () => {

  QUnit.test('MonthlyClientProject basic test', function( assert ) {
    const osProject = new OSProject({ _id: 'qwe123', name: 'DoneJS' });
    const clientProject = new ClientProject({ _id: 'mxelplix12', name: 'Awesome Client' });

    const monthlyClientProject = new MonthlyClientProject({
      clientProjectRef: clientProject,
      hours: 200,
      monthlyClientProjectsOSProjects: [osProject]
    });

    assert.equal(monthlyClientProject.clientProjectRef._id, "mxelplix12", "clientProjectRef _id is correct");
    assert.equal(monthlyClientProject.clientProjectRef.value.name, "Awesome Client", "clientProjectRef name is correct");
  });

  QUnit.module('MonthlyClientProject.List', {
    beforeEach() {
      this.CLIENT_PROJECT_ID = 'mxelplix12';
      this.osProject = new OSProject({ _id: 'qwe123', name: 'DoneJS' });
      this.clientProject = new ClientProject({ _id: this.CLIENT_PROJECT_ID, name: 'Awesome Client' });

      this.monthlyClientProject = new MonthlyClientProject({
        clientProjectRef: this.clientProject,
        hours: 200,
        monthlyClientProjectsOSProjects: [this.osProject]
      });
    }
  },
  function() {

    QUnit.test(".has()", function( assert ){
      const clientProject = this.clientProject;
      const monthlyClientProject = this.monthlyClientProject;
      const monthlyClientProjectsList = new MonthlyClientProject.List([monthlyClientProject]);
      assert.ok(monthlyClientProjectsList.has( clientProject ), "has works as expected");
    });

    QUnit.test(".toggleProject()", function( assert ){
      const clientProject = this.clientProject;
      const monthlyClientProjectsList = new MonthlyClientProject.List();
      monthlyClientProjectsList.toggleProject( clientProject );
      assert.ok(monthlyClientProjectsList.has( clientProject ), "Has Project");
      monthlyClientProjectsList.toggleProject( clientProject );
      assert.notOk(monthlyClientProjectsList.has( clientProject ), "No longer Project");
    });

  });

});
