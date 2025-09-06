import { Link } from "react-router";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className='not-found'>
      <div className='not-found-content'>
        <div className='not-found-icon'>
          <FaExclamationTriangle />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to='/' className='btn btn-primary'>
          <FaHome /> Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
