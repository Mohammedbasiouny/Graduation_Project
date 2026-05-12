import clsx from "clsx";

const TextareaSkeleton = ({ className = "", rows = 4 }) => {
  // Approx height based on rows
  const rowHeight = 20; // px per row as approximation
  const textareaHeight = rows * rowHeight + 30; // add padding area

  return (
    <div className="w-full flex flex-col gap-1">
      <div
        className={clsx(
          "w-full rounded-lg bg-(--gray-light) animate-pulse",
          className
        )}
        style={{ height: textareaHeight }}
      ></div>

    </div>
  );
};

export default TextareaSkeleton;
