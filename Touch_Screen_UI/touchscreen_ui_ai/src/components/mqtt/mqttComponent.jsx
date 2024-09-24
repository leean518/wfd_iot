import mqtt from 'mqtt';

// Function to connect to the MQTT broker
export function connectToBroker(brokerUrl, options) {
    const client = mqtt.connect(brokerUrl, options);

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        alert('Connected to MQTT broker');
    });

    client.on('error', (err) => {
        console.error('Connection error: ', err);
        alert('Connection error: ' + err.message);
    });

    return client;
}

// Function to publish messages to a topic
export function publishMessage(client, topic, message) {
    client.publish(topic, message, (err) => {
        if (err) {
            console.error('Publish error: ', err);
        } else {
            console.log(`Message published to ${topic}`);
        }
    });
}

// Function to subscribe and process messages from a topic
export function subscribeToTopic(client, topic, messageHandler) {
    client.subscribe(topic, (err) => {
        if (err) {
            console.error('Subscribe error: ', err);
        } else {
            console.log(`Subscribed to ${topic}`);
        }
    });

    client.on('message', (receivedTopic, message) => {
        if (receivedTopic === topic) {
            messageHandler(message.toString());
        }
    });
}

// Default export
export default {
    connectToBroker,
    publishMessage,
    subscribeToTopic
};
