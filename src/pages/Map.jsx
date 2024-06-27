import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const bikeIcon = new L.Icon({
  iconUrl: '/images/bike-icon.png',
  iconSize: [25, 25],
});

const randomLocations = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.515, -0.11],
  [51.52, -0.12],
  [51.525, -0.13],
  [51.53, -0.14],
  [51.535, -0.15],
  [51.54, -0.16],
  [51.545, -0.17],
  [51.55, -0.18],
];

const MapPage = () => {
  return (
    <div className="h-screen w-full">
      <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {randomLocations.map((position, idx) => (
          <Marker key={idx} position={position} icon={bikeIcon} />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;