const Loader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-5 h-5 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`${sizeClasses[size]} rounded-full border-t-transparent border-blue-500 animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;
