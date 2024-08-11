import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LinearGraph = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Your activity on our service for a week',
                data: [],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    });

    useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/graph-data`) // Update URL if needed
          .then(response => response.json())
          .then(data => {
              const labels = data.map(entry => entry.day);
              const values = data.map(entry => entry.activity);
  
              setData({
                  labels: labels,
                  datasets: [
                      {
                          label: 'Your activity on our service for a week',
                          data: values,
                          fill: false,
                          backgroundColor: 'rgba(75,192,192,0.4)',
                          borderColor: 'rgba(75,192,192,1)',
                      },
                  ],
              });
          })
          .catch(error => console.error('Error fetching data:', error));
  }, []);
  
    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default LinearGraph;
