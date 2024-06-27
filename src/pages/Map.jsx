import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bike } from 'lucide-react';

const bikeIcon = new L.DivIcon({
  html: `<div style="color: lightblue;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bike"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6h3l-3 5h-3l-3-5h3l3-3z"></path><path d="M12 17.5h-2.5l-2-2.5h-2.5"></path><path d="M12 17.5h2.5l2-2.5h2.5"></path></svg></div>`,
  className: '',
  iconSize: [24, 24],
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
  [51.555, -0.19],
  [51.56, -0.2],
  [51.565, -0.21],
  [51.57, -0.22],
  [51.575, -0.23],
  [51.58, -0.24],
  [51.585, -0.25],
  [51.59, -0.26],
  [51.595, -0.27],
  [51.60, -0.28],
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