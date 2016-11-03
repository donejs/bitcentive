import io from 'socket.io-client/socket.io';
import fixtureSocket from 'can-fixture-socket';
import mockContributionMonthsService from 'bitcentive/models/fixtures/contribution-months';

// Mock socket.io server:
var mockServer = new fixtureSocket.Server( io );
mockContributionMonthsService( mockServer );
