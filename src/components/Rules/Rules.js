import React, { useState } from "react";

const Rules = ({ rules, setRules }) => {
  const [birthRule, setBirthRule] = useState(rules.birthRule || [3]);
  const [survivalRule, setSurvivalRule] = useState(rules.survivalRule || [2, 3]);
  const [gridSize, setGridSize] = useState(rules.gridSize || 50);
  const [colors, setColors] = useState(
    rules.colors || [
      { threshold: 0, color: "#000000" },
      { threshold: 100, color: "#ff0000" },
      { threshold: 200, color: "#00ff00" },
      { threshold: 300, color: "#0000ff" },
    ]
  );

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

  const handleColorChange = (index, field, value) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
    setRules((prev) => ({ ...prev, colors: newColors }));
  };

  // W funkcji updateRule dodaj obsługę zmiany rozmiaru planszy
  const updateRule = (rule, value) => {
    if (rule === "gridSize") {
      setGridSize(parseInt(value)); // Dodaj tę linijkę do aktualizacji rozmiaru siatki
    }
    setRules({
      ...rules,
      [rule]: value,
    });
  };

  return (
    <div className="rules">
      <label className="flex">
        Prędkość: {rules.timeTick} ms
        <input type="range" min={10} max={1000} step={10} value={rules.timeTick} onChange={(e) => setRules({ ...rules, timeTick: e.target.value })} />
      </label>
      <label className="flex">
        Wielkość planszy:
        <input
          className="input-width"
          type="number"
          min={10}
          max={100}
          step={1}
          value={rules.gridSize}
          onChange={(e) => updateRule("gridSize", e.target.value)}
        />
      </label>
      <label className="flex">
        Rozmiar komórek:
        <input
          className="input-width"
          type="number"
          min={5}
          max={50}
          step={1}
          value={rules.cellSize}
          onChange={(e) => setRules({ ...rules, cellSize: e.target.value })}
        />
      </label>
      <div>
        <label>Sąsiedzi do przeżycia: </label>
        <div id="survivalRuleContainer">
          {Array.from({ length: 9 }, (_, i) => (
            <label key={`survival-${i}`}>
              {i}
              <input type="checkbox" value={i} checked={survivalRule.includes(i)} onChange={(e) => handleCheckboxChange("survivalRule", e.target.value)} />
            </label>
          ))}
        </div>
        <label>Sąsiedzi do urodzenia: </label>
        <div id="birthRuleContainer">
          {Array.from({ length: 9 }, (_, i) => (
            <label key={`birth-${i}`}>
              {i}
              <input type="checkbox" value={i} checked={birthRule.includes(i)} onChange={(e) => handleCheckboxChange("birthRule", e.target.value)} />
            </label>
          ))}
        </div>
        <label>Kolory:</label>
        {colors.map((color, index) => (
          <div key={index} className="flex">
            <label>
              Próg {index + 1}:
              <input className="input-width" type="number" value={color.threshold} onChange={(e) => handleColorChange(index, "threshold", e.target.value)} />
            </label>
            <label>
              Kolor {index + 1}:
              <input className="input-width" type="color" value={color.color} onChange={(e) => handleColorChange(index, "color", e.target.value)} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rules;
