import Card from "../components/ui/Card";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className='privacy-page'>
      <h1 className='privacy-title'>Privacy Policy</h1>

      <Card className='privacy-card'>
        <div className='privacy-content'>
          <section className='privacy-section'>
            <h2>1. Introduction</h2>
            <p>
              At Zellora, we respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, and safeguard your information when you use our
              platform.
            </p>
            <p>
              Please read this Privacy Policy carefully to understand our
              practices regarding your personal data. By using Zellora, you
              acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>

          <section className='privacy-section'>
            <h2>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>

            <h3>2.1 Personal Information</h3>
            <p>
              When you register for an account, we collect information such as
              your name, email address, and username. You may also choose to
              provide additional information in your profile, such as your
              biography, location, or profile picture.
            </p>

            <h3>2.2 Content Information</h3>
            <p>
              We collect the content you create, upload, or share on our
              platform, including questions, answers, comments, and other
              contributions.
            </p>

            <h3>2.3 Usage Information</h3>
            <p>
              We automatically collect certain information about your use of our
              platform, including your IP address, browser type, operating
              system, referring URLs, access times, pages viewed, and links
              clicked.
            </p>

            <h3>2.4 Cookies and Similar Technologies</h3>
            <p>
              We use cookies and similar technologies to enhance your
              experience, analyze usage patterns, and deliver personalized
              content. You can control cookies through your browser settings.
            </p>
          </section>

          <section className='privacy-section'>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>To provide and maintain our services</li>
              <li>To personalize your experience on our platform</li>
              <li>
                To notify you about updates, security alerts, and support
                messages
              </li>
              <li>To respond to your requests, comments, or questions</li>
              <li>To improve our platform and develop new features</li>
              <li>To monitor and analyze usage patterns and trends</li>
              <li>
                To prevent and address technical issues, fraud, or illegal
                activities
              </li>
              <li>
                To communicate with you about products, services, offers, and
                events
              </li>
            </ul>
          </section>

          <section className='privacy-section'>
            <h2>4. Information Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>

            <h3>4.1 With Your Consent</h3>
            <p>
              We will share your personal information with third parties when we
              have your consent to do so.
            </p>

            <h3>4.2 Service Providers</h3>
            <p>
              We may share your information with third-party service providers
              who perform services on our behalf, such as hosting, data
              analysis, payment processing, customer service, email delivery,
              and auditing.
            </p>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in
              response to valid requests from public authorities (e.g., a court
              or government agency).
            </p>

            <h3>4.4 Protection of Rights</h3>
            <p>
              We may disclose your information when we believe disclosure is
              necessary to protect our rights, protect your safety or the safety
              of others, investigate fraud, or respond to a government request.
            </p>

            <h3>4.5 Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, or sale of all or a
              portion of our assets, your information may be transferred as part
              of that transaction.
            </p>

            <h3>4.6 Public Information</h3>
            <p>
              Any information you post publicly on our platform, such as
              questions, answers, and profile information, may be accessible to
              other users and indexed by search engines.
            </p>
          </section>

          <section className='privacy-section'>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect the security of your personal information. However, no
              method of transmission over the Internet or electronic storage is
              100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className='privacy-section'>
            <h2>6. Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have the following rights:
            </p>
            <ul>
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to the processing of your personal data</li>
              <li>Request restriction of processing of your personal data</li>
              <li>
                Data portability (receive your data in a structured,
                machine-readable format)
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided in the "Contact Us" section below.
            </p>
          </section>

          <section className='privacy-section'>
            <h2>7. Children's Privacy</h2>
            <p>
              Our platform is not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If we discover that a child under 13 has provided us with
              personal information, we will promptly delete it.
            </p>
          </section>

          <section className='privacy-section'>
            <h2>8. International Data Transfers</h2>
            <p>
              Your information may be transferred to, and maintained on,
              computers located outside of your state, province, country, or
              other governmental jurisdiction where the data protection laws may
              differ from those in your jurisdiction.
            </p>
          </section>

          <section className='privacy-section'>
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they
              are posted on this page.
            </p>
          </section>

          <section className='privacy-section'>
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p>
              Email: privacy@zellora.com
              <br />
              Address: 123 Tech Avenue, San Francisco, CA 94107, USA
            </p>
          </section>

          <div className='privacy-footer'>
            <p>Last updated: September 6, 2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
