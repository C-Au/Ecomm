import { useState } from "react";

function SlideDeck({items}) {
    const [index, setIndex] = useState(0);
    
    const handlePrev = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    }
    
    const handleNext = () => {
        if (index < items.length - 1) {
            setIndex(index + 1);
        }
    }

    
    return (
        <div style={{border: "1px solid black", padding: "10px", width: "300px"}}>
            <h2>Welcome! To slide deck.</h2>
            <div>
                <button onClick={handlePrev}>Prev</button>
                {items[index]}
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
}

export default SlideDeck;
