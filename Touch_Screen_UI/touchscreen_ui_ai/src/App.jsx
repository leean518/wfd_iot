import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";
import MqttComponent from 'components/mqtt/mqttComponent';
import MqttContext from './components/mqtt/MqttContext';

function App() {
  const [mqttClient, setMqttClient] = useState(null);

  useEffect(() => {
        const brokerUrl = 'mqtt://192.168.8.210:1884'; // WebSocket URL for the broker
        const options = {
            clientId: 'mqttx_' + Math.random().toString(16).substring(2, 8),
            username: 'smartmqtt',
            password: 'HokieDVE',
        };

        const client = MqttComponent.connectToBroker(brokerUrl, options);
        setMqttClient(client);

        // Example of publishing a message
        MqttComponent.publishMessage(client, 'test/topic', 'Hello MQTT');

        // Example of subscribing to a topic
        MqttComponent.subscribeToTopic(client, 'test/topic', (message) => {
            console.log('Received message:', message);
        });

        // Cleanup on unmount
        return () => {
            if (client) {
                client.end();
            }
        };
    }, []);

  return (
    <MqttContext.Provider value={mqttClient}>
      <Router>
        <Routes />
      </Router>
    </MqttContext.Provider>
  );
}

export default App;
