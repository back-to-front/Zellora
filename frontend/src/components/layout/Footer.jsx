import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className='container'>
        <div className='footer-content'>
          <div className='footer-section'>
            <h3 className='footer-title'>Zellora</h3>
            <p className='footer-description'>
              A community-driven Q&A platform for developers to ask questions
              and share knowledge.
            </p>
          </div>

          <div className='footer-section'>
            <h3 className='footer-title'>Links</h3>
            <ul className='footer-links'>
              <li>
                <Link to='/' className='footer-link'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/questions' className='footer-link'>
                  Questions
                </Link>
              </li>
              <li>
                <Link to='/ask' className='footer-link'>
                  Ask Question
                </Link>
              </li>
              <li>
                <Link to='/about' className='footer-link'>
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className='footer-section'>
            <h3 className='footer-title'>Legal</h3>
            <ul className='footer-links'>
              <li>
                <Link to='/terms' className='footer-link'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to='/privacy' className='footer-link'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to='/cookies' className='footer-link'>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className='footer-section'>
            <h3 className='footer-title'>Connect</h3>
            <div className='social-links'>
              <a
                href='https://github.com/back-to-front'
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <FaGithub />
              </a>
              <a
                href='https://twitter.com/zellora'
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <FaTwitter />
              </a>
              <a
                href='https://linkedin.com/company/zellora'
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className='footer-bottom'>
          <p className='copyright'>
            &copy; {currentYear} Zellora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
