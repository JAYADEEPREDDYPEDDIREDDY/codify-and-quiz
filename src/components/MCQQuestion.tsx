
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MCQQuestion as MCQQuestionType } from "@/lib/types";

interface MCQQuestionProps {
  question: MCQQuestionType;
  onAnswerChange: (answer: string) => void;
  initialAnswer?: string;
  showResults?: boolean;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  onAnswerChange,
  initialAnswer,
  showResults = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(initialAnswer);

  const handleChange = (value: string) => {
    setSelectedOption(value);
    onAnswerChange(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question.text}</h3>
      <RadioGroup
        value={selectedOption}
        onValueChange={handleChange}
        className="space-y-3"
      >
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center space-x-2 p-3 rounded-md border ${
              showResults
                ? option.isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : selectedOption === option.id
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-border"
                : "border-border"
            }`}
          >
            <RadioGroupItem 
              value={option.id} 
              id={option.id} 
              disabled={showResults} 
              className={showResults && option.isCorrect ? "text-green-500" : ""}
            />
            <Label 
              htmlFor={option.id} 
              className={`flex-grow cursor-pointer ${
                showResults && option.isCorrect ? "text-green-600 dark:text-green-400 font-medium" : ""
              }`}
            >
              {option.text}
            </Label>
            {showResults && option.isCorrect && (
              <div className="text-green-600 dark:text-green-400 text-sm font-medium ml-auto">
                Correct
              </div>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default MCQQuestion;
