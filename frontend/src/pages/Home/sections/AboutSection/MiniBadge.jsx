export const MiniBadge = ({ children }) => {
  return (
    <div className="w-fit px-3 py-1 rounded-full text-sm font-semibold border border-(--purple-light) bg-(--purple-lightest) text-(--purple-dark)">
      {children}
    </div>
  );
};