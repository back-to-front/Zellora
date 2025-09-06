import "./Alert.css";

const Alert = ({
  children,
  variant = "primary",
  className = "",
  onClose,
  ...props
}) => {
  const alertClasses = `alert alert-${variant} ${className}`;

  return (
    <div className={alertClasses.trim()} role='alert' {...props}>
      {children}
      {onClose && (
        <button
          type='button'
          className='alert-close'
          aria-label='Close'
          onClick={onClose}
        >
          <span aria-hidden='true'>&times;</span>
        </button>
      )}
    </div>
  );
};

export default Alert;
