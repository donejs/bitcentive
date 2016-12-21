import connect from 'can-connect';
import hub from 'bitcentive/lib/event-hub';

const errorHandler = connect.behavior('error-handler', baseConnect => {
	const behavior = {};

	['getData', 'getListData', 'createData', 'updateData', 'destroyData'].forEach(method => {
		behavior[method] = (...args) => {
			const promise = baseConnect[method].apply(baseConnect, args);
			promise.catch(e => {
				hub.dispatch({
					type: 'alert',
					kind: 'error',
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
