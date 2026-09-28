const Word = ({ word, by }) => {
  if (by === "word") {
    return (
      <span className="split-mask" aria-hidden="true">
        <span className="split-inner">{word}</span>
      </span>
    );
  }
  return (
    <span className="split-word" aria-hidden="true">
      {[...word].map((c, i) => (
        <span key={i} className="split-mask">
          <span className="split-inner">{c}</span>
        </span>
      ))}
    </span>
  );
};

export const Split = ({ text, by = "word", className = "", as: Tag = "span", testId }) => {
  const words = text.split(" ");
  return (
    <Tag className={`split ${className}`} aria-label={text} data-testid={testId}>
      {words.map((w, i) => (
        <span key={i} className="split-seg" aria-hidden="true">
          <Word word={w} by={by} />
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
};
