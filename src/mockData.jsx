// cities json sample
export const locationData = [
  { name: "New York, NY, USA"},
  { name: "Los Angeles, CA, USA"},
  { name: "London, UK"},
  { name: "Paris, France"}
];

export const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : locationData.filter(location =>
    location.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

export const getSuggestionValue = (suggestion) => suggestion.name;

export const renderSuggestion = (suggestion) => (
  <div>
    {suggestion.name}
  </div>
);