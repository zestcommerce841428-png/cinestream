'use client';

import React, { useState } from 'react';
import { HelpCircle, Check, X, RefreshCw, Award, Sparkles } from 'lucide-react';

export default function TriviaPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: 'Which movie won the Best Picture Academy Award in 2020?',
      options: ['1917', 'Parasite', 'Joker', 'Once Upon a Time in Hollywood'],
      correct: 1,
    },
    {
      question: 'Who composed the iconic musical score for Interstellar and Inception?',
      options: ['John Williams', 'Ennio Morricone', 'Hans Zimmer', 'Howard Shore'],
      correct: 2,
    },
    {
      question: 'Which movie franchise is the highest grossing film franchise of all time?',
      options: ['Star Wars', 'Marvel Cinematic Universe', 'Harry Potter', 'James Bond'],
      correct: 1,
    },
    {
      question: 'Who directed Pulp Fiction, Reservoir Dogs, and Django Unchained?',
      options: ['Martin Scorsese', 'Quentin Tarantino', 'Christopher Nolan', 'Steven Spielberg'],
      correct: 1,
    },
    {
      question: 'In The Matrix (1999), what color pill does Neo take to wake up to reality?',
      options: ['Red Pill', 'Blue Pill', 'Green Pill', 'Yellow Pill'],
      correct: 0,
    },
  ];

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentQuestionIndex].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((q) => q + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
  };

  const q = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto shadow-xl">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">CineStream Movie Trivia Game</h1>
        <p className="text-gray-400 text-sm">Test your film knowledge with live score tracking!</p>
      </div>

      {!showResult ? (
        <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400 border-b border-gray-800 pb-4">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-brand-400">Score: {score}</span>
          </div>

          <h2 className="text-xl font-bold text-white leading-snug">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let btnStyle = 'bg-gray-950 border-gray-800 text-gray-200 hover:border-brand-500';
              if (selectedOption !== null) {
                if (i === q.correct) {
                  btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold';
                } else if (i === selectedOption) {
                  btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && i === q.correct && <Check className="w-5 h-5 text-emerald-400" />}
                  {selectedOption !== null && i === selectedOption && i !== q.correct && <X className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg transition"
              >
                {currentQuestionIndex + 1 < questions.length ? 'Next Question →' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-900/80 p-10 rounded-3xl border border-gray-800 text-center space-y-4">
          <Award className="w-16 h-16 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
          <p className="text-lg text-gray-300">You scored <strong className="text-brand-400">{score}</strong> out of <strong className="text-white">{questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)</p>
          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg transition mt-4"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
