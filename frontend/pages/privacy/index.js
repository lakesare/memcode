import { Helmet } from 'react-helmet';
import Main from '~/appComponents/Main';
import Footer from '~/appComponents/Footer';

import css from './index.scss';

class Page_privacy extends React.Component {
  renderSection = (title, children) =>
    <section className="article-section">
      <h2 className="section-heading">{title}</h2>
      <div className="section-content">
        {children}
      </div>
    </section>

  render = () =>
    <Main className={`${css.main} -articles-page`}>
      <article className="standard-article-formatting">
        <div className="container">
          <section className="article-headings">
            <h1 className="-glow">Privacy Policy</h1>
            <h2 className="subtitle">Last updated: September 20, 2025</h2>
          </section>

          {this.renderSection('What Information We Collect', 
            <>
              <p><strong>Account Information:</strong> When you create a Memcode account, we collect your username, email address, and password (stored securely).</p>
              
              <p><strong>Learning Data:</strong> We store the courses you create, flashcards you make, and your learning progress to provide the spaced repetition service.</p>
              
              <p><strong>Usage Information:</strong> We collect basic analytics about how you use Memcode (pages visited, features used) to improve the platform.</p>
            </>
          )}

          {this.renderSection('How We Use Your Information',
            <>
              <p><strong>To Provide Our Service:</strong> Your data enables core Memcode functionality - creating courses, tracking learning progress, and spaced repetition scheduling.</p>
              
              <p><strong>To Communicate With You:</strong> We use your email address to send important account updates, new feature announcements, and respond to your questions.</p>
              
              <p><strong>To Improve Memcode:</strong> Anonymous usage data helps us understand which features work well and what needs improvement.</p>
            </>
          )}

          {this.renderSection('Information Sharing',
            <>
              <p><strong>We don't sell your data.</strong> Ever.</p>
              
              <p><strong>We don't share your personal information</strong> with third parties except:</p>
              <ul>
                <li>When required by law</li>
                <li>To protect the security of our service</li>
                <li>With your explicit consent</li>
              </ul>
              
              <p><strong>Public Courses:</strong> If you mark a course as public, other users can see and learn from it. Your username will be displayed as the creator.</p>
            </>
          )}

          {this.renderSection('Your Data Rights',
            <>
              <p><strong>Access:</strong> You can download your courses and flashcards anytime through the export feature.</p>
              
              <p><strong>Deletion:</strong> Contact us at <a href="mailto:contact@memcode.com" className="standard-link">contact@memcode.com</a> to delete your account and all associated data.</p>
              
              <p><strong>Email Preferences:</strong> You can unsubscribe from our emails using the link in any message or through your account settings.</p>
            </>
          )}

          {this.renderSection('Data Security',
            <>
              <p>We use industry-standard security measures to protect your information. However, no online service is 100% secure.</p>
            </>
          )}

          {this.renderSection('Third-Party Services',
            <>
              <p><strong>OpenAI:</strong> We use OpenAI's text-to-speech service for audio features. Audio is processed but not stored by OpenAI.</p>
              
              <p><strong>Amazon AWS:</strong> We use Amazon Web Services to store uploaded images and course data. AWS provides secure, encrypted storage.</p>
              
              <p><strong>Analytics:</strong> We use basic web analytics to understand site usage. This data is anonymized.</p>
            </>
          )}

          {this.renderSection('Changes to This Policy',
            <>
              <p>We'll notify users of significant changes to this privacy policy via email and website notice.</p>
            </>
          )}

          {this.renderSection('Contact Us',
            <>
              <p>Questions about this privacy policy? Email us at <a href="mailto:contact@memcode.com" className="standard-link">contact@memcode.com</a>.</p>
            </>
          )}

        </div>
      </article>

      <Helmet>
        <title>Privacy Policy | Memcode</title>
        <meta name="description" content="Memcode's Privacy Policy - How we collect, use, and protect your data" />
      </Helmet>

      <Footer/>
    </Main>
}

export default Page_privacy;