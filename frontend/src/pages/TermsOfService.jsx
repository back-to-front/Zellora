import Card from "../components/ui/Card";
import "./TermsOfService.css";

const TermsOfService = () => {
  return (
    <div className='terms-page'>
      <h1 className='terms-title'>Terms of Service</h1>

      <Card className='terms-card'>
        <div className='terms-content'>
          <section className='terms-section'>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Zellora platform, you agree to be bound
              by these Terms of Service. If you do not agree to these terms,
              please do not use our services.
            </p>
          </section>

          <section className='terms-section'>
            <h2>2. Description of Service</h2>
            <p>
              Zellora provides a community-driven platform for users to ask
              questions, provide answers, and share knowledge. The platform is
              intended for educational and informational purposes only.
            </p>
          </section>

          <section className='terms-section'>
            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the platform, you may be required to
              create an account. You are responsible for maintaining the
              confidentiality of your account information and for all activities
              that occur under your account.
            </p>
            <p>
              You agree to provide accurate and complete information when
              creating an account and to update such information to keep it
              current. You may not use another user's account without
              permission.
            </p>
          </section>

          <section className='terms-section'>
            <h2>4. User Content</h2>
            <p>
              Users may post questions, answers, comments, and other content on
              the platform. By submitting content, you grant Zellora a
              worldwide, non-exclusive, royalty-free license to use, reproduce,
              modify, adapt, publish, translate, and distribute your content.
            </p>
            <p>
              You represent and warrant that you own or have the necessary
              rights to the content you post and that your content does not
              violate the rights of any third party.
            </p>
          </section>

          <section className='terms-section'>
            <h2>5. Prohibited Conduct</h2>
            <p>
              You agree not to engage in any of the following prohibited
              activities:
            </p>
            <ul>
              <li>
                Posting content that is unlawful, defamatory, harassing, or
                otherwise objectionable
              </li>
              <li>Impersonating any person or entity</li>
              <li>Interfering with the proper functioning of the platform</li>
              <li>
                Attempting to gain unauthorized access to the platform or its
                systems
              </li>
              <li>
                Using the platform for any illegal or unauthorized purpose
              </li>
              <li>Posting spam or engaging in disruptive behavior</li>
            </ul>
          </section>

          <section className='terms-section'>
            <h2>6. Intellectual Property</h2>
            <p>
              All content, features, and functionality on the Zellora platform,
              including but not limited to text, graphics, logos, and software,
              are owned by Zellora or its licensors and are protected by
              copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className='terms-section'>
            <h2>7. Termination</h2>
            <p>
              Zellora reserves the right to terminate or suspend your account
              and access to the platform at its sole discretion, without notice,
              for conduct that Zellora believes violates these Terms of Service
              or is harmful to other users, Zellora, or third parties.
            </p>
          </section>

          <section className='terms-section'>
            <h2>8. Disclaimer of Warranties</h2>
            <p>
              The platform is provided "as is" and "as available" without any
              warranties of any kind, either express or implied. Zellora does
              not warrant that the platform will be uninterrupted or error-free.
            </p>
          </section>

          <section className='terms-section'>
            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Zellora shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of or inability to use
              the platform.
            </p>
          </section>

          <section className='terms-section'>
            <h2>10. Changes to Terms</h2>
            <p>
              Zellora reserves the right to modify these Terms of Service at any
              time. We will provide notice of significant changes by posting the
              updated terms on the platform. Your continued use of the platform
              after such modifications constitutes your acceptance of the
              updated terms.
            </p>
          </section>

          <section className='terms-section'>
            <h2>11. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in
              accordance with the laws of the jurisdiction in which Zellora
              operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className='terms-section'>
            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at legal@zellora.com.
            </p>
          </section>

          <div className='terms-footer'>
            <p>Last updated: September 6, 2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TermsOfService;
