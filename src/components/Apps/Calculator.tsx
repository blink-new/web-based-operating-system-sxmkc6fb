import React, { useState, useCallback } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const calculate = useCallback((firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '−':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) throw new Error('Cannot divide by zero');
        return firstValue / secondValue;
      case '%':
        return firstValue % secondValue;
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  }, []);

  const inputNumber = useCallback((num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [display, waitingForOperand]);

  const inputOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      try {
        const newValue = calculate(currentValue, inputValue, operation);
        const result = String(newValue);
        setDisplay(result);
        setPreviousValue(newValue);
        
        // Add to history
        const historyEntry = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
        setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
      } catch (error) {
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation, calculate]);

  const performCalculation = useCallback(() => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      try {
        const newValue = calculate(previousValue, inputValue, operation);
        const result = String(newValue);
        setDisplay(result);
        
        // Add to history
        const historyEntry = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
        setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
        
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
      } catch (error) {
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
      }
    }
  }, [display, previousValue, operation, calculate]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  };

  const percentage = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const sqrt = () => {
    const value = Math.sqrt(parseFloat(display));
    setDisplay(String(value));
    const historyEntry = `√${display} = ${value}`;
    setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
  };

  const square = () => {
    const value = Math.pow(parseFloat(display), 2);
    setDisplay(String(value));
    const historyEntry = `${display}² = ${value}`;
    setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
  };

  const reciprocal = () => {
    const value = 1 / parseFloat(display);
    setDisplay(String(value));
    const historyEntry = `1/${display} = ${value}`;
    setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
  };

  // Memory functions
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => setDisplay(String(memory));
  const memoryAdd = () => setMemory(memory + parseFloat(display));
  const memorySubtract = () => setMemory(memory - parseFloat(display));
  const memoryStore = () => setMemory(parseFloat(display));

  const Button: React.FC<{ 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode;
    title?: string;
  }> = ({ onClick, className = '', children, title }) => (
    <button
      onClick={onClick}
      title={title}
      className={`
        h-12 text-lg font-semibold rounded-lg transition-all duration-150
        hover:opacity-80 active:scale-95 shadow-sm ${className}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex">
      {/* Main Calculator */}
      <div className="flex-1 flex flex-col max-w-md">
        {/* Display */}
        <div className="bg-black text-white text-right text-3xl font-mono p-4 rounded-lg mb-4 min-h-[80px] flex items-center justify-end shadow-inner">
          <div className="truncate">{display}</div>
        </div>

        {/* Memory and History Controls */}
        <div className="flex justify-between mb-4 text-xs">
          <div className="flex space-x-1">
            <Button onClick={memoryClear} className="bg-purple-600 text-white text-xs px-2 h-8" title="Memory Clear">
              MC
            </Button>
            <Button onClick={memoryRecall} className="bg-purple-600 text-white text-xs px-2 h-8" title="Memory Recall">
              MR
            </Button>
            <Button onClick={memoryAdd} className="bg-purple-600 text-white text-xs px-2 h-8" title="Memory Add">
              M+
            </Button>
            <Button onClick={memorySubtract} className="bg-purple-600 text-white text-xs px-2 h-8" title="Memory Subtract">
              M-
            </Button>
            <Button onClick={memoryStore} className="bg-purple-600 text-white text-xs px-2 h-8" title="Memory Store">
              MS
            </Button>
          </div>
          <Button 
            onClick={() => setShowHistory(!showHistory)} 
            className="bg-gray-600 text-white text-xs px-2 h-8"
            title="Toggle History"
          >
            History
          </Button>
        </div>

        {/* Scientific Functions */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          <Button onClick={sqrt} className="bg-gray-600 text-white text-sm" title="Square Root">
            √x
          </Button>
          <Button onClick={square} className="bg-gray-600 text-white text-sm" title="Square">
            x²
          </Button>
          <Button onClick={reciprocal} className="bg-gray-600 text-white text-sm" title="Reciprocal">
            1/x
          </Button>
          <Button onClick={percentage} className="bg-gray-600 text-white text-sm" title="Percentage">
            %
          </Button>
          <Button onClick={() => inputOperation('^')} className="bg-gray-600 text-white text-sm" title="Power">
            x^y
          </Button>
        </div>

        {/* Main Buttons */}
        <div className="grid grid-cols-4 gap-3 flex-1">
          {/* Row 1 */}
          <Button onClick={clear} className="bg-red-500 text-white col-span-2" title="Clear All">
            Clear
          </Button>
          <Button onClick={backspace} className="bg-orange-500 text-white" title="Backspace">
            <Delete className="w-5 h-5 mx-auto" />
          </Button>
          <Button onClick={() => inputOperation('÷')} className="bg-blue-500 text-white" title="Divide">
            ÷
          </Button>

          {/* Row 2 */}
          <Button onClick={() => inputNumber('7')} className="bg-gray-700 text-white hover:bg-gray-600">
            7
          </Button>
          <Button onClick={() => inputNumber('8')} className="bg-gray-700 text-white hover:bg-gray-600">
            8
          </Button>
          <Button onClick={() => inputNumber('9')} className="bg-gray-700 text-white hover:bg-gray-600">
            9
          </Button>
          <Button onClick={() => inputOperation('×')} className="bg-blue-500 text-white" title="Multiply">
            ×
          </Button>

          {/* Row 3 */}
          <Button onClick={() => inputNumber('4')} className="bg-gray-700 text-white hover:bg-gray-600">
            4
          </Button>
          <Button onClick={() => inputNumber('5')} className="bg-gray-700 text-white hover:bg-gray-600">
            5
          </Button>
          <Button onClick={() => inputNumber('6')} className="bg-gray-700 text-white hover:bg-gray-600">
            6
          </Button>
          <Button onClick={() => inputOperation('−')} className="bg-blue-500 text-white" title="Subtract">
            −
          </Button>

          {/* Row 4 */}
          <Button onClick={() => inputNumber('1')} className="bg-gray-700 text-white hover:bg-gray-600">
            1
          </Button>
          <Button onClick={() => inputNumber('2')} className="bg-gray-700 text-white hover:bg-gray-600">
            2
          </Button>
          <Button onClick={() => inputNumber('3')} className="bg-gray-700 text-white hover:bg-gray-600">
            3
          </Button>
          <Button onClick={() => inputOperation('+')} className="bg-blue-500 text-white" title="Add">
            +
          </Button>

          {/* Row 5 */}
          <Button onClick={toggleSign} className="bg-gray-600 text-white" title="Toggle Sign">
            ±
          </Button>
          <Button onClick={() => inputNumber('0')} className="bg-gray-700 text-white hover:bg-gray-600">
            0
          </Button>
          <Button onClick={inputDecimal} className="bg-gray-700 text-white hover:bg-gray-600">
            .
          </Button>
          <Button onClick={performCalculation} className="bg-green-500 text-white" title="Equals">
            =
          </Button>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="w-64 ml-4 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">History</h3>
            <Button 
              onClick={() => setHistory([])} 
              className="bg-red-500 text-white text-xs px-2 h-6"
              title="Clear History"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm">No calculations yet</p>
            ) : (
              history.map((entry, index) => (
                <div
                  key={index}
                  className="text-gray-300 text-sm p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    const result = entry.split(' = ')[1];
                    if (result) setDisplay(result);
                  }}
                >
                  {entry}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;