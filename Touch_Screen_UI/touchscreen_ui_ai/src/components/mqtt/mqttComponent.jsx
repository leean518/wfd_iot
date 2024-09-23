import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MqttComponent = () => {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Connect to the MQTT broker
    const mqttClient = mqtt.connect('ws://192.168.8.210:1883', {
      username: 'smartmqtt',
      password: 'HokieDVE'
    });
    setClient(mqttClient);

    // Handle incoming messages
    mqttClient.on('message', (topic, message) => {
      console.log(`Received message: ${message.toString()}`);
      setMessages((prevMessages) => [...prevMessages, message.toString()]);
    });

    // Cleanup on component unmount
    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <div>
      <h1>MQTT Messages</h1>
      <button onClick={() => subscribeToTopic(client, 'test/topic')}>Subscribe to test/topic</button>
      <button onClick={() => publishToTopic(client, 'test/topic', 'Hello MQTT!')}>Publish to test/topic</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export const subscribeToTopic = (client, topic) => {
  if (client) {
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
      } else {
        console.error(`Failed to subscribe to ${topic}:`, err);
      }
    });
  }
};

export const publishToTopic = (client, topic, message) => {
  if (client) {
    client.publish(topic, message, (err) => {
      if (!err) {
        console.log(`Published message to ${topic}`);
      } else {
        console.error(`Failed to publish message to ${topic}:`, err);
      }
    });
  }
};

export default MqttComponent;
