//INFO: Simple pubsub implementation from http://davidwalsh.name/pubsub-javascript
const topics = {};
const hOP = topics.hasOwnProperty;

const hub = {
	subscribe(topic, listener) {
		if(!hOP.call(topics, topic)) topics[topic] = [];

		const index = topics[topic].push(listener) - 1;

		return {
			remove() {
				topics[topic].splice(index, 1);
			}
		};
	},

	publish(topic, info) {
		if(!hOP.call(topics, topic)) return;

		topics[topic].forEach((listener) => {
			listener(info !== undefined ? info : {});
		});
	},

	topics
};

export default hub;