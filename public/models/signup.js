import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superModel from '../lib/super-model';
import algebra from './algebras';

export const Signup = DefineMap.extend('Signup', {
  _id: '*',
  email: 'string',
  password: 'string'
});

Signup.List = DefineList.extend({
  '#': Signup
});

export const signupConnection = superModel({
  parseInstanceProp: 'data',
  url: '/signup',
  Map: Signup,
  List: Signup.List,
  name: 'signup',
  algebra
});

Signup.algebra = algebra;

export default Signup;
