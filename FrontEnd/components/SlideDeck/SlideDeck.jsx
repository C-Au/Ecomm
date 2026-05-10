import { useState } from "react";
import "./SlideDeck.css";

function SlideDeck({ items }) {
  const [index, setIndex] = useState(0);

  if (!items || items.length === 0) {
    return <p>No items to display.</p>;
  }

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleNext = () => {
    if (index < items.length - 1) setIndex(index + 1);
  };

  return (
    <div className="slide-deck-container">
      <div className="slide-deck-viewer">
        <button className="slide-btn" onClick={handlePrev} disabled={index === 0}>&#8592;</button>
        {items[index]}
        <button className="slide-btn" onClick={handleNext} disabled={index === items.length - 1}>&#8594;</button>
      </div>
      <p className="slide-counter">{index + 1} / {items.length}</p>
    </div>
  );
}

export default SlideDeck;
