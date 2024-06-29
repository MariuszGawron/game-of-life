import React, { useState, useEffect } from "react";

const Rules = ({ rules, setRules }) => {
  const [birthRule, setBirthRule] = useState(rules.birthRule || [3]);
  const [survivalRule, setSurvivalRule] = useState(rules.survivalRule || [2, 3]);
  const [gridWidth, setGridWidth] = useState(rules.gridWidth || 50);
  const [gridHeight, setGridHeight] = useState(rules.gridHeight || 50);
  const [drawGridLines, setDrawGridLines] = useState(false);
  const [colors, setColors] = useState(
    rules.colors || [
      { threshold: 0, color: "#000000" },
      { threshold: 100, color: "#ff0000" },
      { threshold: 200, color: "#00ff00" },
      { threshold: 300, color: "#0000ff" },
      { threshold: 400, color: "#00ffff" },
      { threshold: 500, color: "#ffff00" },
    ]
  );
  const shortcuts = [
    { key: "+", description: "zwiększ prędkość" },
    { key: "-", description: "zmniejsz prędkość" },
    { key: "6", description: "zwiększ szerokość" },
    { key: "4", description: "zmniejsz szerokość" },
    { key: "8", description: "zwiększ wysokość" },
    { key: "2", description: "zmniejsz wysokość" },
    { key: "7", description: "zwiększ komórkę" },
    { key: "1", description: "zmniejsz komórkę" },
    { key: "a", description: "start/stop" },
    { key: "s", description: "losuj" },
    { key: "d", description: "czyść" },
    { key: "f", description: "następna generacja" },
  ];

  // Definiowanie wzorców i gotowych zasad
  const patterns = {
    Classic: { birthRule: [3], survivalRule: [2, 3] },
    "Walled Cities": { birthRule: [4, 5, 6, 7, 8], survivalRule: [2, 3, 4, 5, 6, 7, 8] },
    Ameba: { birthRule: [3, 5, 7], survivalRule: [1, 3, 5, 8] },
    Koagulacja: { birthRule: [3, 7, 8], survivalRule: [2, 3, 5, 6, 7, 8] },
    Flakes: { birthRule: [3], survivalRule: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
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

  //Zastosowanie zmian zasad urodzenia i przeżycia
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

  //Zmiana kolorów i progów
  const handleColorChange = (index, field, value) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
    setRules((prev) => ({ ...prev, colors: newColors }));
  };

  //Maksymalne ilości wierszy i kolumn grida
  const maxW = Math.floor((window.innerWidth - 350) / rules.cellSize);
  const maxH = Math.floor((window.innerHeight - 50) / rules.cellSize);

  //Ustawuenie szerokości canvasa (ilość kolumn)
  const handleGridWidthChange = (newGridWidth) => {
    const parsedGridWidth = parseInt(newGridWidth, 10);
    setGridWidth(parsedGridWidth);
    setRules((prev) => ({ ...prev, gridWidth: parsedGridWidth }));
  };

  const increaseWidth = () => {
    if (gridWidth < maxW) {
      handleGridWidthChange(gridWidth + 1);
    } else {
      handleGridWidthChange(maxW);
    }
  };

  const decreaseWidth = () => {
    if (gridWidth > 10) {
      handleGridWidthChange(gridWidth - 1);
    }
  };

  //Ustawuenie wysokości canvasa (ilość wierszy)
  const handleGridHeightChange = (newGridHeight) => {
    const parsedGridHeight = parseInt(newGridHeight, 10);
    setGridHeight(parsedGridHeight);
    setRules((prev) => ({ ...prev, gridHeight: parsedGridHeight }));
  };

  const increaseHeight = () => {
    if (gridHeight < maxH) {
      handleGridHeightChange(gridHeight + 1);
    } else {
      handleGridHeightChange(maxH);
    }
  };

  const decreaseHeight = () => {
    if (gridHeight > 10) {
      handleGridHeightChange(gridHeight - 1);
    }
  };

  //Zmiana wielkości koórki - domyślnie 10
  const handleCellSizeChange = (newCellSize) => {
    const parsedCellSize = parseInt(newCellSize, 10);
    setRules((prev) => ({ ...prev, cellSize: parsedCellSize }));
  };

  const increaseCellSize = () => {
    if (rules.cellSize < rules.maxCellSize) {
      if (gridHeight + rules.cellSize > maxH) {
        handleGridHeightChange(Math.floor((window.innerHeight - 50) / (rules.cellSize + 1)));
      }
      if (gridWidth + rules.cellSize > maxW) {
        handleGridWidthChange(Math.floor((window.innerWidth - 350) / (rules.cellSize + 1)));
      }
      handleCellSizeChange(rules.cellSize + 1);
    }
  };

  const decreaseCellSize = () => {
    if (rules.cellSize > rules.minCellSize) {
      handleCellSizeChange(rules.cellSize - 1);
    }
  };

  //Zmiana szybkości działania
  const stepTimeTick = (Math.log(rules.maxTimeTick) - Math.log(rules.minTimeTick)) / 100; //Co ile ma się zwiększać/zmniejszać range z prędkością

  const handleTimeTickChange = (value) => {
    const linearValue = parseFloat(value);
    const timeTick = Math.round(Math.exp(linearValue));
    setRules((prev) => ({
      ...prev,
      timeTick: Math.min(Math.max(timeTick, rules.minTimeTick), rules.maxTimeTick),
    }));
  };

  const increaseTimeTick = () => {
    if (rules.timeTick < rules.maxTimeTick) {
      handleTimeTickChange(Math.log(rules.timeTick) + stepTimeTick);
    }
  };

  const decreaseTimeTick = () => {
    if (rules.timeTick > rules.minTimeTick) {
      handleTimeTickChange(Math.log(rules.timeTick) - stepTimeTick);
    }
  };

  const toggleGridLines = () => {
    setDrawGridLines(!drawGridLines);
    setRules((prev) => ({ ...prev, drawGridLines: !drawGridLines }));
  };

  //Obsługa skrótów klawiszowych
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "6":
          increaseWidth();
          break;
        case "4":
          decreaseWidth();
          break;
        case "8":
          increaseHeight();
          break;
        case "2":
          decreaseHeight();
          break;
        case "7":
          increaseCellSize();
          break;
        case "1":
          decreaseCellSize();
          break;
        case "-":
          increaseTimeTick();
          break;
        case "+":
          decreaseTimeTick();
          break;
        case "=":
          decreaseTimeTick();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [increaseWidth, decreaseWidth, increaseHeight, decreaseHeight, increaseCellSize, decreaseCellSize, increaseTimeTick, decreaseTimeTick]);

  return (
    <div className="rules">
      <label className="flex">
        Prędkość: x{Math.round((1000 / rules.timeTick) * 100) / 100}/s
        {/* Prędkość: {rules.timeTick} */}
        <input
          className="range"
          type="range"
          min={Math.log(rules.minTimeTick)}
          max={Math.log(rules.maxTimeTick)}
          step={stepTimeTick}
          value={Math.log(rules.timeTick)}
          onChange={(e) => handleTimeTickChange(e.target.value)}
        />
      </label>
      <label className="flex">
        Szerokość siatki:
        <div>
          <input
            readOnly
            className="input-width"
            type="number"
            min={10}
            max={maxW}
            step={1}
            value={gridWidth}
            onChange={(e) => handleGridWidthChange(e.target.value)}
          />
          <button onClick={increaseWidth}>+</button>
          <button onClick={decreaseWidth}>-</button>
        </div>
      </label>
      <label className="flex">
        Wysokość siatki:
        <div>
          <input
            readOnly
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
            readOnly
            className="input-width"
            type="number"
            min={rules.minCellSize}
            max={rules.maxCellSize}
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
          <select onChange={handlePatternChange} defaultValue="" className="select">
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
      <label>Skróty klawiszowe:</label>
      <p>
        {shortcuts.map((shortcut) => (
          <>
            {shortcut.key} - {shortcut.description}
            <br></br>
          </>
        ))}
      </p>
    </div>
  );
};

export default Rules;
