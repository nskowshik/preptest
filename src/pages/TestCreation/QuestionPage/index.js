import React, { useState, useRef, useEffect } from 'react';
import { data, useParams } from 'react-router-dom';
import apiClient from '../../../api';
import { RichEditor, Select } from '../../../ui';
import QuestionSidebar from './Sidebar';


const DIFFICULTY_OPTIONS = [{
    value: 'Easy',
    label: 'Easy'
}, {
    value: 'Medium',
    label: 'Medium'
}, {
    value: 'Hard',
    label: 'Hard'
}]


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
    const [solution, setSolution] = useState('');
    const [settingsOptions, setSettingsOptions] = useState({
        difficulty: DIFFICULTY_OPTIONS,
        topic: [],
        subTopic: []
    });
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
                if (data?.status === 'success') {
                    setTestMeta(data.data);
                    setSettingsOptions({
                        topic: data.data.topics?.map(topic => ({ value: topic, label: topic })),
                        subTopic: data.data.sub_topics?.map(subTopic => ({ value: subTopic, label: subTopic }))
                    });
                }
            } catch (error) {
                console.error('Error fetching test details:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTestDetails();
    }, []);

    if (false) {
        return (
            <div className="position-relative h-screen overflow-y-auto font-sans">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading test details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full h-full overflow-y-auto font-sans">
            <QuestionSidebar />
            <main className="flex-1">
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

                <div className="px-4 py-3 m-4 space-y-2 border border-gray-200 rounded-lg">
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

                        <div className="flex cursor-pointer self-start gap-3 text-lg text-gray-500">
                            <span>&#9998;</span>
                        </div>
                    </div>

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
                <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm font-medium text-gray-800">
                        Question <span className="text-indigo-500">{currentQuestion}</span>
                        {' / '}
                        <span className="text-gray-400">{totalQuestions}</span>
                    </span>
                    <div className="flex items-center gap-2">

                        <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            ＋ MCQ
                        </button>
                        <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            ⬇ CSV
                        </button>
                    </div>
                </div>


                {/* ── Toolbar ── */}
                <div className="flex flex-col gap-4 px-4 py-1.5">
                    <div className='flex'>
                        <button className="flex items-center gap-1 text-red-700 text-xs bg-transparent border-0 cursor-pointer hover:text-red-900 transition-colors">
                            🗑 Delete All Edits
                        </button>
                    </div>
                    <div className="flex-1">
                        <RichEditor />
                    </div>
                </div>


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
                            className={`w-[18px] h-[18px] shrink-0 rounded-full border-[1.5px] flex items-center justify-center transition-colors cursor-pointer bg-transparent
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

                {/* ── Solution ── */}
                <p className="px-4 pt-3 pb-1.5 text-[13px] font-medium text-gray-500">
                    Add Solution
                </p>
                <div className="px-4 pt-3 pb-1.5">
                    <Select label='Type solution here' />
                </div>
                <div className="p-4">
                    <textarea
                        className="w-full h-full border border-gray-200 p-2 rounded text-sm bg-transparent text-gray-800 placeholder-gray-400"
                        placeholder="Explain the solution here"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                    />
                </div>

                <div className='flex gap-4 flex-wrap px-4 pt-3 pb-1.5'>
                    <Select label='Difficulty' options={DIFFICULTY_OPTIONS} value={settings.difficulty} onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })} />
                    <Select label='Topic' options={settingsOptions?.topics} value={settings.topics} onChange={(e) => setSettings({ ...settings, topics: e.target.value })} />
                    <Select label='Subtopic' options={settingsOptions?.sub_topics} value={settings.sub_topics} onChange={(e) => setSettings({ ...settings, sub_topics: e.target.value })} />
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between px-4 py-3">
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
            </main>
        </div>
    );
};

export default QuestionCreation;
