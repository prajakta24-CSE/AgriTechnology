import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SoilRadarChart = ({ nitrogen = 280, phosphorus = 30, potassium = 200, pH = 6.8, moisture = 45, organicMatter = 1.8 }) => {
  // Normalize each nutrient to a 0-100 scale relative to optimal
  // Nitrogen optimal: 350 kg/ha -> (n / 350) * 100
  const normN = Math.min(100, Math.round((nitrogen / 380) * 100));
  // Phosphorus optimal: 40 kg/ha -> (p / 40) * 100
  const normP = Math.min(100, Math.round((phosphorus / 45) * 100));
  // Potassium optimal: 250 kg/ha -> (k / 250) * 100
  const normK = Math.min(100, Math.round((potassium / 280) * 100));
  // pH optimal: 7.0 -> ((14 - |pH - 7| * 2) / 14) * 100
  const normPH = Math.max(20, Math.min(100, Math.round(100 - Math.abs(pH - 7.0) * 18)));
  // Moisture optimal: 50% -> (moisture / 50) * 100 capped
  const normMoist = Math.min(100, Math.round((moisture / 60) * 100));
  // Organic Matter optimal: 2.5% -> (om / 2.5) * 100
  const normOM = Math.min(100, Math.round((organicMatter / 2.5) * 100));

  const data = {
    labels: [
      `Nitrogen (${nitrogen} kg/ha)`,
      `Phosphorus (${phosphorus} kg/ha)`,
      `Potassium (${potassium} kg/ha)`,
      `pH Balance (${pH})`,
      `Moisture (${moisture}%)`,
      `Organic Matter (${organicMatter}%)`,
    ],
    datasets: [
      {
        label: 'Current Soil Sample',
        data: [normN, normP, normK, normPH, normMoist, normOM],
        backgroundColor: 'rgba(46, 125, 50, 0.25)',
        borderColor: '#2e7d32',
        borderWidth: 2.5,
        pointBackgroundColor: '#1b5e20',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#1b5e20',
      },
      {
        label: 'Ideal Benchmark Target (100%)',
        data: [90, 85, 90, 95, 85, 90],
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: '#f59e0b',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointBackgroundColor: '#d97706',
        pointBorderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.08)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          display: false,
        },
        pointLabels: {
          font: {
            size: 11,
            family: "'Plus Jakarta Sans', sans-serif",
            weight: '600',
          },
          color: '#334155',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 14,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            weight: '600',
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '320px', width: '100%', position: 'relative' }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default SoilRadarChart;
