import apiClient from "../../api";

const TABS = [
    { label: 'Chapter Wise', value: 'chapterwise' },
    { label: 'PYQ', value: 'pyq' },
    { label: 'Mock Test', value: 'mock' },
];

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'difficult'];

const FORM_CONFIG = [
    // ── Main section ────────────────────────────────────────────
    {
        id: 'subject',
        label: 'Subject',
        type: 'select',
        storeKey: 'subject',
        section: 'main',
        span: 'col-span-1',
        defaultValue: '',
        placeholder: 'Select Subject',
        fetchOptions: async () => {
            const res = await apiClient.get('/subjects');
            return res.data?.data?.map((s) => ({ label: s.name, value: s.id })) ?? [];
        },
        // Changing subject resets downstream fields
        onChangeSideEffects: ['topics', 'subTopics'],
        triggerFetch: ['topics'],          // which fields should re-fetch when this changes
    },
    {
        id: 'name',
        label: 'Name of Test',
        type: 'text',
        storeKey: 'name',
        section: 'main',
        span: 'col-span-1',
        defaultValue: '',
        placeholder: 'Enter name of Test',
    },
    {
        id: 'topics',
        label: 'Topic',
        type: 'multi-select',
        storeKey: 'topics',
        section: 'main',
        span: 'col-span-1',
        defaultValue: [],
        placeholder: 'Select Topic',
        dependsOn: 'subject',
        fetchOptions: async (subjectId) => {
            if (!subjectId) return [];
            const res = await apiClient.get(`/topics/subject/${subjectId}`);
            return res.data?.data?.map((t) => ({ label: t.name, value: t.id })) ?? [];
        },
        onChangeSideEffects: ['subTopics'],
        triggerFetch: ['subTopics'],
    },
    {
        id: 'subTopics',
        label: 'Sub Topic',
        type: 'multi-select',
        storeKey: 'sub_topics',
        section: 'main',
        span: 'col-span-1',
        defaultValue: [],
        placeholder: 'Select Sub Topic',
        dependsOn: 'topics',
        // Called once per selected topicId; results are merged
        fetchOptions: async (topicIds) => {
            if (!topicIds?.length) return [];
            const results = await Promise.all(
                topicIds.map((id) =>
                    apiClient.get(`/sub-topics/topic/${id}`)
                        .then((r) => r.data?.data?.map((st) => ({ label: st.name, value: st.id })) ?? [])
                        .catch(() => [])
                )
            );
            return results.flat();
        },
    },
    {
        id: 'duration',
        label: 'Duration (Minutes)',
        type: 'number',
        storeKey: 'duration',
        section: 'main',
        span: 'col-span-1',
        defaultValue: '',
        placeholder: 'Enter duration',
    },
    {
        id: 'difficulty',
        label: 'Test Difficulty Level',
        type: 'radio',
        storeKey: 'difficulty',
        section: 'main',
        span: 'col-span-1',
        defaultValue: 'easy',
        options: DIFFICULTY_OPTIONS.map((d) => ({ label: d, value: d })),
    },

    // ── Marking scheme section ───────────────────────────────────
    {
        id: 'wrong_marks',
        label: 'Wrong Answer',
        type: 'number',
        storeKey: 'wrong_marks',
        section: 'marking',
        span: 'col-span-1',
        defaultValue: '',
    },
    {
        id: 'unattempt_marks',
        label: 'Unattempted',
        type: 'number',
        storeKey: 'unattempt_marks',
        section: 'marking',
        span: 'col-span-1',
        defaultValue: '',
    },
    {
        id: 'correct_marks',
        label: 'Correct Answer',
        type: 'number',
        storeKey: 'correct_marks',
        section: 'marking',
        span: 'col-span-1',
        defaultValue: '',
    },
    {
        id: 'total_questions',
        label: 'No of Questions',
        type: 'number',
        storeKey: 'total_questions',
        section: 'marking',
        span: 'col-span-1',
        defaultValue: '',
        placeholder: 'Ex: 250',
    },
    {
        id: 'total_marks',
        label: 'Total Marks',
        type: 'number',
        storeKey: 'total_marks',
        section: 'marking',
        span: 'col-span-1',
        defaultValue: '',
        placeholder: 'Ex: 250 Marks',
    },
];

export { TABS, DIFFICULTY_OPTIONS, FORM_CONFIG };