import connect from 'can-connect';

export default connect.behavior('real-time/feathers', function (baseConnection) {
	if (!this.feathersService) {
		throw new Error('In order to use feathers real-time, you must set a feathersService on the connection.')
	}

	this.feathersService.on('created', this.createInstance.bind(this));
	this.feathersService.on('updated', this.updateInstance.bind(this));
	this.feathersService.on('patched', this.updateInstance.bind(this));
	this.feathersService.on('removed', this.destroyInstance.bind(this));
});
