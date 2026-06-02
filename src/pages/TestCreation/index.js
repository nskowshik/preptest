import React, { useState, useEffect } from 'react';
import { Select } from '../../ui';
import apiClient from '../../api';

const TestCreation = () => {
    const [difficulty, setDifficulty] = useState('easy');
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [formData, setFormData] = useState({
        subject: '',
        topic: '',
        subTopic: '',
    });

    const fetchSubjects = async () => {
        try {
            const response = await apiClient.get('/subjects');
            const subjectsData = response.data;
            const subjectsOptions = subjectsData?.data?.map((subject) => ({ label: subject.name, value: subject.id }));
            setSubjects(subjectsOptions);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const getTopicBySubject = async (subjectId) => {
        try {
            const response = await apiClient.get(`/topics/subject/${subjectId}`);
            const topics = response.data;
            const topicsOptions = topics?.data?.map((topic) => ({ label: topic.name, value: topic.id }));
            setTopics(topicsOptions);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const getSubTopics = async (topicId) => {
        try {
            const data = await apiClient.get(`/sub-topics/topic/${topicId}`);
            const subTopics = data.data;
            const subTopicsOptions = subTopics?.data?.map((subTopic) => ({ label: subTopic.name, value: subTopic.id }));
            setSubTopics(subTopicsOptions);
        } catch (error) {
            console.error('Error fetching sub-topics:', error);
        }
    };

    const handleSubjectChange = (event) => {
        const subjectId = event.target.value;
        setFormData({
            ...formData,
            subject: subjectId,
        });
        getTopicBySubject(subjectId);
    };

    const handleTopicChange = (event) => {
        const topicId = event.target.value;
        setFormData({
            ...formData,
            topic: topicId,
        });
        getSubTopics(topicId);
    };

    const handleSubtopicChange = (event) => {
        const subTopicId = event.target.value;
        setFormData({
            ...formData,
            subTopic: subTopicId,
        });
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    return (
        <div className="min-h-screen bg-white p-4">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-3 text-gray-500">
                <span>Test Creation</span>
                <span>/</span>
                <span>Create Test</span>
                <span>/</span>
                <span className="text-gray-800">Chapter Wise</span>
            </div>

            {/* Tabs */}
            <div className="mb-4 inline-flex rounded-xl border p-0.5    ">
                <button className="rounded-lg bg-indigo-50 px-4 py-2 text-indigo-600">
                    Chapter Wise
                </button>

                <button className="px-4 py-2 text-gray-500">PYQ</button>

                <button className="px-4 py-2 text-gray-500">Mock Test</button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                {/* Subject */}
                <div>
                    <label className="mb-3 block  ">Subject</label>
                    <Select label="Subject" value={formData.subject} options={subjects} onChange={handleSubjectChange} />
                </div>

                {/* Test Name */}
                <div>
                    <label className="mb-3 block  ">Name of Test</label>
                    <input
                        placeholder="Enter name of Test"
                        className="h-14 w-full rounded-xl border px-4"
                    />
                </div>

                {/* Topic */}
                <div>
                    <label className="mb-3 block  ">Topic</label>
                    <Select label="Topic" value={formData.topic} options={topics} onChange={handleTopicChange} />
                </div>

                {/* Sub Topic */}
                <div>
                    <label className="mb-3 block  ">Sub Topic</label>
                    <Select label="Sub Topic" value={formData.subTopic} options={subTopics} onChange={handleSubtopicChange} />

                </div>

                {/* Duration */}
                <div>
                    <label className="mb-3 block  ">Duration (Minutes)</label>
                    <input
                        type="number"
                        placeholder="Enter duration"
                        className="h-14 w-full rounded-xl border px-4"
                    />

                </div>

                {/* Difficulty */}
                <div>

                    <label className="mb-1 block  ">
                        Test Difficulty Level
                    </label>

                    <div className="flex gap-8">
                        {['easy', 'medium', 'difficult'].map((item) => (
                            <label
                                key={item}
                                className="flex cursor-pointer items-center gap-3"
                            >
                                <input
                                    type="radio"
                                    checked={difficulty === item}
                                    onChange={() => setDifficulty(item)}
                                />

                                <span className="capitalize">{item}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Marking Scheme */}
            <div className="mt-8">
                <h3 className="mb-8 text-2xl ">Marking Scheme:</h3>

                <div className="grid grid-cols-5 gap-10">
                    <div>
                        <label className="mb-3 block ">Wrong Answer</label>

                        <input
                            defaultValue="-1"
                            className="h-14 w-full rounded-xl border px-4"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block ">Unattempted</label>

                        <input
                            defaultValue="+0"
                            className="h-14 w-full rounded-xl border px-4"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block ">Correct Answer</label>

                        <input
                            defaultValue="+5"
                            className="h-14 w-full rounded-xl border px-4"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block ">No of Questions</label>

                        <input
                            placeholder="Ex:250"
                            className="h-14 w-full rounded-xl border px-4"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block  text-gray-400">
                            Total Marks
                        </label>

                        <input
                            placeholder="Ex:250 Marks"
                            className="h-14 w-full rounded-xl border px-4"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-16 flex justify-end gap-6">
                <button className="h-14 rounded-xl bg-gray-100 px-12 text-indigo-600">
                    Cancel
                </button>

                <button className="h-14 rounded-xl bg-indigo-500 px-12 text-white">
                    Next
                </button>
            </div>
        </div>
    );
};

export default TestCreation;
