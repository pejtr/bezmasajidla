import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type MapPoint = { lat: number; lng: number };

export interface MapMarker {
  setVisible(visible: boolean): void;
  remove(): void;
}

export interface MapCircle {
  remove(): void;
}

export interface MapHandle {
  setCenter(point: MapPoint): void;
  setZoom(zoom: number): void;
  addMarker(options: { position: MapPoint; title?: string; color?: string; onClick?: () => void }): MapMarker;
  addCircle(options: { center: MapPoint; radius: number; color?: string }): MapCircle;
}

interface MapViewProps {
  className?: string;
  initialCenter?: MapPoint;
  initialZoom?: number;
  onMapReady?: (map: MapHandle) => void;
}

const TILE_SIZE = 256;
const clampLat = (lat: number) => Math.max(-85.0511, Math.min(85.0511, lat));
const project = ({ lat, lng }: MapPoint, zoom: number) => {
  const scale = TILE_SIZE * 2 ** zoom;
  const sin = Math.sin((clampLat(lat) * Math.PI) / 180);
  return { x: ((lng + 180) / 360) * scale, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale };
};
const unproject = (x: number, y: number, zoom: number): MapPoint => {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  return { lat: (180 / Math.PI) * Math.atan(Math.sinh(n)), lng };
};

export function MapView({ className, initialCenter = { lat: 50.0755, lng: 14.4378 }, initialZoom = 13, onMapReady }: MapViewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [center, setCenterState] = useState(initialCenter);
  const [zoom, setZoomState] = useState(initialZoom);
  const [markers, setMarkers] = useState<Array<{ id: number; position: MapPoint; title?: string; color: string; visible: boolean; onClick?: () => void }>>([]);
  const [circles, setCircles] = useState<Array<{ id: number; center: MapPoint; radius: number; color: string }>>([]);
  const nextId = useRef(1);

  useEffect(() => {
    const map: MapHandle = {
      setCenter: (point) => setCenterState(point),
      setZoom: (value) => setZoomState(Math.max(3, Math.min(19, value))),
      addMarker: ({ position, title, color = "#1B6B45", onClick }) => {
        const id = nextId.current++;
        setMarkers((items) => [...items, { id, position, title, color, visible: true, onClick }]);
        return { setVisible: (visible: boolean) => setMarkers((items) => items.map((item) => item.id === id ? { ...item, visible } : item)), remove: () => setMarkers((items) => items.filter((item) => item.id !== id)) };
      },
      addCircle: ({ center: circleCenter, radius, color = "#3B82F6" }) => {
        const id = nextId.current++;
        setCircles((items) => [...items, { id, center: circleCenter, radius, color }]);
        return { remove: () => setCircles((items) => items.filter((item) => item.id !== id)) };
      },
    };
    onMapReady?.(map);
  }, [onMapReady]);

  const centerPixel = project(center, zoom);
  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    setZoomState((value) => Math.max(3, Math.min(19, value + (event.deltaY < 0 ? 1 : -1))));
  };

  return (
    <div ref={viewportRef} className={cn("relative w-full h-full overflow-hidden bg-emerald-50", className)} onWheel={handleWheel}>
      <div className="absolute inset-0 bg-[#d9eadf]">
        {[-1, 0, 1].flatMap((dx) => [-1, 0, 1].map((dy) => {
          const tileX = Math.floor(centerPixel.x / TILE_SIZE) + dx;
          const tileY = Math.floor(centerPixel.y / TILE_SIZE) + dy;
          const left = viewportRef.current ? viewportRef.current.clientWidth / 2 + (tileX * TILE_SIZE - centerPixel.x) : 0;
          const top = viewportRef.current ? viewportRef.current.clientHeight / 2 + (tileY * TILE_SIZE - centerPixel.y) : 0;
          const max = 2 ** zoom;
          return <img key={`${tileX}:${tileY}:${zoom}`} src={`https://tile.openstreetmap.org/${zoom}/${((tileX % max) + max) % max}/${Math.max(0, Math.min(max - 1, tileY))}.png`} alt="" className="absolute w-64 h-64 max-w-none" style={{ left, top }} draggable={false} />;
        }))}
      </div>
      {circles.map((circle) => {
        const point = project(circle.center, zoom);
        const x = viewportRef.current ? viewportRef.current.clientWidth / 2 + point.x - centerPixel.x : 0;
        const y = viewportRef.current ? viewportRef.current.clientHeight / 2 + point.y - centerPixel.y : 0;
        const metersPerPixel = 156543.03392 * Math.cos((circle.center.lat * Math.PI) / 180) / 2 ** zoom;
        const size = (circle.radius / metersPerPixel) * 2;
        return <div key={circle.id} className="absolute rounded-full border border-blue-500/50 bg-blue-500/10 pointer-events-none" style={{ left: x - size / 2, top: y - size / 2, width: size, height: size }} />;
      })}
      {markers.filter((marker) => marker.visible).map((marker) => {
        const point = project(marker.position, zoom);
        const x = viewportRef.current ? viewportRef.current.clientWidth / 2 + point.x - centerPixel.x : 0;
        const y = viewportRef.current ? viewportRef.current.clientHeight / 2 + point.y - centerPixel.y : 0;
        return <button key={marker.id} type="button" title={marker.title} onClick={marker.onClick} className="absolute z-10 h-5 w-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-white shadow-md" style={{ left: x, top: y, backgroundColor: marker.color }} />;
      })}
      <div className="absolute bottom-1 left-1 rounded bg-white/85 px-1.5 py-0.5 text-[10px] text-gray-600">© OpenStreetMap contributors</div>
      <div className="absolute right-3 top-3 z-20 flex flex-col overflow-hidden rounded-lg bg-white shadow">
        <button type="button" className="px-3 py-1 text-lg hover:bg-gray-100" onClick={() => setZoomState((value) => Math.min(19, value + 1))}>+</button>
        <button type="button" className="border-t px-3 py-1 text-lg hover:bg-gray-100" onClick={() => setZoomState((value) => Math.max(3, value - 1))}>−</button>
      </div>
    </div>
  );
}
