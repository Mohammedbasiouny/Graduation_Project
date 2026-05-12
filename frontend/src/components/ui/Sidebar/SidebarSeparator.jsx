const SidebarSeparator = ({ text }) => {
  return (
    <div className="flex items-center mt-3">
      <div className="h-px w-[15%] bg-gray-500 opacity-60" />

      {text && (
        <span className="px-2 text-base font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
          {text}
        </span>
      )}

      <div className="h-px flex-1 bg-gray-500 opacity-60" />
    </div>
  );
};

export default SidebarSeparator