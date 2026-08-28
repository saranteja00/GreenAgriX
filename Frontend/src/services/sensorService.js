// ─── Sensor Service ───────────────────────────────────────────────────────────
// Manages real-time telemetry from farm IoT nodes, connection states, and battery/signal status

export const SENSOR_NODES_DATA = [
  {
    id: 'node_01',
    name: 'Sensor Node 1 — Plot A (Wheat)',
    type: 'Multi-Depth Soil & Climate Probe',
    location: 'Plot A North, 19.9975° N, 73.7898° E',
    soilMoisture: 32,
    soilTemp: 28.2,
    airTemp: 31.4,
    humidity: 68,
    battery: 94,
    signalDbm: -68, // Good RSSI
    signalQuality: 'Strong (4G LTE)',
    status: 'online',
    lastPing: '2 mins ago',
    depthReadings: [
      { depth: '15 cm (Topsoil)', moisture: 30 },
      { depth: '30 cm (Root Zone)', moisture: 34 },
      { depth: '60 cm (Subsoil)', moisture: 42 },
    ],
  },
  {
    id: 'node_02',
    name: 'Sensor Node 2 — Plot B (Tomato)',
    type: 'Drip Flow & Soil Moisture Sensor',
    location: 'Plot B South, 19.9980° N, 73.7910° E',
    soilMoisture: 48,
    soilTemp: 27.5,
    airTemp: 31.2,
    humidity: 70,
    battery: 88,
    signalDbm: -72,
    signalQuality: 'Strong',
    status: 'online',
    lastPing: '3 mins ago',
    depthReadings: [
      { depth: '15 cm (Topsoil)', moisture: 46 },
      { depth: '30 cm (Root Zone)', moisture: 50 },
      { depth: '60 cm (Subsoil)', moisture: 54 },
    ],
  },
];

export const sensorService = {
  getPrimarySensorReading(isOnline = true) {
    const base = SENSOR_NODES_DATA[0];
    if (!isOnline) {
      return {
        ...base,
        status: 'offline',
        lastPing: '18 mins ago (Connection lost)',
        errorMsg: 'Gateway timed out. Sensor data may be delayed.',
      };
    }
    return {
      ...base,
      status: 'online',
      lastPing: 'Just now',
    };
  },

  getAllNodes() {
    return [...SENSOR_NODES_DATA];
  },
};
