import "./Card.css";

const Card = ({
  children,
  title,
  subtitle,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  footer,
  ...props
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {(title || subtitle) && (
        <div className={`card-header ${headerClassName}`}>
          {title && <h3 className='card-title'>{title}</h3>}
          {subtitle && <div className='card-subtitle'>{subtitle}</div>}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className={`card-footer ${footerClassName}`}>{footer}</div>
      )}
    </div>
  );
};

export default Card;
