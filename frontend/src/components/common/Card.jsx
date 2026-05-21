import './Card.css';

const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div className={`card ${className} ${onClick ? 'card-clickable' : ''}`} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
