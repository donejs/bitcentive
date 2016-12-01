import connect from 'can-connect';
import hub from 'bitcentive/lib/hub';

const errorHandler = connect.behavior('error-handler', baseConnect => {
	const behavior = {};

	['getData', 'getListData', 'createData', 'updateData', 'destroyData'].forEach(method => {
		behavior[method] = (...args) => {
			const promise = baseConnect[method].apply(baseConnect, args);
			promise.catch(e => {

				// TODO: use can-event - https://github.com/donejs/bitcentive/issues/154
				hub.publish('alert', {
					type: 'error',
					title: 'Error',
					message: (e.responseJSON && e.responseJSON.message) || e.responseText || e.message
				});
			});

			return promise;
		};
	});

	return behavior;
});

export default errorHandler;