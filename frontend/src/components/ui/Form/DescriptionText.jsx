import clsx from "clsx";

const DescriptionText = ({ description = "", className = "" }) => {
  if (!description) return null;

  // Ensure we always have an array
  const descriptions = Array.isArray(description) ? description : [description];

  return (
    <>
      {descriptions.map((desc, index) => (
        <span
          key={index}
          className={clsx(
            "text-gray-500 text-sm font-medium",
            className
          )}
        >
          {desc}
        </span>
      ))}
    </>
  );
};

export default DescriptionText;
