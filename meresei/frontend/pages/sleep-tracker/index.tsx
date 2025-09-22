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

  const renderInputSection = () =>
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

  const renderArticle = () => {
    return (
      <>
        <h2>Determining Your Circadian Rhythm</h2>
        
        <p>
          Determining the length of your circadian rhythm is in no way obvious. I thought my sleep schedule was random for years (from age 16 to 27). For the first few years, I attributed it to poor discipline and "working with Americans" across time zones. In recent years, when staying awake for 30 hours became a weekly occurrence (a pretty torturous weekly occurrence), I assumed my circadian rhythm was simply chaotic.
        </p>
        
        <p>
          What actually happens is that our sleep is guided by two coupled oscillators: the <strong>homeostatic component</strong> (how long since we last slept) and the <strong>circadian component</strong> (our internal biological clock). This combination is surprisingly easy to mistake for chaos.
        </p>
        
        <p>
          To fall asleep, we need <em>both</em> of these chemical systems to align simultaneously. Dr. Piotr Wozniak puts it well in his book "Good Sleep, Good Learning, Good Life" (I highly recommend this book):
        </p>
        
        <blockquote>
          There are two components of sleepiness that drive you to bed:
          <ul>
            <li><strong>Circadian component</strong> - sleepiness comes back to us in cycles which are usually about one day long</li>
            <li><strong>Homeostatic component</strong> - sleepiness increases with the length of time we stay awake</li>
          </ul>
          Only a combination of these two components determines the optimum time for sleep. Most importantly, you should remember that even strong sleepiness resulting from the homeostatic component may not be sufficient to get good sleep if the timing goes against the greatest sleep propensity determined by the circadian component.
        </blockquote>

        <h2>How to Determine Your Circadian Rhythm</h2>
        
        <p>
          It might seem that if you had a real, non-chaotic circadian rhythm (whether 24 hours, 25 hours, or any fixed number of hours), it would be easy to discover. You would simply notice that you wake up 1, 2, or 3 hours later every day if you don't try to control it.
        </p>
        
        <p>
          However, if you try to loosen control over your sleep, that pattern won't necessarily emerge clearly.
        </p>
        
        <p>
          We don't notice it, but people with normal 24-hour sleep schedules <strong>control</strong> their sleep constantly. If they wake up in the middle of the night, they look outside, see that it's dark, and go back to sleep. That's control. They look at their clock, see it's 11:00 PM, and interpret their vague tiredness as "I want to sleep now, time for bed." That's control.
        </p>
        
        <p>
          People with normal schedules don't just "feel it in their bones" when to sleep - they consult their environment (clocks, sunlight) to correctly interpret what they should do regarding sleep.
        </p>
        
        <p>
          Your schedule might indeed be chaotic, but keep in mind that unless you make explicit effort to follow some kind of schedule (like 24-hour people do automatically by seeing the sun and clocks), your schedule <em>will</em> appear chaotic and random. That's what two coupled oscillators tend to become unless you explicitly try to sync them.
        </p>

        <h2>What You Should Do</h2>

        <div className="step">
          <h3>Step 1: Determine Your Awake Hours</h3>
          <p>
            <strong>Find out how many hours after waking up you want to sleep again.</strong>
          </p>
          <p>
            Your first task is to determine: after you've had enough sleep, how many hours does it take for you to start feeling tired? In my case, the answer is 16 hours.
          </p>
          <p>
            This isn't easy to determine if your sleep schedule is chaotic. Your sleep components (circadian and homeostatic) might be wildly out of sync, and you might be waking up after only 4 hours of sleep, which leads to incorrect understanding of your natural rhythm.
          </p>
          <p>
            The easiest approach: wait for a time when your sleep schedule seems stable for a few days, then record when you start feeling that semi-intense "ready for sleep now" feeling.
          </p>
        </div>

        <div className="step">
          <h3>Step 2: Track Your Natural Sleep Length</h3>
          <p>
            Now we know how many awake hours you have in a day (let's call that number <strong>A</strong>). Next, we need to determine how many hours of sleep you need naturally.
          </p>
          <p>
            <strong>The process:</strong>
          </p>
          <ul>
            <li>Every day, record the time when you woke up</li>
            <li>After you wake up, set a timer - you must go to sleep in exactly A hours</li>
            <li>The next day, record when you woke up, and again, go to sleep in exactly A hours</li>
            <li>Do NOT try to control this in any way - no alarms, no forcing yourself to wake up earlier or later</li>
            <li>When you wake up, try to get as much sleep as you naturally want</li>
          </ul>
          <p>
            Continue this schedule for about a month. After 30 days, you'll have 30 records of your wake-up times. Insert them into the following form to calculate your circadian rhythm length.
          </p>
          {renderInputSection()}
        </div>

        <div className="step">
          <h3>Step 3: Create Your Personal "Sun and Moon"</h3>
          <p>
            Now you know your circadian cycle length!
            You can now predict when you'll be awake and when you'll be asleep! Meresei.com calendar can draft a schedule for you for months ahead. But that's not all.
            Next step: <strong>buy a clock</strong>. This will be your sun and moon.
          </p>
          <p>
            It cannot be overstated how much stability 24-hour people get from environmental cues. Having Non-24 feels like riding a carousel - you have no idea what time of day it is. We have strong cultural associations: "sun = awake," "1:00 PM = work time."
          </p>
          <p>
            To follow your circadian rhythm, you need your own sun, moon, and clock. I use a simple $5 countdown timer.
            #TODO pic
          </p>
          <p>
            <strong>My routine:</strong>
          </p>
          <ul>
            <li>Every day when I wake up, I set the countdown timer to 16 hours (use your "A" hours)</li>
            <li>When the countdown nears 00:00, I go to sleep - this is a strict rule</li>
            <li>If I wake up in the middle of the night, I check the timer (it shows negative time at this point)</li>
            <li>If I've only slept 4 hours, I go back to sleep</li>
            <li>If I've slept 8-9 hours, I can wake up if I feel like it</li>
          </ul>
          <p>
            Remember: people don't naturally "feel" when they're in the middle of their night. It's just that if you sleep every 24 hours, you are surrounded by cues: it's dark outside, the clock shows 3:00 AM, everything is quiet. Without those cues, you need your timer to be your guide.
          </p>
        </div>

        <h2>Result</h2>
        
      <p>
        What's described here is called "free-running" sleep. There's a lot of confusion that chaotic sleep schedules are the same as free-running - these couldn't be more different!
      </p>
      
      <p>
        <strong>Chaotic Non-24:</strong> You don't know your rhythm, so you fight against it constantly. Your two sleep systems (circadian and homeostatic) are completely out of sync.
      </p>
      
      <p>
        <strong>Free-running Non-24:</strong> You know your exact rhythm and follow it religiously. Your sleep systems work together predictably.
      </p>

      <p>
        When I had a chaotic sleep schedule vs. free-running schedule:
      </p>

      <table>
        <thead>
          <tr>
            <th>Chaotic Non-24</th>
            <th>Free-running Non-24</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Memory:</strong> Only worked via associations and spaced-repetition. Memorizing things was very hard. Went to a psychiatrist about this, he told me it happens because I work too much.
              <aside>Aside: I created <a href="https://www.memcode.com/articles/welcome">memcode.com</a> site to counteract the memory thing.<br/>See the <i>"Memorizing is hard. Let's make everything else easy."</i> tagline on the main page?<br/>I do not find it relatable anymore, I do not relate to the tagline I wrote myself.</aside>
            </td>
            <td>
              I can remember things automatically with little conscious effort, particularly if I "think" about them before falling asleep. This sleep-induced memorisation wasn't happening when I was sleeping at incorrect-for-me circadian time.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Eyes:</strong> Were dry and the sun hurt them a lot. Went to an eye doctor - she said it's because my neck doesn't get enough blood to the head, prescribed eye drops. Eye drops barely helped.
            </td>
            <td>
              Now that I'm guaranteed to sleep every night, my eyes are <i>never</i> dry, no matter how much time I spend on a computer.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Skin:</strong> Was hurting and I couldn't sit at tables unless there was a blanket so I could place my arms on it. I thought it's normal, and other people just persevere. Mentioned this to my therapist - she said her skin literally doesn't hurt at all when she touches wood.
            </td>
            <td>
              After I started following my circadian rhythm, my skin doesn't hurt from stuff like this.
            </td>
          </tr>
        </tbody>
      </table>
        
      <p>
        When I had a chaotic rhythm, I couldn't plan anything. I couldn't tell someone "we can meet at 2:00 PM on Monday" and be sure it wouldn't be my middle of the night. I was always using alarm clocks.
      </p>
      
      <p>
        Now I rarely need alarm clocks. I can plan stuff during my awake times with confidence.
      </p>
      
      <p>
        It cannot be underestimated how important it is to be religiously free-running when you have Non-24. I think this should be considered a cure - Non-24 just not a bother to me anymore. Chaotic Non-24 is a real, debilitating disability. Free-running Non-24 is just some extra calculations when coordinating with people.
      </p>
      
      <p>
        If you manage to start following a proper, predictable free-running schedule that leaves you well-slept every day, you will probably have better sleep than most people, let alone won't have a disability.
      </p>
      </>
    );
  };
  return (
    <div className="sleep-tracker-page standard-article">
      <div className="container">
        <div className="sleep-tracker-container">
          {renderArticle()}
        </div>
      </div>
    </div>
  );
};

export default SleepTrackerPage;