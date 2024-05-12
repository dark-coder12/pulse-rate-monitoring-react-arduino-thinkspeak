#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

#define buzzerPin D1
#define LEDPin D2

const char *ssid = "NARDO";
const char *password = "03004182754";
const int pulseSensorPin = A0;
int beatThreshold = 600;
int updateInterval = 1000;

const char *mqttBroker = "mqtt3.thingspeak.com";
const int mqttPort = 1883;
const char *mqttUsername = "Ni0NIxAMKRAEBTg1FDMdDAA";
const char *mqttPassword = "LHFuLEcFHDMKkg9tuqeeyAu3";
const char *mqttClientId = "Ni0NIxAMKRAEBTg1FDMdDAA";
const char *mqttChannelID = "channels/2525383/publish/field/field1";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastBeatTime;
unsigned long lastBeatDuration;

ESP8266WebServer server(80); // Initialize web server on port 80

void setup() {
    Serial.begin(115200);
    pinMode(buzzerPin, OUTPUT);
    pinMode(LEDPin, OUTPUT);

    // Connect to WiFi
    WiFi.begin(ssid, password);
    Serial.println("Connecting to WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        Serial.println("Connecting...");
    }
    Serial.println("Connected to WiFi");

    // Initialize MQTT client
    mqttClient.setServer(mqttBroker, mqttPort);
    mqttClient.setClient(espClient);

    // Setup web server routes
    server.on("/buzzer", handleBuzzerCommand);

    // Start web server
    server.begin();
}

void loop() {
    server.handleClient(); // Handle web server requests
    
    if (!mqttClient.connected()) {
        reconnectMQTT(); // Reconnect MQTT client if not connected
    }

    if (WiFi.status() == WL_CONNECTED) {

        int signal = analogRead(pulseSensorPin);
        
        digitalWrite(buzzerPin , LOW);

        Serial.print("analog signal:");
        Serial.println(signal);

        
            if (millis() - lastBeatTime >= 200) {
                lastBeatTime = millis();
                int beatDuration = lastBeatTime - lastBeatDuration;
                lastBeatDuration = lastBeatTime;
                int heartRate = 60000 / beatDuration;
                Serial.print("before logic:");
                Serial.println(heartRate);
                heartRate *= 1.5 * (signal / 1023.0);
                
                Serial.print("Heart Rate: ");
                
                Serial.println(heartRate);
                
                if (mqttClient.connect(mqttClientId, mqttUsername, mqttPassword)) {
                  
                  if (heartRate < 50){
                      heartRate = 0;
                   
                      Serial.print("Heart Rate Sent: ");
                
                      Serial.println(heartRate);
                  }
                  
                    String payload = String(heartRate);
                    payload = "field1=" + payload;
                    mqttClient.publish("channels/2525383/publish", ("field1=" + String(heartRate)).c_str(), true);
                    Serial.println("Data sent to ThingSpeak");
                    Serial.println(WiFi.localIP());
                  
                }
            
        } else{
       
          digitalWrite(buzzerPin , LOW);
        }
        delay(updateInterval);
    } else {
        Serial.println("WiFi Disconnected, reconnecting...");
        WiFi.begin(ssid, password);
        while (WiFi.status() != WL_CONNECTED) {
            delay(1000);
            Serial.println("Connecting...");
        }
        Serial.println("Connected to WiFi");
    }
}

void handleBuzzerCommand() {
    if (server.method() == HTTP_POST) {
        StaticJsonDocument<200> doc;
        DeserializationError error = deserializeJson(doc, server.arg("plain"));
        
        if (error) {
            server.send(400, "text/plain", "Failed to parse JSON");
            return;
        }
        
        const char* command = doc["command"];
        
        if (strcmp(command, "on") == 0) {
            digitalWrite(buzzerPin, HIGH);
            digitalWrite(LEDPin , HIGH);
            delay(1000);
            Serial.println("Buzzer is ringing");
            server.send(200, "text/plain", "Buzzer turned on");
        } else if (strcmp(command, "off") == 0) {
            digitalWrite(buzzerPin, LOW);
            digitalWrite(LEDPin, LOW);
            server.send(200, "text/plain", "Buzzer turned off");
        } else {
            server.send(400, "text/plain", "Invalid command");
        }
    } else {
        server.send(405, "text/plain", "Method Not Allowed");
    }
}


void reconnectMQTT() {
    while (!mqttClient.connected()) {
        Serial.println("Attempting MQTT connection...");
        if (mqttClient.connect(mqttClientId, mqttUsername, mqttPassword)) {
            Serial.println("Connected to MQTT broker");
        } else {
            Serial.print("Failed to connect to MQTT broker, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" Retrying in 5 seconds...");
            delay(5000);
        }
    }
}