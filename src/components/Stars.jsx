const Stars = ({ value, size = 14 }) => {
  const rounded = Math.round(value * 10) / 10;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= Math.round(value) ? "text-yellow-400" : "text-zinc-700"}
          style={{ fontSize: size }}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-xs text-zinc-400">{rounded}</span>
    </div>
  );
};

export default Stars;
