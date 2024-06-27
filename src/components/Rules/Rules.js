import React, { useState } from "react";

const Rules = ({ rules, setRules }) => {
  const [birthRule, setBirthRule] = useState(rules.birthRule || [3]);
  const [survivalRule, setSurvivalRule] = useState(rules.survivalRule || [2, 3]);
  const [gridWidth, setGridWidth] = useState(rules.gridWidth || 50);
  const [gridHeight, setGridHeight] = useState(rules.gridHeight || 50);
  const [drawGridLines, setDrawGridLines] = useState(true);
  const [colors, setColors] = useState(
    rules.colors || [
      { threshold: 0, color: "#000000" },
      { threshold: 100, color: "#ff0000" },
      { threshold: 200, color: "#00ff00" },
      { threshold: 300, color: "#0000ff" },
    ]
  );

  // Definiowanie wzorców zasad
  const patterns = {
    Classic: { birthRule: [3], survivalRule: [2, 3] },
    "Walled Cities": { birthRule: [4, 5, 6, 7, 8], survivalRule: [2, 3, 4, 5, 6, 7, 8] },
    Ameba: { birthRule: [3, 5, 7], survivalRule: [1, 3, 5, 8] },
    Koagulacja: { birthRule: [3, 7, 8], survivalRule: [2, 3, 5, 6, 7, 8] },
    Flakes: { birthRule: [3], survivalRule: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
    // Można dodać więcej wzorców tutaj
  };

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

  const handleGridWidthChange = (newGridWidth) => {
    const parsedGridWidth = parseInt(newGridWidth, 10);
    setGridWidth(parsedGridWidth);
    setRules((prev) => ({ ...prev, gridWidth: parsedGridWidth }));
  };

  const handleGridHeightChange = (newGridHeight) => {
    const parsedGridHeight = parseInt(newGridHeight, 10);
    setGridHeight(parsedGridHeight);
    setRules((prev) => ({ ...prev, gridHeight: parsedGridHeight }));
  };

  const handleCellSizeChange = (newCellSize) => {
    const parsedCellSize = parseInt(newCellSize, 10);
    setRules((prev) => ({ ...prev, cellSize: parsedCellSize }));
  };

  const handlePatternChange = (e) => {
    const selectedPattern = patterns[e.target.value];
    if (selectedPattern) {
      setBirthRule(selectedPattern.birthRule);
      setSurvivalRule(selectedPattern.survivalRule);
      setRules((prev) => ({
        ...prev,
        birthRule: selectedPattern.birthRule,
        survivalRule: selectedPattern.survivalRule,
      }));
    }
  };

  const maxW = Math.floor((window.innerWidth - 350) / rules.cellSize);
  const maxH = Math.floor((window.innerHeight - 50) / rules.cellSize);

  const increaseWidth = () => {
    if (gridWidth < maxW) {
      handleGridWidthChange(gridWidth + 1);
    }
  };

  const decreaseWidth = () => {
    if (gridWidth > 10) {
      handleGridWidthChange(gridWidth - 1);
    }
  };

  const increaseHeight = () => {
    if (gridHeight < maxH) {
      handleGridHeightChange(gridHeight + 1);
    }
  };

  const decreaseHeight = () => {
    if (gridHeight > 10) {
      handleGridHeightChange(gridHeight - 1);
    }
  };

  const increaseCellSize = () => handleCellSizeChange(rules.cellSize + 1);
  const decreaseCellSize = () => handleCellSizeChange(rules.cellSize - 1);

  const toggleGridLines = () => {
    setDrawGridLines(!drawGridLines);
    setRules((prev) => ({ ...prev, drawGridLines: !drawGridLines }));
  };

  return (
    <div className="rules">
      <label className="flex">
        Prędkość: {rules.timeTick} ms
        <input
          className="range"
          type="range"
          min={10}
          max={990}
          step={10}
          value={rules.timeTick}
          onChange={(e) => setRules((prev) => ({ ...prev, timeTick: parseInt(e.target.value, 10) }))}
        />
      </label>
      <label className="flex">
        Szerokość siatki:
        <div>
          <input className="input-width" type="number" min={10} max={maxW} step={1} value={gridWidth} onChange={(e) => handleGridWidthChange(e.target.value)} />
          <button onClick={increaseWidth}>+</button>
          <button onClick={decreaseWidth}>-</button>
        </div>
      </label>
      <label className="flex">
        Wysokość siatki:
        <div>
          <input
            className="input-width"
            type="number"
            min={10}
            max={maxH}
            step={1}
            value={gridHeight}
            onChange={(e) => handleGridHeightChange(e.target.value)}
          />
          <button onClick={increaseHeight}>+</button>
          <button onClick={decreaseHeight}>-</button>
        </div>
      </label>
      <label className="flex">
        Rozmiar komórki:
        <div>
          <input
            className="input-width"
            type="number"
            min={5}
            max={50}
            step={1}
            value={rules.cellSize}
            onChange={(e) => handleCellSizeChange(e.target.value)}
          />
          <button onClick={increaseCellSize}>+</button>
          <button onClick={decreaseCellSize}>-</button>
        </div>
      </label>
      <div>
        <label>Sąsiedzi do przeżycia: </label>
        <div id="survivalRuleContainer" className="flex">
          {Array.from({ length: 9 }, (_, i) => (
            <label key={`survival-${i}`} className="flex">
              {i}
              <input type="checkbox" value={i} checked={survivalRule.includes(i)} onChange={(e) => handleCheckboxChange("survivalRule", e.target.value)} />
            </label>
          ))}
        </div>
        <label>Sąsiedzi do urodzenia: </label>
        <div id="birthRuleContainer" className="flex">
          {Array.from({ length: 9 }, (_, i) => (
            <label key={`birth-${i}`} className="flex">
              {i}
              <input type="checkbox" value={i} checked={birthRule.includes(i)} onChange={(e) => handleCheckboxChange("birthRule", e.target.value)} />
            </label>
          ))}
        </div>
        <label className="flex">
          Wzorce zasad:
          <select onChange={handlePatternChange} defaultValue="" className="range">
            <option value="" disabled>
              Wybierz wzorzec
            </option>
            {Object.keys(patterns).map((pattern) => (
              <option key={pattern} value={pattern}>
                {pattern}
              </option>
            ))}
          </select>
        </label>
        <label className="flex2">
          Generowanie linii siatki:
          <input type="checkbox" checked={drawGridLines} onChange={toggleGridLines} />
        </label>
        <br></br>
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
