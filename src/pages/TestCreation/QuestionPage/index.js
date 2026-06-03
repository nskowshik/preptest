import React, { useState, useRef, useEffect } from 'react';
import { data, useParams } from 'react-router-dom';
import apiClient from '../../../api';

const TOOLBAR_GROUPS = [
    [
        { icon: 'ti-italic', title: 'Italic', cmd: 'italic' },
        { icon: 'ti-bold', title: 'Bold', cmd: 'bold' },
        { icon: 'ti-underline', title: 'Underline', cmd: 'underline' },
        { icon: 'ti-strikethrough', title: 'Strikethrough', cmd: 'strikeThrough' },
        { icon: 'ti-link', title: 'Link', cmd: 'createLink' },
    ],
    [
        { icon: 'ti-align-left', title: 'Align left', cmd: 'justifyLeft' },
        { icon: 'ti-align-center', title: 'Align center', cmd: 'justifyCenter' },
        { icon: 'ti-align-right', title: 'Align right', cmd: 'justifyRight' },
        { icon: 'ti-align-justified', title: 'Justify', cmd: 'justifyFull' },
    ],
    [
        { icon: 'ti-list', title: 'Bullet list', cmd: 'insertUnorderedList' },
        {
            icon: 'ti-list-numbers',
            title: 'Ordered list',
            cmd: 'insertOrderedList',
        },
    ],
    [
        { icon: 'ti-photo', title: 'Image', cmd: null },
        { icon: 'ti-table', title: 'Table', cmd: null },
        { icon: 'ti-eraser', title: 'Clear formatting', cmd: 'removeFormat' },
    ],
];

const SETTINGS_FIELDS = [
    {
        key: 'difficulty',
        label: 'Level of Difficulty',
        options: ['Easy', 'Medium', 'Hard'],
    },
    {
        key: 'topic',
        label: 'Topic',
        options: ['Grammar', 'Writing', 'Comprehension'],
    },
    {
        key: 'subTopic',
        label: 'Sub-topic',
        options: ['Application', 'Theory', 'Practice'],
    },
];

// ─── RichEditor ───────────────────────────────────────────────────────────────

const RichEditor = ({
    placeholder = 'Type here',
    className = '',
    onExecCmd,
}) => {
    const ref = useRef(null);

    const handleFocus = () => {
        if (ref.current?.innerText.trim() === placeholder)
            ref.current.innerText = '';
    };
    const handleBlur = () => {
        if (!ref.current?.innerText.trim()) ref.current.innerText = placeholder;
    };

    if (onExecCmd) {
        onExecCmd.current = (cmd) => {
            ref.current?.focus();
            document.execCommand(cmd, false, null);
        };
    }

    return (
        <div
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`outline-none text-sm leading-relaxed text-gray-400 focus:text-gray-800 ${className}`}
        >
            {placeholder}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const QuestionCreation = ({
    totalQuestions = 50,
    currentQuestion = 4,
    chapterName = 'Chapter 1',
    subject = 'English',
    topics = ['Grammar', 'Writing'],
    subTopics = ['Application'],
    duration = 60,
    totalMarks = 250,
    onNext = () => { },
    onExit = () => { },
    onPublish = () => { },
}) => {
    const testId = useParams().testId;
    const [loading, setLoading] = useState(false);
    const [testMeta, setTestMeta] = useState(null);
    const [options, setOptions] = useState([
        { id: 1, text: '' },
        { id: 2, text: '' },
        { id: 3, text: '' },
        { id: 4, text: '' },
    ]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [settings, setSettings] = useState({
        difficulty: '',
        topic: '',
        subTopic: '',
    });
    const execCmdRef = useRef(null);

    const handleAddOption = () =>
        setOptions((prev) => [...prev, { id: Date.now(), text: '' }]);

    const handleDeleteOption = (id) => {
        if (options.length <= 2) return;
        setOptions((prev) => prev.filter((o) => o.id !== id));
        if (selectedOption === id) setSelectedOption(null);
    };

    const handleOptionText = (id, val) =>
        setOptions((prev) =>
            prev.map((o) => (o.id === id ? { ...o, text: val } : o))
        );

    const handleToolbarCmd = (cmd) => {
        if (!cmd) return;
        execCmdRef.current?.(cmd);
    };

    useEffect(() => {
        async function fetchTestDetails() {
            try {
                setLoading(true);
                const response = await apiClient.get(`/tests/${testId}`);
                const data = response.data;
                console.log('Test details:', data);
                if (data?.status === 'success') {
                    setTestMeta(data.data);
                }
            } catch (error) {
                console.error('Error fetching test details:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTestDetails();
    }, []);

    return (
        <div className="position-relative h-screen overflow-y-auto font-sans">
            {/* ── Topbar ── */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200">
                <nav className="flex items-center gap-1.5 text-[13px] text-gray-400">
                    <span>Test Creation</span>
                    <span>/</span>
                    <span>Create Test</span>
                    <span>/</span>
                    <span className="text-gray-800 font-medium uppercase">
                        {testMeta?.type}
                    </span>
                </nav>
                <button
                    onClick={onPublish}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium px-4 py-1.5 rounded-lg transition-colors"
                >
                    Publish
                </button>
            </div>

            {/* ── Meta strip ── */}
            <div className="px-4 py-3 m-4 space-y-2 border border-gray-200 rounded-lg">
                {/* Row 1: chapter chip + chapter name + stats */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex gap-4 flex-col">
                        <div className='flex'>
                            <span className="inline-flex items-center gap-1 bg-mauve-100 text-gray-800 text-xs font-medium px-2 py-1.5 rounded-full uppercase">
                                {testMeta?.type}
                            </span>
                        </div>
                        <div className='flex gap-1.5'>
                            <span className="text-sm">📘</span>
                            <span className="text-sm font-semibold text-gray-800">
                                {testMeta?.name}
                            </span>
                            <span className="inline-flex items-center bg-green-50 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
                                {testMeta?.difficulty}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Edit</span>
                    </div>
                </div>

                {/* Row 2: subject / topic / subtopic */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-col mt-2 gap-2 text-[13px] text-gray-500">
                        <span>
                            <span className="text-gray-400">Subject</span>
                            &nbsp;{testMeta?.subject}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-gray-400">Topic</span>
                            {testMeta?.topics.map((t) => (
                                <span
                                    key={t}
                                    className=" border border-amber-300 text-amber-400 text-xs px-2.5 py-0.5 rounded-full ml-1"
                                >
                                    {t}
                                </span>
                            ))}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-gray-400">Sub Topic</span>
                            {testMeta?.sub_topics.map((t) => (
                                <span
                                    key={t}
                                    className=" border border-amber-300 text-amber-400 text-xs px-2.5 py-0.5 rounded-full ml-1"
                                >
                                    {t}
                                </span>
                            ))}
                        </span>

                    </div>
                    <div className="flex self-end items-end gap-3 text-xs border border-gray-200 p-2 rounded-lg text-gray-500">
                        <span className="flex items-end gap-1 border-r border-gray-200 pr-2">🕐 {testMeta?.total_time} Min</span>
                        <span className="flex items-end gap-1 border-r border-gray-200 pr-2">
                            ❓ {testMeta?.total_questions} Q's
                        </span>
                        <span className="flex items-end gap-1">
                            ⭐ {testMeta?.total_marks} Marks
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Question header ── */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-800">
                    Question <span className="text-indigo-500">{currentQuestion}</span>
                    {' / '}
                    <span className="text-gray-400">{totalQuestions}</span>
                </span>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-red-700 text-xs bg-transparent border-0 cursor-pointer hover:text-red-900 transition-colors">
                        🗑 Delete All Edits
                    </button>
                    <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        ＋ MCQ
                    </button>
                    <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        ⬇ CSV
                    </button>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="flex items-center flex-wrap gap-0.5 px-3 py-1.5 border-b border-gray-200">
                {TOOLBAR_GROUPS.map((group, gi) => (
                    <React.Fragment key={gi}>
                        {gi > 0 && (
                            <span className="w-px h-4 bg-gray-200 mx-1 self-center" />
                        )}
                        {group.map((btn) => (
                            <button
                                key={btn.icon}
                                title={btn.title}
                                aria-label={btn.title}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleToolbarCmd(btn.cmd);
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors border-0 bg-transparent cursor-pointer text-sm"
                            >
                                <i className={`ti ${btn.icon}`} aria-hidden="true" />
                            </button>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            {/* ── Question editor ── */}
            <RichEditor
                placeholder="Type here"
                className="min-h-[100px] px-4 py-3.5 border-b border-gray-200"
                onExecCmd={execCmdRef}
            />

            {/* ── Options ── */}
            <p className="px-4 pt-3 pb-1.5 text-[13px] font-medium text-gray-500">
                Type the options below
            </p>

            {options.map((opt) => (
                <div
                    key={opt.id}
                    className="flex items-center gap-2.5 px-4 py-1.5 border-b border-gray-100"
                >
                    {/* Radio */}
                    <button
                        role="radio"
                        aria-checked={selectedOption === opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={`w-[18px] h-[18px] flex-shrink-0 rounded-full border-[1.5px] flex items-center justify-center transition-colors cursor-pointer bg-transparent
              ${selectedOption === opt.id
                                ? 'border-indigo-500 bg-indigo-500'
                                : 'border-gray-300 hover:border-indigo-300'
                            }`}
                    >
                        {selectedOption === opt.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                        )}
                    </button>

                    <input
                        className="flex-1 border-0 outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
                        placeholder="Type Option here"
                        value={opt.text}
                        onChange={(e) => handleOptionText(opt.id, e.target.value)}
                    />

                    <button
                        onClick={() => handleDeleteOption(opt.id)}
                        aria-label="Delete option"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors border-0 bg-transparent cursor-pointer"
                    >
                        🗑
                    </button>
                </div>
            ))}

            {/* Add option */}
            <div className="px-4 py-2 border-b border-gray-200">
                <button
                    onClick={handleAddOption}
                    className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                    ＋ Add option
                </button>
            </div>

            {/* ── Solution ── */}
            <p className="px-4 pt-3 pb-1.5 text-[13px] font-medium text-gray-500">
                Add Solution
            </p>
            <RichEditor
                placeholder="Type here"
                className="min-h-[90px] px-4 py-3 border-b border-gray-200"
            />

            {/* ── Prev / Next nav ── */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200">
                <button
                    aria-label="Previous question"
                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors bg-white"
                >
                    ‹
                </button>
                <button
                    aria-label="Next question"
                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors bg-white"
                >
                    ›
                </button>
            </div>

            {/* ── Question settings ── */}
            <div className="px-4 py-3.5 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-800 mb-3">
                    Question settings
                </h3>
                <div className="space-y-3">
                    {SETTINGS_FIELDS.map((field) => (
                        <div key={field.key}>
                            <label className="block text-xs text-gray-500 mb-1.5">
                                {field.label}
                            </label>
                            <select
                                value={settings[field.key]}
                                onChange={(e) =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        [field.key]: e.target.value,
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-400 bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors appearance-none"
                            >
                                <option value="">Select from Drop-down</option>
                                {field.options.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <button
                    onClick={onExit}
                    className="bg-red-100 text-red-800 hover:bg-red-200 text-[13px] font-medium px-5 py-2 rounded-lg transition-colors border-0 cursor-pointer"
                >
                    Exit Test Creation
                </button>
                <button
                    onClick={onNext}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium px-6 py-2 rounded-lg transition-colors border-0 cursor-pointer"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default QuestionCreation;
