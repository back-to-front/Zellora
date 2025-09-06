import './Spinner.css';

const Spinner = ({ size = 'medium', color = 'primary', className = '', ...props }) => {
  const spinnerClasses = `spinner spinner-${size} spinner-${color} ${className}`;
  
  return <div className={spinnerClasses.trim()} {...props} />;
};

export default Spinner;
