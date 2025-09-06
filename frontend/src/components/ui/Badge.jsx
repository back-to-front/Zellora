import './Badge.css';

const Badge = ({
  children,
  variant = 'primary',
  size = 'medium',
  rounded = false,
  className = '',
  ...props
}) => {
  const badgeClasses = `
    badge
    badge-${variant}
    badge-${size}
    ${rounded ? 'badge-rounded' : ''}
    ${className}
  `;

  return (
    <span className={badgeClasses.trim()} {...props}>
      {children}
    </span>
  );
};

export default Badge;
