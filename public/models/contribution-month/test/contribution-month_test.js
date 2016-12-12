import QUnit from 'steal-qunit';
import ContributionMonth from '../contribution-month';
import moment from 'moment';

import OSProject from '../../os-project';
import ClientProject from '../../client-project';
import MonthlyClientProjectsOSProjectList from '../monthly-client-projects-os-project-list';
import Contributor from '../../contributor';
import MonthlyContributions from '../monthly-contributions';
import MonthlyOSProject from '../monthly-os-project';
import MonthlyClientProject from '../monthly-client-project';

QUnit.module( 'models/contribution-month' );

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
  ok( contributionMonth.monthlyContributions instanceof MonthlyContributions.List,
    "monthlyContributions was made and is a MonthlyContributions.List" );
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

  let monthlyClientProjectOSProjects = new MonthlyClientProjectsOSProjectList([
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

  let monthlyContribution01 = new MonthlyContributions( {
    contributorRef: contributor01,
    osProjectRef: osProject01,
    description: "Did some stuff",
    points: 1
  } );
  let monthlyContributions = new MonthlyContributions.List();
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

  let monthlyOSProject = contributionMonth.addNewMonthlyOSProject( osProject01 );
  ok( contributionMonth.monthlyOSProjects[ 0 ].contributionMonth === contributionMonth,
    "monthlyOSProject was added and had it's contributionMonth set" );
  ok( contributionMonth.monthlyOSProjects.length === 1,
    "monthlyOSProject was added" );
  contributionMonth.removeMonthlyOSProject( monthlyOSProject );
  ok( contributionMonth.monthlyOSProjects.length === 0,
    "monthlyOSProject was removed" );
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

  console.log('contributionMonth.calculations.osProjects', contributionMonth.calculations.osProjects);
} );
