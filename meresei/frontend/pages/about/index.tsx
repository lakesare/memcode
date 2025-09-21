import React from 'react';
import './index.scss';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Meresei</h1>
        
        <section className="about-section">
          <h2>What is Meresei?</h2>
          <p>
            Meresei is a specialized calendar application designed specifically for people 
            living with Non-24-Hour Sleep-Wake Disorder (Non-24). It helps you visualize 
            and plan your unique sleep schedule that doesn't follow the typical 24-hour day.
          </p>
        </section>

        <section className="about-section">
          <h2>Understanding Non-24-Hour Sleep-Wake Disorder</h2>
          <p>
            Non-24-Hour Sleep-Wake Disorder is a circadian rhythm sleep disorder where 
            your internal body clock runs longer than 24 hours. This causes your sleep 
            and wake times to gradually shift later each day, creating a cycle that's 
            out of sync with the conventional day-night schedule.
          </p>
          <p>
            People with Non-24 often experience:
          </p>
          <ul>
            <li>Sleep times that shift later by 1-3 hours each day</li>
            <li>Difficulty maintaining a consistent sleep schedule</li>
            <li>Periods of being awake during conventional night hours</li>
            <li>Challenges with work, social, and daily life scheduling</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>How Meresei Helps</h2>
          <p>
            Meresei generates a personalized calendar based on your unique sleep cycle parameters:
          </p>
          <ul>
            <li><strong>Custom Day Length:</strong> Set your natural day length (typically 25-26 hours)</li>
            <li><strong>Sleep Duration:</strong> Define how many hours you need to be awake vs. asleep</li>
            <li><strong>Visual Planning:</strong> See your sleep and wake times projected into the future</li>
            <li><strong>Timezone Support:</strong> View your schedule in different timezones</li>
            <li><strong>Flexible Display:</strong> Hide irrelevant hours and customize the view to your needs</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Getting Started</h2>
          <p>
            To use Meresei effectively:
          </p>
          <ol>
            <li>Track your natural sleep patterns for a week or two</li>
            <li>Calculate your average day length (how much later you go to bed each day)</li>
            <li>Enter your parameters in the settings</li>
            <li>Use the generated calendar to plan appointments, work, and social activities</li>
          </ol>
        </section>

        <section className="about-section">
          <h2>Important Note</h2>
          <p className="disclaimer">
            This tool is designed to help with planning and visualization. It is not a 
            medical device and should not replace professional medical advice. If you 
            suspect you have a sleep disorder, please consult with a healthcare provider 
            or sleep specialist.
          </p>
        </section>

        <section className="about-section">
          <h2>Open Source</h2>
          <p>
            Meresei is part of the open-source Memcode project. You can find the source 
            code and contribute to its development on{' '}
            <a href="https://github.com/lakesare/memcode" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;