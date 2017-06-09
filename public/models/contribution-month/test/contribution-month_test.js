import QUnit from 'steal-qunit';
import ContributionMonth from '../contribution-month';
import moment from 'moment';

import OSProject from '../../os-project';
import ClientProject from '../../client-project';
import MonthlyClientProjectOsProjectList from '../monthly-client-project-os-project-list';
import Contributor from '../../contributor';
import MonthlyContribution from '../monthly-contribution';
import MonthlyOSProject from '../monthly-os-project';
import MonthlyClientProject from '../monthly-client-project';
import fixture from 'can-fixture';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';

QUnit.module( 'models/contribution-month', {
	setup: function(){
		localStorage.clear();
		// Reset fixture store before every test:
		store.reset();
	}
});


QUnit.test("ContributionMonth.List should have getPointTotalForOSProject method", function(){

	const points = new ContributionMonth.List([{
		monthlyContributions: [
			{
				"points": 10,
				"description": "Fixed an issue with DELETE sending payload",
				"osProjectRef": "57bc79e3b6a4d67111f6270b",
				"contributorRef": "57be04cbde5451d4b88e4cf1",
				"_id": "57c056bf244e90090e7e5420"
			},
			{
				"points": 5,
				"description": "Fixed an issue with DELETE sending payload",
				"osProjectRef": "sapougsadgsadoigaspi",
				"contributorRef": "57be04cbde5451d4b88e4cf1",
				"_id": "57c056bf244e90090e7e5420"
			}
		]
	},{
    monthlyContributions: [
      {
        "points": 10,
        "description": "Fixed an issue with DELETE sending payload",
        "osProjectRef": "aihfaipsfsipg",
        "contributorRef": "57be04cbde5451d4b88e4cf1",
        "_id": "57c056bf244e90090e7e5420"
      },
      {
        "points": 5,
        "description": "Fixed an issue with DELETE sending payload",
        "osProjectRef": "57bc79e3b6a4d67111f6270b",
        "contributorRef": "57be04cbde5451d4b88e4cf1",
        "_id": "57c056bf244e90090e7e5420"
      }
    ]
  }]).getPointTotalForOSProject("57bc79e3b6a4d67111f6270b");

	QUnit.equal(points, 16);

});

QUnit.test( "ContributionMonth basic test", function() {

  let contributionMonth = new ContributionMonth( {
    _id: 1,
    date: moment().add( -1, 'months' ).startOf( 'month' ).toDate(),
    monthlyOSProjects: [],
    monthlyClientProjects: [],
    monthlyContributions: []
  } );

  ok( contributionMonth.monthlyOSProjects instanceof MonthlyOSProject.List,
    "monthlyOSProjects was made and is a MonthlyOSProject.List" );
  ok( contributionMonth.monthlyClientProjects instanceof MonthlyClientProject.List,
    "monthlyClientProjects was made and is a MonthlyClientProject.List" );
  ok( contributionMonth.monthlyContributions instanceof MonthlyContribution.List,
    "monthlyContributions was made and is a MonthlyContribution.List" );
} );

QUnit.test( "Can create ContributionMonth from scratch", function() {

  let osProject01 = new OSProject( {
    _id: 1,
    name: "DoneJS"
  } );

  let osProject02 = new OSProject( {
    _id: 2,
    name: "CanJS"
  } );

  let clientProject01 = new ClientProject( {
    _id: 3,
    name: "Cool Project"
  } );

  let clientProject02 = new ClientProject( {
    _id: 4,
    name: "Something Awesome"
  } );

  let contributor01 = new Contributor( {
    _id: 5,
    name: "John",
    email: "john@bitovi.com",
    active: true
  } );

  let monthlyOSProject01 = new MonthlyOSProject( {
    significance: 0,
    commissioned: false,
    osProjectRef: osProject01
  } );

  let monthlyOSProject02 = new MonthlyOSProject( {
    significance: 1,
    commissioned: true,
    osProjectRef: osProject02
  } );

  let monthlyClientProjectOSProjects = new MonthlyClientProjectOsProjectList([
    osProject01,
    osProject02
  ]);

  let monthlyClientProject01 = new MonthlyClientProject( {
    clientProjectRef: clientProject01,
    hours: 8,
    monthlyClientProjectOSProjects: monthlyClientProjectOSProjects
  } );
  monthlyClientProjectOSProjects.pop();
  let monthlyClientProject02 = new MonthlyClientProject( {
    clientProjectRef: clientProject02,
    hours: 16,
    monthlyClientProjectOSProjects: monthlyClientProjectOSProjects
  } );
  let monthlyClientProjects = new MonthlyClientProject.List();
  monthlyClientProjects.push( monthlyClientProject01 );
  monthlyClientProjects.push( monthlyClientProject02 );

  let monthlyContribution01 = new MonthlyContribution( {
    contributorRef: contributor01,
    osProjectRef: osProject01,
    description: "Did some stuff",
    points: 1
  } );
  let monthlyContributions = new MonthlyContribution.List();
  monthlyContributions.push( monthlyContribution01 );

  let contributionMonth = new ContributionMonth( {
    _id: 1,
    date: moment().add( -1, 'months' ).startOf( 'month' ).toDate(),
    monthlyOSProjects: [
      monthlyOSProject01,
      monthlyOSProject02
    ],
    monthlyClientProjects: monthlyClientProjects,
    monthlyContributions: monthlyContributions
  } );

  ok( contributionMonth.monthlyOSProjects[ 0 ].osProjectRef.value.name === 'DoneJS',
    "monthlyOSProject was added with osProjectRef" );
  ok( contributionMonth.monthlyClientProjects[ 1 ].clientProjectRef.value.name === "Something Awesome",
    "monthlyClientProjects was added with clientProjectRef" );
  ok( contributionMonth.monthlyClientProjects[ 1 ].monthlyClientProjectOSProjects[ 0 ].value.name === 'DoneJS',
    "monthlyClientProjects was added with osProjects and osProjectRef" );
} );

QUnit.test( "Cannot set ContributionMonth startRate or endRate to undefined", () => {
  let contributionMonth = new ContributionMonth( {
    _id: 1,
    date: moment().add( -1, 'months' ).startOf( 'month' ).toDate()
  } );

  ok(contributionMonth.startRate > 0, 'startRate has positive default');
  ok(contributionMonth.endRate > 0, 'endRate has positive default');

  contributionMonth.startRate = undefined;
  contributionMonth.startRate = null;
  ok(contributionMonth.startRate, 'cannot set startRate to undefined');

  contributionMonth.startRate = -2;
  strictEqual(contributionMonth.startRate, -2,  'can set startRate to negative number');

  contributionMonth.startRate = 0;
  strictEqual(contributionMonth.startRate, 0,  'can set startRate to zero');

  contributionMonth.endRate = undefined;
  contributionMonth.endRate = null;
  ok(contributionMonth.endRate, 'cannot set endRate to undefined');
});

QUnit.test( "Can set ContributionMonth monthlyOSProjects list", function() {

  let contributionMonth = new ContributionMonth( {
    _id: 1,
    date: moment().add( -1, 'months' ).startOf( 'month' ).toDate()
  } );

  let osProject01 = new OSProject( {
    _id: 1,
    name: "DoneJS"
  } );

  let osProject02 = new OSProject( {
    _id: 2,
    name: "CanJS"
  } );

  let monthlyOSProject01 = new MonthlyOSProject( {
    significance: 0,
    commissioned: false,
    osProjectRef: osProject01
  } );

  let monthlyOSProject02 = new MonthlyOSProject( {
    significance: 1,
    commissioned: true,
    osProjectRef: osProject02
  } );

  let monthlyOSProjectsList = new MonthlyOSProject.List();
  monthlyOSProjectsList.push( monthlyOSProject01 );
  monthlyOSProjectsList.push( monthlyOSProject02 );

  contributionMonth.monthlyOSProjects = monthlyOSProjectsList;

  ok( contributionMonth.monthlyOSProjects[ 0 ] === monthlyOSProject01,
    "First contributionMonth.monthlyOSProjects deep equals monthlyOSProject01" );

  ok( contributionMonth.monthlyOSProjects[ 0 ].contributionMonth === contributionMonth,
    "Setting monthlyOSProjects sets each of their contributionMonth to this one" );
} );

QUnit.test( "Can add and remove a monthlyOSProject", function() {
  let contributionMonth = new ContributionMonth( {
    date: moment().add( -1, 'months' ).startOf( 'month' ).toDate(),
    monthlyOSProjects: new MonthlyOSProject.List(),
    monthlyClientProjects: new MonthlyClientProject.List()
  } );

  let osProject01 = new OSProject( {
    _id: 1,
    name: "DoneJS"
  } );

  let oldSave = ContributionMonth.prototype.save;

  ContributionMonth.prototype.save = function () {
    ok( contributionMonth.monthlyOSProjects[ 0 ].contributionMonth === contributionMonth,
      "monthlyOSProject was added and had it's contributionMonth set" );
    ok( contributionMonth.monthlyOSProjects.length === 1,
      "monthlyOSProject was added" );
    return Promise.resolve();
  };
  let monthlyOSProject = contributionMonth.addNewMonthlyOSProject( osProject01 );

  ContributionMonth.prototype.save = function () {
    ok( contributionMonth.monthlyOSProjects.length === 0,
      "monthlyOSProject was removed" );
    return Promise.resolve();
  };
  monthlyOSProject.remove();

  ContributionMonth.prototype.save = oldSave;
} );

QUnit.test( "Calculations: OS project royalty pot totals", function() {
  let contributionMonth = new ContributionMonth( {
    date: moment().add( -1, "months" ).startOf( "month" ).toDate(),
    monthlyOSProjects: new MonthlyOSProject.List( [
      { significance: 10, commissioned: true, osProjectRef: "1-CanJS" },
      { significance: 30, commissioned: true, osProjectRef: "2-DoneJS" },
      { significance: 30, commissioned: false, osProjectRef: "3-StealJS" }
    ] ),
    monthlyClientProjects: new MonthlyClientProject.List( [ {
      "hours": 100,
      "clientProjectRef": "1-Levis",
      "monthlyClientProjectsOSProjects": [ "1-CanJS" ]
    } , {
      "hours": 100,
      "clientProjectRef": "2-Apple",
      "monthlyClientProjectsOSProjects": [ "1-CanJS", "2-DoneJS" ]
    } , {
      "hours": 200,
      "clientProjectRef": "3-Walmart",
      "monthlyClientProjectsOSProjects": [ "1-CanJS", "2-DoneJS", "3-StealJS" ]
    } ] )
  });

  let clientProject1 = contributionMonth.calculations.clientProjects[ "1-Levis" ];
  QUnit.equal( clientProject1.totalSignificance, 10, "total significance for the first client project" );

  // rate = 4 - 2 * (usedCommissionedSignificance / totalCommissionedSignificance)
  QUnit.equal( clientProject1.rate, 3.5, "rate for the first client project");

  // total = (rate * hours)
  QUnit.equal( clientProject1.totalAmount, 350, "total amount for the first client project" );

  let clientProject2 = contributionMonth.calculations.clientProjects[ "2-Apple" ];
  QUnit.equal( clientProject2.totalSignificance, 40, "total significance for the 2nd client project" );
  QUnit.equal( clientProject2.rate, 2, "rate for the 2nd client project" );
  QUnit.equal( clientProject2.totalAmount, 200, "total amount for the 2nd client project" );

  let clientProject3 = contributionMonth.calculations.clientProjects[ "3-Walmart" ];
  QUnit.equal( clientProject3.totalSignificance, 70, "total significance for the 3rd client project" );
  QUnit.equal( clientProject3.rate, 2, "rate for the 3rd client project" );
  QUnit.equal( clientProject3.totalAmount, 400, "total amount for the 3rd client project" );

  QUnit.equal( contributionMonth.calculations.totalDollarForAllClientProjects, 950, "total amount for all client projects" );

  // Sum each client: (clientProjectCalc.totalAmount * osProject.significance / clientProjectCalc.totalSignificance)
  // (350 * 10 / 10) + (200 * 10 / 40) + (400 * 10 / 70) = 457.142857
  QUnit.equal( contributionMonth.calculations.osProjects[ "1-CanJS" ].toFixed( 2 ), "457.14", "final calculation for the 1st project" );
  // (0)             + (200 * 30 / 40) + (400 * 30 / 70) = 321.42857
  QUnit.equal( contributionMonth.calculations.osProjects[ "2-DoneJS" ].toFixed( 2 ), "321.43", "final calculation for the 2st project" );
  // (0)             + (0)             + (400 * 30 / 70) = 171.42857
  QUnit.equal( contributionMonth.calculations.osProjects[ "3-StealJS" ].toFixed( 2 ), "171.43", "final calculation for the uncommissioned project" );
} );

QUnit.test( "OS Projects and Client Projects are provide sorted clones", function() {
  const contributionMonth = new ContributionMonth( {
    date: moment().add( -1, "months" ).startOf( "month" ).toDate(),
    monthlyOSProjects: new MonthlyOSProject.List([
      { osProjectRef: new OSProject({ name: "C" }) },
      { osProjectRef: new OSProject({ name: "B" }) }
    ]),
    monthlyClientProjects: new MonthlyClientProject.List([
      { clientProjectRef: new ClientProject({ name: "Z" }) },
      { clientProjectRef: new ClientProject({ name: "X" }) }
    ])
  });

  const sortedProjects = contributionMonth.sortedMonthlyOSProjects;
  const sortedClients = contributionMonth.sortedMonthlyClientProjects;
  QUnit.equal(sortedProjects[0].osProjectRef.value.name, 'B');
  QUnit.equal(sortedProjects[1].osProjectRef.value.name, 'C');
  QUnit.equal(sortedClients[0].clientProjectRef.value.name, 'X');
  QUnit.equal(sortedClients[1].clientProjectRef.value.name, 'Z');
});

QUnit.test("getList of ContributionMonth", function(assert) {
	let done = assert.async();
	ContributionMonth.getList({}).then(function(contributionMonths) {

		// TODO: check if we need to test against `clientProjectRef.value`.
		QUnit.ok(contributionMonths[0].monthlyClientProjects[0].clientProjectRef._id === "1-Levis", 'contains a client project');
		var first = contributionMonths[0].monthlyOSProjects[0].osProjectRef._id,
			second = contributionMonths[0].monthlyClientProjects[0].monthlyClientProjectsOSProjects[0]._id;

		QUnit.ok(first, 'first exists');
		QUnit.ok(first === second, 'first and second are equal');

		done();
	}, function(err) {
		QUnit.ok(false, err);
	});
});

QUnit.test("make type convert able to accept instances (#23)", function() {
	var osProject = new OSProject({
		_id: "somethingCrazey",
		name: "CanJS"
	});

	var clientProject = new ClientProject({
		_id: "asl;dfal;sfj ;lakwj",
		name: "HualHound"
	});

	var contributionMonth = new ContributionMonth({
		_id: "aslkfalsjklas",
		date: 124234211310000,
		monthlyOSProjects: [{
			significance: 80,
			commissioned: true,
			osProjectRef: osProject._id,
			osProject: osProject
		}],
		monthlyClientProjects: [{
			monthlyClientProjectsOSProjects: [ osProject ],
			hours: 100,
			clientProjectRef: clientProject._id,
			clientProject: clientProject
		}]
	});

	QUnit.equal(contributionMonth.monthlyOSProjects[0].osProject.name , "CanJS");
});
