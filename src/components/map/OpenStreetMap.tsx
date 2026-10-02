import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { WorkerProfile, Job } from '../../types';

interface OpenStreetMapProps {
  center: [number, number];
  zoom?: number;
  workers?: WorkerProfile[];
  jobs?: Job[];
  selectedWorkerId?: string;
  selectedJobId?: string;
  onSelectWorker?: (worker: WorkerProfile) => void;
  onSelectJob?: (job: Job) => void;
  className?: string;
  height?: string;
  fullScreen?: boolean;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  center,
  zoom = 13,
  workers = [],
  jobs = [],
  selectedWorkerId,
  selectedJobId,
  onSelectWorker,
  onSelectJob,
  className = '',
  height = '400px',
  fullScreen = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView(center, zoom);

      // Free OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }

    const timer = window.setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 180);
    return () => window.clearTimeout(timer);
  }, [center, zoom, fullScreen]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Custom Job Marker (Lemon Yellow Theme)
    jobs.forEach((job) => {
      const isSelected = selectedJobId === job.id;
      const jobIcon = L.divIcon({
        className: 'custom-job-pin',
        html: `
          <div style="
            background: #111111; 
            border: 3px solid #FFD54A; 
            color: #FFFFFF; 
            border-radius: 9999px; 
            padding: 4px 8px; 
            font-size: 11px; 
            font-weight: 800; 
            display: flex; 
            align-items: center; 
            gap: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            transition: all 0.2s;
            white-space: nowrap;
          ">
            <span>🍋 ₹${job.dailyWage}</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });

      const marker = L.marker([job.mapCoords.lat, job.mapCoords.lng], { icon: jobIcon });
      marker.on('click', () => {
        if (onSelectJob) onSelectJob(job);
      });
      if (!fullScreen) {
        marker.bindPopup(`
          <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="font-size: 13px; color: #111111;">${job.title}</strong><br/>
            <span style="color: #6B7280;">${job.location}</span><br/>
            <strong style="color: #111111;">₹${job.dailyWage} / દિવસ</strong> • ${job.distanceKm} km away
          </div>
        `);
      }
      markersLayerRef.current?.addLayer(marker);
    });

    // Custom Worker Marker (Initials badge, NO photo, adhering to privacy)
    workers.forEach((worker) => {
      const isSelected = selectedWorkerId === worker.id;
      const initials = worker.name.substring(0, 2);

      const workerIcon = L.divIcon({
        className: 'custom-worker-pin',
        html: `
          <div style="
            width: 38px;
            height: 38px;
            background: ${isSelected ? '#FFD54A' : '#FFFFFF'};
            border: ${isSelected ? '3px solid #111111' : '2px solid #6B7280'};
            color: #111111;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 900;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
            transition: all 0.2s;
            cursor: pointer;
          ">
            ${initials}
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const marker = L.marker([worker.locationCoords.lat, worker.locationCoords.lng], { icon: workerIcon });
      marker.on('click', () => {
        if (onSelectWorker) onSelectWorker(worker);
      });
      if (!fullScreen) {
        marker.bindPopup(`
          <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="font-size: 13px; color: #111111;">${worker.name}</strong><br/>
            <span style="color: #6B7280;">⭐ ${worker.rating} • ${worker.attendanceRate}% Attendance</span><br/>
            <strong style="color: #111111;">₹${worker.dailyWage} / દિવસ</strong>
          </div>
        `);
      }
      markersLayerRef.current?.addLayer(marker);
    });
  }, [workers, jobs, selectedWorkerId, selectedJobId, onSelectWorker, onSelectJob, fullScreen]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: fullScreen ? '100%' : height, width: '100%' }}
      className={fullScreen
        ? `overflow-hidden z-0 ${className}`
        : `rounded-3xl overflow-hidden border border-gray-200 shadow-soft z-0 ${className}`
      }
    />
  );
};
