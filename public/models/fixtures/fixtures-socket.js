import io from 'socket.io-client/socket.io';
import fixtureSocket from 'can-fixture-socket';
import mockContributionMonths from 'bitcentive/models/fixtures/contribution-months';
import mockOsProjects from 'bitcentive/models/fixtures/os-project';
import mockClientProjects from 'bitcentive/models/fixtures/client-project';
import mockContributor from 'bitcentive/models/fixtures/contributor';

// Mock socket.io server:
console.log('Mocking socket.io server...');
var mockServer = new fixtureSocket.Server( io );

mockContributionMonths( mockServer );
mockOsProjects( mockServer );
mockClientProjects( mockServer );
mockContributor( mockServer );
