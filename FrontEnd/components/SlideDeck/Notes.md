# SlideDeck.jsx — Notes

## Purpose

A generic reusable slideshow / carousel component. Receives an array of items (product cards) and displays one at a time with Prev / Next buttons. It does not care what the items are, so it could be reused anywhere in the app for any kind of content.

## Props

`{ items }` — the parent passes an array of React elements:
```jsx
<SlideDeck items={products.map(...)} />
```

## State

| Variable | Initial | Purpose |
|---|---|---|
| `index` | `0` | Tracks which item is currently visible. `setIndex` changes it and automatically re-renders. |

## Functions

- **`handlePrev`** — moves one step backward. Guard: stops at `0` (start of array).
- **`handleNext`** — moves one step forward. Guard: stops at `items.length - 1` (end of array).

## JSX Notes

- `&#8592;` / `&#8594;` — HTML codes for the ← and → arrow characters.
- `disabled={index === 0}` — greys out the Prev button when already at the first slide.
- `disabled={index === items.length - 1}` — greys out the Next button when already on the last slide.
- `items[index]` — renders whichever React element is at the current position in the array.
- Counter: `index + 1` converts from 0-based index to a human-friendly number (e.g. "1 / 12").
