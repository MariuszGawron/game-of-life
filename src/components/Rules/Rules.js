import React, { useState } from "react";

const Rules = ({ rules, setRules }) => {
  const updateRule = (rule, value) => {
    setRules({
      ...rules,
      [rule]: value,
    });
  };

  const [birthRule, setBirthRule] = useState(rules.birthRule || [3]);
  const [survivalRule, setSurvivalRule] = useState(rules.survivalRule || [2, 3]);

  const handleCheckboxChange = (type, value) => {
    const val = parseInt(value);
    let newRule;
    if (type === "birthRule") {
      newRule = birthRule.includes(val) ? birthRule.filter((item) => item !== val) : [...birthRule, val];
      setBirthRule(newRule);
      setRules((prev) => ({ ...prev, birthRule: newRule }));
    } else if (type === "survivalRule") {
      newRule = survivalRule.includes(val) ? survivalRule.filter((item) => item !== val) : [...survivalRule, val];
      setSurvivalRule(newRule);
      setRules((prev) => ({ ...prev, survivalRule: newRule }));
    }
  };

  return (
    <div className="rules">
      <label>
        Prędkość:
        <input type="range" min={1} max={1000} step={1} value={rules.timeTick} onChange={(e) => updateRule("timeTick", e.target.value)} />
      </label>
      <label>
        Wielkość planszy:
        <input type="number" min={10} max={100} step={1} value={rules.gridSize} onChange={(e) => updateRule("gridSize", e.target.value)} />
      </label>
      <label>
        Rozmiar komórek:
        <input type="number" min={5} max={50} step={1} value={rules.cellSize} onChange={(e) => updateRule("cellSize", e.target.value)} />
      </label>
      <div>
        <label>Sąsiedzi do urodzenia:</label>
        <div id="birthRuleContainer">
          {Array.from({ length: 9 }, (_, i) => (
            <label key={`birth-${i}`}>
              {i}
              <input type="checkbox" value={i} checked={birthRule.includes(i)} onChange={(e) => handleCheckboxChange("birthRule", e.target.value)} />
            </label>
          ))}
        </div>
        <label>Sąsiedzi do przeżycia:</label>
        <div id="survivalRuleContainer">
          {Array.from({ length: 9 }, (_, i) => (
            <label key={`survival-${i}`}>
              {i}
              <input type="checkbox" value={i} checked={survivalRule.includes(i)} onChange={(e) => handleCheckboxChange("survivalRule", e.target.value)} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rules;
