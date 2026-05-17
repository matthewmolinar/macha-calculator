"use client";

import { useState, useCallback } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [operator, setOperator] = useState<string | null>(null);
  const [operand, setOperand] = useState<number | null>(null);

  const inputDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
      } else {
        setDisplay(display === "0" ? digit : display + digit);
      }
    },
    [display, waitingForOperand]
  );

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display, waitingForOperand]);

  const handleOperator = useCallback(
    (nextOperator: string) => {
      const current = parseFloat(display);

      if (operand !== null && !waitingForOperand) {
        let result = operand;
        switch (operator) {
          case "+": result = operand + current; break;
          case "−": result = operand - current; break;
          case "×": result = operand * current; break;
          case "÷": result = current !== 0 ? operand / current : 0; break;
        }
        setDisplay(String(parseFloat(result.toFixed(10))));
        setEquation(String(parseFloat(result.toFixed(10))) + " " + nextOperator);
        setOperand(result);
      } else {
        setEquation(display + " " + nextOperator);
        setOperand(current);
      }

      setWaitingForOperand(true);
      setOperator(nextOperator);
    },
    [display, operator, operand, waitingForOperand]
  );

  const calculate = useCallback(() => {
    if (operator === null || operand === null) return;
    const current = parseFloat(display);
    let result = operand;
    switch (operator) {
      case "+": result = operand + current; break;
      case "−": result = operand - current; break;
      case "×": result = operand * current; break;
      case "÷": result = current !== 0 ? operand / current : 0; break;
    }
    const formatted = String(parseFloat(result.toFixed(10)));
    setDisplay(formatted);
    setEquation("");
    setOperator(null);
    setOperand(null);
    setWaitingForOperand(true);
  }, [display, operator, operand]);

  const clear = useCallback(() => {
    setDisplay("0");
    setEquation("");
    setOperator(null);
    setOperand(null);
    setWaitingForOperand(false);
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay(String(parseFloat(display) * -1));
  }, [display]);

  const percentage = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100));
  }, [display]);

  const btn = (
    label: string,
    onClick: () => void,
    color: string,
    wide = false
  ) => (
    <button
      onClick={onClick}
      style={{
        gridColumn: wide ? "span 2" : undefined,
        background: color,
        color: color === "#f1a33c" || color === "#505050" ? "#fff" : color === "#d4d4d2" ? "#1c1c1e" : "#fff",
        border: "none",
        borderRadius: "50%",
        width: wide ? "auto" : "70px",
        height: "70px",
        fontSize: "24px",
        fontWeight: 400,
        cursor: "pointer",
        transition: "filter 0.1s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseDown={(e) => (e.currentTarget.style.filter = "brightness(1.3)")}
      onMouseUp={(e) => (e.currentTarget.style.filter = "none")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        background: "#1c1c1e",
        borderRadius: "20px",
        padding: "20px",
        width: "320px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Display */}
      <div style={{ textAlign: "right", padding: "10px 10px 20px", color: "#888", fontSize: "16px", minHeight: "24px" }}>
        {equation}
      </div>
      <div
        style={{
          textAlign: "right",
          padding: "0 10px 20px",
          color: "#fff",
          fontSize: display.length > 9 ? "32px" : "56px",
          fontWeight: 200,
          letterSpacing: "-2px",
          lineHeight: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {display}
      </div>

      {/* Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 70px)", gap: "12px" }}>
        {btn("AC", clear, "#505050")}
        {btn("+/-", toggleSign, "#505050")}
        {btn("%", percentage, "#505050")}
        {btn("÷", () => handleOperator("÷"), operator === "÷" ? "#fff" : "#f1a33c")}
        {btn("7", () => inputDigit("7"), "#333")}
        {btn("8", () => inputDigit("8"), "#333")}
        {btn("9", () => inputDigit("9"), "#333")}
        {btn("×", () => handleOperator("×"), operator === "×" ? "#fff" : "#f1a33c")}
        {btn("4", () => inputDigit("4"), "#333")}
        {btn("5", () => inputDigit("5"), "#333")}
        {btn("6", () => inputDigit("6"), "#333")}
        {btn("−", () => handleOperator("−"), operator === "−" ? "#fff" : "#f1a33c")}
        {btn("1", () => inputDigit("1"), "#333")}
        {btn("2", () => inputDigit("2"), "#333")}
        {btn("3", () => inputDigit("3"), "#333")}
        {btn("+", () => handleOperator("+"), operator === "+" ? "#fff" : "#f1a33c")}
        {btn("0", () => inputDigit("0"), "#333", true)}
        {btn(".", inputDecimal, "#333")}
        {btn("=", calculate, "#f1a33c")}
      </div>
    </div>
  );
}
