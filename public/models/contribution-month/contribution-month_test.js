import './fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';

import QUnit from "steal-qunit";
import ContributionMonth from "./contribution-month/";
import MonthlyOSProject from "./contribution-month/monthly-os-project";
import ClientProject from "./client-project";
import OSProject from "./os-project";

QUnit.module("Models: ContributionMonth", {
	setup: function(){
		localStorage.clear();
		// Reset fixture store before every test:
		store.reset();
	}
});