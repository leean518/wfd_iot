import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";
import MqttComponent from 'components/mqtt/mqttComponent';
import MqttContext from './components/mqtt/MqttContext';

function App() {
  const [mqttClient, setMqttClient] = useState(null);
  const [dictionary, setDictionary] = useState({
    'primary_intake/intake_pump': false,
    'primary_intake/outtake_pump': false,
    'grit_chamber/outtake_pump': false,
    'chlorination/outtake_pump': false,
    'dechlorination/outtake_pump': false,
    'acid_solution/outtake_pump': false,
    'base_solution/outtake_pump': false,
  });

  // Function to get the definition of a word
  const getState = (word) => {
    return dictionary[word];
  };

  // Function to update the dictionary
  const updateState= (key, value) => {
    setDictionary((prevDictionary) => ({
      ...prevDictionary,
      [key]: value,
    }));
  };

  function handleSwitches(message){
    if (message === "Turn on"){
      updateState('primary_intake/intake_pump', true);
      const switchElement = document.getElementById('primary_intake/intake_pump');
      if (switchElement !== null){
        switchElement.switchState(true);
      }
        
    }
    else if (message === "Turn off") {
      updateState('primary_intake/intake_pump', false);
      const switchElement = document.getElementById('primary_intake/intake_pump');
      if (switchElement !== null){
        switchElement.switchState(false);
      }
    }
    
  }
  useEffect(() => {
        const brokerUrl = 'mqtt://192.168.8.210:1884'; // WebSocket URL for the broker
        const options = {
            clientId: 'mqttx_' + Math.random().toString(16).substring(2, 8),
            username: 'smartmqtt',
            password: 'HokieDVE',
        };
        /*const brokerUrl = 'ws://broker.emqx.io:8083/mqtt'; // WebSocket URL for the broker
        const options = {
            clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
            username: 'emqx_test',
            password: 'emqx_test',
        };*/

        const client = MqttComponent.connectToBroker(brokerUrl, options);
        setMqttClient(client);

        // Example of publishing a message
        MqttComponent.publishMessage(client, 'test/topic', 'Hello MQTT');

        // Example of subscribing to a topic
        MqttComponent.subscribeToTopic(client, 'test/topic', (message) => {
            console.log('Received message:', message);
        });
        MqttComponent.subscribeToTopic(client, 'primary/intake_pump', (message) => handleSwitches(message, 'primary/intake_pump'));
        MqttComponent.subscribeToTopic(client, 'primary/outtake_pump', (message) => handleSwitches(message, 'primary/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'grit_chamber/outtake_pump', (message) => handleSwitches(message, 'grit_chamber/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'chlorination/outtake_pump', (message) => handleSwitches(message, 'chlorination/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'dechlorination/outtake_pump', (message) => handleSwitches(message, 'dechlorination/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'acid_solution/outtake_pump', (message) => handleSwitches(message, 'acid_solution/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'base_solution/outtake_pump', (message) => handleSwitches(message, 'base_solution/outtake_pump'));
       // Cleanup on unmount
        return () => {
            if (client) {
                client.end();
            }
        };
    }, []);

  return (
  <MqttContext.Provider value={{ mqttClient, getState, updateState }}>
    <Router>
      <Routes />
    </Router>
  </MqttContext.Provider>

  );
}

export default App;
