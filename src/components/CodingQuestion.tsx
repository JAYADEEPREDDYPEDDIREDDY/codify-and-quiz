
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Play } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { CodingQuestion as CodingQuestionType } from "@/lib/types";
import axios from "axios";

interface CodingQuestionProps {
  question: CodingQuestionType;
  onCodeChange: (code: string) => void;
  initialCode?: string;
  showResults?: boolean;
}

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const CodingQuestion: React.FC<CodingQuestionProps> = ({
  question,
  onCodeChange,
  initialCode,
  showResults = false,
}) => {
  const [code, setCode] = useState(initialCode || question.defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [runError, setRunError] = useState<string | null>(null);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange(newCode);
  };

  const runCode = async () => {
    // In a real application, this would send the code to a backend service like Judge0
    // For now, we'll simulate it with a timeout
    setIsRunning(true);
    setRunError(null);
    
    try {
      // Simulate API call to code execution service
      // await axios.post('/api/execute', { code, language: question.language });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock test results based on visible test cases
      const results: TestResult[] = question.testCases
        .filter(testCase => !testCase.isHidden || showResults)
        .map(testCase => {
          // Very simple simulation - in a real app, this would be the actual output from the code execution
          const passed = code.includes('return') && !code.includes('//') && code.length > 50;
          return {
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: passed ? testCase.expectedOutput : "incorrect output",
            passed: passed,
          };
        });
      
      setTestResults(results);
    } catch (error) {
      setRunError("An error occurred while executing your code. Please try again.");
      console.error("Code execution error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(result => result.passed);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question.text}</h3>
      
      <CodeEditor
        defaultCode={code}
        language={question.language}
        onChange={handleCodeChange}
        height="300px"
      />
      
      <div className="flex items-center gap-4">
        <Button
          onClick={runCode}
          disabled={isRunning}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {isRunning ? "Running..." : "Run Code"}
        </Button>
        
        {allTestsPassed && (
          <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm">
            <CheckCircle2 className="h-4 w-4" />
            All tests passed!
          </span>
        )}
      </div>
      
      {runError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{runError}</AlertDescription>
        </Alert>
      )}
      
      {testResults.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="font-medium">Test Results</h4>
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border ${
                result.passed 
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                  : "border-red-500 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <span className="font-medium">Test Case {index + 1}</span>
                </div>
                <span className={result.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {result.passed ? "Passed" : "Failed"}
                </span>
              </div>
              
              <div className="mt-2 text-sm grid grid-cols-3 gap-2">
                <div>
                  <div className="text-muted-foreground">Input:</div>
                  <div className="font-mono bg-muted p-1 rounded">{result.input}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Expected:</div>
                  <div className="font-mono bg-muted p-1 rounded">{result.expected}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Actual:</div>
                  <div className="font-mono bg-muted p-1 rounded">{result.actual}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodingQuestion;
