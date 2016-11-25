import QUnit from 'steal-qunit';
import ContributionMonth from './contribution-month';
import moment from 'moment';

import OSProject from './os-project';
import ClientProject from './client-project';
import MonthlyClientProjectOSProject from './monthly-client-projects-os-project';
import Contributor from './contributor';
import MonthlyContributions from './monthly-contributions';
import MonthlyOSProject from './monthly-os-project';
import MonthlyClientProject from './monthly-client-project';

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

  let monthlyClientProjectOSProject01 = new MonthlyClientProjectOSProject( {
    osProjectRef: osProject01
  } );
  let monthlyClientProjectOSProject02 = new MonthlyClientProjectOSProject( {
    osProjectRef: osProject02
  } );
  let monthlyClientProjectOSProjects = new MonthlyClientProjectOSProject.List();
  monthlyClientProjectOSProjects.push( monthlyClientProjectOSProject01 );
  monthlyClientProjectOSProjects.push( monthlyClientProjectOSProject02 );

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
  ok( contributionMonth.monthlyClientProjects[ 1 ].monthlyClientProjectOSProjects[ 0 ].osProjectRef.value.name === 'DoneJS',
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
