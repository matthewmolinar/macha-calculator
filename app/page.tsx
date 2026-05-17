"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Operator = "+" | "-" | "*" | "/";

const operators: Record<Operator, { label: string; run: (a: number, b: number) => number }> = {
  "+": { label: "+", run: (a, b) => a + b },
  "-": { label: "-", run: (a, b) => a - b },
  "*": { label: "x", run: (a, b) => a * b },
  "/": { label: "/", run: (a, b) => a / b },
};

function formatValue(value: number) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded = Number.parseFloat(value.toFixed(10));
  return String(rounded);
}

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [expression, setExpression] = useState("");
  const [replaceDisplay, setReplaceDisplay] = useState(false);

  const clear = useCallback(() => {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setExpression("");
    setReplaceDisplay(false);
  }, []);

  const appendDigit = useCallback(
    (digit: string) => {
      if (display === "Error" || replaceDisplay) {
        setDisplay(digit);
        setReplaceDisplay(false);
        return;
      }

      setDisplay((current) => (current === "0" ? digit : current + digit));
    },
    [display, replaceDisplay],
  );

  const appendDecimal = useCallback(() => {
    if (display === "Error" || replaceDisplay) {
      setDisplay("0.");
      setReplaceDisplay(false);
      return;
    }

    setDisplay((current) => (current.includes(".") ? current : current + "."));
  }, [display, replaceDisplay]);

  const applyOperator = useCallback(
    (nextOperator: Operator) => {
      if (display === "Error") {
        clear();
        return;
      }

      const currentValue = Number(display);

      if (storedValue !== null && operator && !replaceDisplay) {
        const nextValue = operators[operator].run(storedValue, currentValue);
        const nextDisplay = formatValue(nextValue);

        setDisplay(nextDisplay);
        setStoredValue(Number(nextDisplay));
        setExpression(`${nextDisplay} ${operators[nextOperator].label}`);
      } else {
        setStoredValue(currentValue);
        setExpression(`${display} ${operators[nextOperator].label}`);
      }

      setOperator(nextOperator);
      setReplaceDisplay(true);
    },
    [clear, display, operator, replaceDisplay, storedValue],
  );

  const calculate = useCallback(() => {
    if (!operator || storedValue === null || display === "Error") {
      return;
    }

    const currentValue = Number(display);
    const nextValue = operators[operator].run(storedValue, currentValue);
    const nextDisplay = formatValue(nextValue);

    setDisplay(nextDisplay);
    setExpression(`${storedValue} ${operators[operator].label} ${display}`);
    setStoredValue(null);
    setOperator(null);
    setReplaceDisplay(true);
  }, [display, operator, storedValue]);

  const toggleSign = useCallback(() => {
    if (display !== "0" && display !== "Error") {
      setDisplay((current) => (current.startsWith("-") ? current.slice(1) : `-${current}`));
    }
  }, [display]);

  const backspace = useCallback(() => {
    if (replaceDisplay || display === "Error") {
      setDisplay("0");
      setReplaceDisplay(false);
      return;
    }

    setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
  }, [display, replaceDisplay]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) appendDigit(event.key);
      if (event.key === ".") appendDecimal();
      if (["+", "-", "*", "/"].includes(event.key)) applyOperator(event.key as Operator);
      if (event.key === "Enter" || event.key === "=") calculate();
      if (event.key === "Backspace") backspace();
      if (event.key === "Escape") clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appendDecimal, appendDigit, applyOperator, backspace, calculate, clear]);

  const keys = useMemo(
    () => [
      { label: "C", action: clear, tone: "utility" },
      { label: "+/-", action: toggleSign, tone: "utility" },
      { label: "Del", action: backspace, tone: "utility" },
      { label: "/", action: () => applyOperator("/"), tone: "operator" },
      { label: "7", action: () => appendDigit("7") },
      { label: "8", action: () => appendDigit("8") },
      { label: "9", action: () => appendDigit("9") },
      { label: "x", action: () => applyOperator("*"), tone: "operator" },
      { label: "4", action: () => appendDigit("4") },
      { label: "5", action: () => appendDigit("5") },
      { label: "6", action: () => appendDigit("6") },
      { label: "-", action: () => applyOperator("-"), tone: "operator" },
      { label: "1", action: () => appendDigit("1") },
      { label: "2", action: () => appendDigit("2") },
      { label: "3", action: () => appendDigit("3") },
      { label: "+", action: () => applyOperator("+"), tone: "operator" },
      { label: "0", action: () => appendDigit("0"), wide: true },
      { label: ".", action: appendDecimal },
      { label: "=", action: calculate, tone: "equals" },
    ],
    [appendDecimal, appendDigit, applyOperator, backspace, calculate, clear, toggleSign],
  );

  return (
    <main className="shell">
      <section className="calculator" aria-label="Calculator">
        <div className="brand">
          <span>Macha Calculator</span>
          <span>Basic arithmetic</span>
        </div>

        <output className="display" aria-live="polite">
          <span className="expression">{expression || "\u00a0"}</span>
          <span className="value">{display}</span>
        </output>

        <div className="keypad">
          {keys.map((key) => (
            <button
              className={["key", key.tone, key.wide ? "wide" : ""].filter(Boolean).join(" ")}
              key={key.label}
              onClick={key.action}
              type="button"
            >
              {key.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
