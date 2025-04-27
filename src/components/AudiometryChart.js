import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

// Registrar los componentes necesarios
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const AudiometryChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Oído Derecho',
        data: data.rightEarValues,
        borderColor: 'rgba(0, 123, 255, 1)', // Color de la línea del oído derecho
        backgroundColor: 'rgba(7, 106, 193, 0.2)', // Color de relleno
        fill: false,
        tension: 0.2, // Reduce la suavidad para un desplazamiento más rápido
      },
      {
        label: 'Oído Izquierdo',
        data: data.leftEarValues,
        borderColor: 'rgb(99, 255, 250)', // Color de la línea del oído izquierdo
        backgroundColor: 'rgba(31, 191, 209, 0.2)', // Color de relleno
        fill: false,
        tension: 0.2, // Reduce la suavidad para un desplazamiento más rápido
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'dB',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Frecuencia (Hz)',
        },
      },
    },
    animation: {
      duration: 100, // Reduce la duración de la animación
      easing: 'easeOutQuad', // Usa una animación más rápida
    },
  };

  return <Line data={chartData} options={options} />;
};

export default AudiometryChart;