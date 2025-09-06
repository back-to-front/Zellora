import './Button.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const buttonClasses = `
    btn 
    btn-${variant} 
    btn-${size} 
    ${fullWidth ? 'btn-block' : ''} 
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
