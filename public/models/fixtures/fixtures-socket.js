import mockServer from "./fixture-socket-server";
import mockContributionMonths from 'bitcentive/models/fixtures/contribution-months';
import mockOsProjects from 'bitcentive/models/fixtures/os-project';
import mockClientProjects from 'bitcentive/models/fixtures/client-project';
import mockContributor from 'bitcentive/models/fixtures/contributor';
import mockUser from 'bitcentive/models/fixtures/user';

mockContributionMonths( mockServer );
mockOsProjects( mockServer );
mockClientProjects( mockServer );
mockContributor( mockServer );
mockUser( mockServer );
