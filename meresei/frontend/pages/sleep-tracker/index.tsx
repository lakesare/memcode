import React, { useState, useRef, useEffect } from 'react';
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
import './index.scss';

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

const SleepTrackerPage: React.FC = () => {
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
        label: 'Sleep Times',
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

  const getRhythmInterpretation = (slope: number) => {
    if (Math.abs(slope) < 0.1) {
      return { type: "Normal 24-hour rhythm", color: "#28a745", description: "Your sleep time stays relatively consistent, indicating a normal 24-hour circadian rhythm." };
    } else if (slope > 0.5) {
      return { type: "Non-24 Sleep-Wake Disorder (likely)", color: "#dc3545", description: "Your sleep time shifts later by more than 30 minutes per day, suggesting Non-24-Hour Sleep-Wake Disorder." };
    } else if (slope > 0.1) {
      return { type: "Delayed Sleep Phase", color: "#fd7e14", description: "Your sleep time gradually shifts later, which may indicate Delayed Sleep Phase Syndrome or mild circadian rhythm issues." };
    } else if (slope < -0.1) {
      return { type: "Advanced Sleep Phase", color: "#6f42c1", description: "Your sleep time shifts earlier, which may indicate Advanced Sleep Phase Syndrome." };
    }
    return { type: "Irregular pattern", color: "#6c757d", description: "Your sleep pattern doesn't show a clear trend." };
  };

  return (
    <div className="sleep-tracker-page standard-article">
      <div className="container">
        <div className="sleep-tracker-container">
        <h2>Sleep Rhythm Analyzer</h2>

        {/* <section>
          <h2>How to Use This Tool</h2>
          <ol>
            <li>Track your natural bedtime for at least 7-14 days</li>
            <li>Don't try to force a "normal" schedule - record when you naturally feel sleepy</li>
            <li>Enter each day's bedtime using the time input above</li>
            <li>The tool will calculate the average shift in your sleep time per day</li>
            <li>A shift of +1 hour per day suggests a 25-hour natural rhythm (Non-24)</li>
          </ol>
        </section>
         */}
        <section className="input-section">
          <h2>Enter Your Sleep Times</h2>
          <p>Enter your bedtime for each day, separated by spaces (24-hour format). For example: <code>23:50 01:20 02:15 03:45</code></p>
          
          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter sleep times separated by spaces (e.g., 23:50 01:20 02:15 03:45 05:30)"
            className="sleep-times-input"
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
          
          {sleepTimes.length > 0 && (
            <div className="parsed-times">
              <strong>Parsed {sleepTimes.length} sleep times:</strong> {sleepTimes.join(', ')}
            </div>
          )}
        </section>

        {analysis && sleepTimes.length >= 2 && (
          <section className="analysis-section">
            <h2>Analysis Results</h2>
            
            <div className="chart-container">
              <Scatter key={sleepTimes.length} data={chartData} options={chartOptions} />
            </div>

            <div className="stats">
              <div className="stat-card">
                <h3>Average Daily Shift</h3>
                <div className="stat-value">
                  {analysis.slope > 0 ? '+' : ''}{(analysis.slope * 60).toFixed(1)} minutes/day
                </div>
                <div className="stat-description">
                  {analysis.slope > 0 ? 'Later each day' : analysis.slope < 0 ? 'Earlier each day' : 'No consistent shift'}
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

            <div className="interpretation">
              {(() => {
                const interpretation = getRhythmInterpretation(analysis.slope);
                return (
                  <div className="interpretation-card" style={{ borderLeftColor: interpretation.color }}>
                    <h3 style={{ color: interpretation.color }}>
                      {interpretation.type}
                    </h3>
                    <p>{interpretation.description}</p>
                  </div>
                );
              })()}
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
};

export default SleepTrackerPage;