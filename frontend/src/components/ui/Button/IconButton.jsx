const IconButton = ({ icon: Icon, className = "", ...rest }) => {
  return (
    <button
      className={`flex items-center justify-center hover:opacity-70 cursor-pointer ${className}`}
      {...rest}
    >
      {Icon && <Icon size={23} />}
    </button>
  );
};

export default IconButton;
