/* global window */
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';

import feathersBehavior from 'can-connect-feathers';
import feathersClient from './feathers';
import superModel from './super-model';

import signupAlgebra from './algebras/id-comparator';

var Signup = DefineMap.extend('Signup', {
  _id: '*',
  email: 'string',
  password: 'string'
});

Signup.List = DefineList.extend({
  '*': Signup
});

Signup.connection = superModel([feathersBehavior], {
  parseInstanceProp: 'data',
  feathersService: feathersClient.service('/signup'),
  Map: Signup,
  List: Signup.List,
  name: 'signup',
  algebra: signupAlgebra
});
Signup.algebra = signupAlgebra;

export default Signup;
