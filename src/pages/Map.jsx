import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Bike } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const bikeIcon = new L.DivIcon({
  html: `<div style="color: darkblue;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bike"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6l-2 3h-3l-2 3h3l2-3h3l2-3h-3z"></path><path d="M12 6V3"></path><path d="M9 6H6"></path><path d="M18 6h-3"></path></svg></div>`,
  className: '',
  iconSize: [24, 24],
});

const randomLocations = Array.from({ length: 10 }, () => [
  51.5 + (Math.random() - 0.5) * 0.1,
  -0.09 + (Math.random() - 0.5) * 0.1,
]);

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