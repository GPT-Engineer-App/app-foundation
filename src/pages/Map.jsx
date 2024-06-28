import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Bike } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const bikeIcon = new L.DivIcon({
  html: `<div style="color: darkblue; transform: scale(2);"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bike"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6l-2 3h-3l-2 3h3l2-3h3l2-3h-3z"></path><path d="M12 6V3"></path><path d="M9 6H6"></path><path d="M18 6h-3"></path></svg></div>`,
  className: '',
  iconSize: [48, 48],
});

const randomLocations = Array.from({ length: 10 }, () => ({
  position: [51.5 + (Math.random() - 0.5) * 0.1, -0.09 + (Math.random() - 0.5) * 0.1],
  info: {
    location: 'Random Location',
    charged: Math.random() > 0.5,
    lastUsed: new Date().toLocaleDateString(),
  },
}));

const MapPage = () => {
  const [selectedBike, setSelectedBike] = useState(null);

  const handleMarkerClick = (bike) => {
    setSelectedBike(bike);
  };

  const handleClose = () => {
    setSelectedBike(null);
  };

  return (
    <div className="h-screen w-full">
      <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {randomLocations.map((bike, idx) => (
          <Marker key={idx} position={bike.position} icon={bikeIcon} eventHandlers={{ click: () => handleMarkerClick(bike) }} />
        ))}
      </MapContainer>
      {selectedBike && (
        <Sheet open={!!selectedBike} onOpenChange={handleClose}>
          <SheetContent side="right">
            <Card>
              <CardHeader>
                <CardTitle>Bike Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Location:</strong> {selectedBike.info.location}</p>
                <p><strong>Charged:</strong> {selectedBike.info.charged ? <Badge variant="success">Yes</Badge> : <Badge variant="destructive">No</Badge>}</p>
                <p><strong>Last Used:</strong> {selectedBike.info.lastUsed}</p>
              </CardContent>
            </Card>
            <Button onClick={handleClose}>Close</Button>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default MapPage;