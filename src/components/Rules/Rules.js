import React from "react";

const Rules = ({ rules, setRules }) => {
  const updateRule = (rule, value) => {
    setRules({
      ...rules,
      [rule]: value,
    });
  };

  return (
    <div>
      <label>
        Minimalne sąsiedztwo:
        <input type="number" value={rules.minNeighbors} onChange={(e) => updateRule("minNeighbors", e.target.value)} />
      </label>
      <label>
        Maksymalne sąsiedztwo:
        <input type="number" value={rules.maxNeighbors} onChange={(e) => updateRule("maxNeighbors", e.target.value)} />
      </label>
      <label>
        Sąsiedztwo do narodzin:
        <input type="number" value={rules.birthNeighbors} onChange={(e) => updateRule("birthNeighbors", e.target.value)} />
      </label>
    </div>
  );
};

export default Rules;
