const DetailRow = ({ label, value, labelClassName = "", valueClassName = "" }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <span className={`font-medium text-gray-600 ${labelClassName}`}>{label}</span>
      <span className={`text-gray-900 font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
};

export default DetailRow;
