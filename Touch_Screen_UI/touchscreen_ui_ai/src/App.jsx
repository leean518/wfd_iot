import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";
import MqttComponent from 'components/mqtt/mqttComponent';
import MqttContext from './components/mqtt/MqttContext';

function App() {
  const [mqttClient, setMqttClient] = useState(null);
  const [dictionary, setDictionary] = useState({
    'prim_chamber/intake_pump': false,
    'prim_chamber/outtake_pump': false,
    'grit_chamber/outtake_pump': false,
    'chlo_chamber/outtake_pump': false,
    'dech_chamber/outtake_pump': false,
    'acid_chamber/outtake_pump': false,
    'base_chamber/outtake_pump': false,
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

  function handleSwitches(message, mqttTopic){
    if (message === "Turn on"){
      updateState(mqttTopic, true);
      const switchElement = document.getElementById(mqttTopic);
      if (switchElement !== null){
        switchElement.switchState(true);
      }
        
    }
    else if (message === "Turn off") {
      updateState(mqttTopic, false);
      const switchElement = document.getElementById(mqttTopic);
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

        MqttComponent.subscribeToTopic(client, 'prim_chamber/intake_pump', (message) => handleSwitches(message, 'prim_chamber/intake_pump'));
        MqttComponent.subscribeToTopic(client, 'prim_chamber/outtake_pump', (message) => handleSwitches(message, 'prim_chamber/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'grit_chamber/outtake_pump', (message) => handleSwitches(message, 'grit_chamber/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'chlo_chamber/outtake_pump', (message) => handleSwitches(message, 'chlo_chamber/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'dech_chamber/outtake_pump', (message) => handleSwitches(message, 'dech_chamber/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'acid_chamber/outtake_pump', (message) => handleSwitches(message, 'acid_chamber/outtake_pump'));
        MqttComponent.subscribeToTopic(client, 'base_chamber/outtake_pump', (message) => handleSwitches(message, 'base_chamber/outtake_pump'));
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
