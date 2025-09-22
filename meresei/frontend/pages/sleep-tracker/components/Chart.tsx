import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LineController,
  ScatterController,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LineController,
  ScatterController
);

interface ChartProps {
  // Optional props for customization
}

const Chart: React.FC<ChartProps> = () => {
  const sampleDataText = '04:00 04:33 03:46 04:15 06:30 07:30 08:44 09:29 09:11 10:09 13:00 13:04 12:40 13:00 14:00 16:22 15:37 18:00 17:30 17:20 19:30 19:30 21:21 22:27 23:51';
  const [inputText, setInputText] = useState('');
  const [sleepTimes, setSleepTimes] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<{slope: number, rSquared: number} | null>(null);

  // Convert time string to decimal hours
  const timeToDecimal = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  };

  // Convert decimal hours back to time string
  const decimalToTime = (decimal: number): string => {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Linear regression calculation
  const calculateLinearRegression = (x: number[], y: number[]) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    return { slope, intercept, rSquared };
  };

  // Calculate analysis whenever sleep times change
  useEffect(() => {
    if (sleepTimes.length >= 2) {
      const x = sleepTimes.map((_, index) => index + 1);
      const y = sleepTimes.map(timeToDecimal);
      const result = calculateLinearRegression(x, y);
      setAnalysis({ slope: result.slope, rSquared: result.rSquared });
    }
  }, [sleepTimes]);

  // Parse input text into sleep times
  const parseInputText = (text: string): string[] => {
    return text
      .split(/\s+/) // Split by whitespace
      .map(time => time.trim())
      .filter(time => time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time))
      .map(time => {
        // Ensure HH:MM format
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      });
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    const parsedTimes = parseInputText(text);
    setSleepTimes(parsedTimes);
  };

  const loadSampleData = () => {
    setInputText(sampleDataText);
    setSleepTimes(parseInputText(sampleDataText));
  };

  const clearAllTimes = () => {
    setInputText('');
    setSleepTimes([]);
  };

  // Prepare chart data
  const chartData = {
    datasets: [
      {
        label: 'Wake-up Times',
        data: sleepTimes.map((time, index) => ({
          x: index + 1,
          y: timeToDecimal(time)
        })),
        backgroundColor: 'rgba(143, 143, 141, 0.6)',
        borderColor: 'rgba(143, 143, 141, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      // Regression line - simplified as scatter points
      ...(analysis ? [{
        label: 'Trend Line',
        data: (() => {
          const yMean = sleepTimes.map(timeToDecimal).reduce((a, b) => a + b, 0) / sleepTimes.length;
          const xMean = (sleepTimes.length + 1) / 2;
          const intercept = yMean - analysis.slope * xMean;
          
          // Generate line points
          const linePoints = [];
          for (let x = 1; x <= sleepTimes.length; x += Math.max(1, Math.floor(sleepTimes.length / 10))) {
            linePoints.push({ x, y: analysis.slope * x + intercept });
          }
          // Always include the last point
          if (linePoints[linePoints.length - 1]?.x !== sleepTimes.length) {
            linePoints.push({ x: sleepTimes.length, y: analysis.slope * sleepTimes.length + intercept });
          }
          return linePoints;
        })(),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointRadius: 2,
        showLine: true,
        tension: 0,
      }] : [])
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sleep Time Analysis',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day'
        },
        min: 1,
        max: Math.max(sleepTimes.length + 1, 5)
      },
      y: {
        title: {
          display: true,
          text: 'Hour (24h format)'
        },
        min: 0,
        max: 24,
        reverse: true, // Invert y-axis like in Python plot
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            return decimalToTime(value);
          }
        }
      }
    }
  };

  return (
    <section className="input-section">
      <textarea
        value={inputText}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Enter your wake-up times separated by spaces (e.g., 23:50 01:20 02:15 03:45 05:30)"
        rows={3}
      />
      
      <div className="input-actions">
        <button onClick={loadSampleData} className="sample-button">
          Load Sample Data
        </button>
        <button onClick={clearAllTimes} className="clear-button">
          Clear All
        </button>
      </div>

      {
        sleepTimes.length >= 1 &&
        <div className="chart-container">
          <Scatter key={sleepTimes.length} data={chartData} options={chartOptions} />
        </div>
      }

      {
        analysis && sleepTimes.length >= 2 &&
        <div className="stats">
          <div className="stat-card">
            <h3>Average Daily Shift</h3>
            <div className="stat-value">
              {analysis.slope > 0 ? '+ ' : ''}{(analysis.slope * 60).toFixed(0)} minutes/day
            </div>
            <div className="stat-description">
              {analysis.slope > 0 ? 'Later each day' : analysis.slope < 0 ? 'Earlier each day' : 'No consistent shift'}
            </div>
          </div>

          <div className="stat-card">
            <h3>Your Non-24 Is How Many Hours</h3>
            <div className="stat-value">
              {(24 + analysis.slope).toFixed(1)} hours
            </div>
            <div className="stat-description">
              Your total circadian cycle length
            </div>
          </div>

          <div className="stat-card">
            <h3>Pattern Consistency</h3>
            <div className="stat-value">
              {(analysis.rSquared * 100).toFixed(1)}%
            </div>
            <div className="stat-description">
              How well the trend line fits your data
            </div>
          </div>
        </div>
      }
    </section>
  );
};

export default Chart;