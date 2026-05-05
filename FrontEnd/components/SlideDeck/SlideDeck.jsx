// ============================================================
// SlideDeck.jsx — A reusable slideshow / carousel component
//
// This component receives an array of items (in our case, product
// cards) and displays one at a time with Prev / Next buttons.
//
// It is "generic" — it does not care what the items are, so it
// could be reused anywhere in the app for any kind of content.
// ============================================================

import { useState } from "react";
import "./SlideDeck.css";

// { items } destructures the props — the parent passes in an array
// of React elements like: <SlideDeck items={products.map(...)} />
function SlideDeck({items}) {

    // index tracks WHICH item is currently visible.
    // We start at 0 (the first item in the array).
    // useState(0) means the initial value is 0.
    // setIndex is the function we call to change it — calling it
    // automatically re-renders the component with the new value.
    const [index, setIndex] = useState(0);

    // handlePrev moves one step backward.
    // The "if" guard stops us from going below 0 (past the start).
    const handlePrev = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    }

    // handleNext moves one step forward.
    // items.length - 1 is the index of the last item, so the guard
    // stops us from going past the end of the array.
    const handleNext = () => {
        if (index < items.length - 1) {
            setIndex(index + 1);
        }
    }

    return (
        <div className="slide-deck-container">
            <div className="slide-deck-viewer">

                {/* &#8592; is the HTML code for the ← arrow character.
                    disabled={index === 0} greys out the button when we
                    are already at the first slide (nothing to go back to). */}
                <button className="slide-btn" onClick={handlePrev} disabled={index === 0}>&#8592;</button>

                {/* items[index] renders whichever React element is at
                    the current position in the array — e.g. a product card. */}
                {items[index]}

                {/* disabled={index === items.length - 1} greys out the
                    button when we are already on the last slide. */}
                <button className="slide-btn" onClick={handleNext} disabled={index === items.length - 1}>&#8594;</button>
            </div>

            {/* Show the current position as "1 / 12", "2 / 12", etc.
                index is 0-based so we add 1 to show a human-friendly number. */}
            <p className="slide-counter">{index + 1} / {items.length}</p>
        </div>
    );
}

export default SlideDeck;
