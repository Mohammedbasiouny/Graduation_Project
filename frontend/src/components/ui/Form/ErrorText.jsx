import clsx from "clsx";

const ErrorText = ({ error = "", className = "" }) => {
  if (!error || (Array.isArray(error) && error.length === 0)) return null;

  // Ensure we always have an array
  const errors = Array.isArray(error) ? error : [error];

  return (
    <>
      {errors.map((err, index) => (
        <span
          key={index}
          className={clsx(
            "text-red-500 text-sm font-medium",
            className
          )}
        >
          {err}
        </span>
      ))}
    </>
  );
};

export default ErrorText;
