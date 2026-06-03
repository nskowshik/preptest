// QuestionSidebar.jsx
// Left-panel question list for the test creation flow.
// Props mirror what you'd get from Redux / parent state.

import React from 'react';

// ─── Config ───────────────────────────────────────────────────────────────────

// Question status drives icon + colour
const STATUS = {
    done: { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-700', icon: '✓' },
    active: { bg: 'bg-white', border: 'border-emerald-400', text: 'text-emerald-700', icon: '' },
    pending: { bg: 'bg-white', border: 'border-gray-300', text: 'text-gray-500', icon: '' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusIcon = ({ status }) => {
    const s = STATUS[status] ?? STATUS.pending;
    return (
        <span
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold text-white ${s.bg} ${s.border}`}
        >
            {s.icon}
        </span>
    );
};

const QuestionRow = ({ question, isActive, onClick }) => {
    const s = STATUS[question.status] ?? STATUS.pending;
    return (
        <button
            type="button"
            onClick={() => onClick(question.id)}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors hover:bg-emerald-50 ${isActive ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-400 bg-white'
                }`}
        >
            <div className="flex items-center gap-3">
                <StatusIcon status={question.status} />
                <span className={`text-sm font-medium ${s.text}`}>{question.label}</span>
            </div>
            <span className={`text-sm font-semibold ${s.text}`}>»</span>
        </button>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const QuestionSidebar = ({
    questions = [],
    totalQuestions = 50,
    activeQuestionId = null,
    onSelectQuestion = () => { },
    onCollapse = () => { },
}) => {
    return (
        <aside className="bg-white px-4 py-5">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Question creation</h2>
                <button
                    type="button"
                    aria-label="Collapse sidebar"
                    onClick={onCollapse}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-indigo-400 hover:bg-indigo-50 transition-colors border-0 bg-transparent cursor-pointer"
                >
                    «
                </button>
            </div>

            {/* Total count */}
            <p className="mb-5 text-sm text-gray-500">
                Total Questions{' '}
                <span className="mx-1 text-gray-300">·</span>
                <span className="text-lg font-bold text-gray-800">{totalQuestions}</span>
            </p>

            {/* Question list */}
            <div className="flex flex-col gap-3 overflow-y-auto">
                {questions.map((q) => (
                    <QuestionRow
                        key={q.id}
                        question={q}
                        isActive={q.id === activeQuestionId}
                        onClick={onSelectQuestion}
                    />
                ))}
            </div>

        </aside >
    );
};

export default QuestionSidebar;


// ─── Usage example ────────────────────────────────────────────────────────────
//
// const QUESTIONS = [
//   { id: 1, label: 'Question x', status: 'done' },
//   { id: 2, label: 'Question 2', status: 'done' },
//   { id: 3, label: 'Question 3', status: 'done' },
//   { id: 4, label: 'Question x', status: 'done' },
//   { id: 5, label: 'Question x', status: 'done' },
//   { id: 6, label: 'Question 6', status: 'active' },
//   { id: 7, label: 'Question 7', status: 'pending' },
// ];
//
// <QuestionSidebar
//   questions={QUESTIONS}
//   totalQuestions={50}
//   activeQuestionId={6}
//   onSelectQuestion={(id) => console.log('selected', id)}
//   onCollapse={() => console.log('collapsed')}
// />