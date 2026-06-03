import React, { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { setTests } from '../../store/testSlice';
import { TABS, FORM_CONFIG } from './constants';
import FormField from './FormField';
import { useNavigate } from 'react-router-dom';

const buildDefaultFormData = () =>
    FORM_CONFIG.reduce((acc, field) => {
        acc[field.storeKey] = field.defaultValue;
        return acc;
    }, {});

const TestCreation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const storedTest = useSelector((state) => state.test);

    const [formData, setFormData] = useState(() => ({
        ...buildDefaultFormData(),
        ...storedTest,
    }));
    const formDataRef = useRef(formData);
    formDataRef.current = formData;

    const [fieldOptions, setFieldOptions] = useState({});
    const [activeTab, setActiveTab] = useState(TABS[0].value);
    const [loading, setLoading] = useState(false);

    const loadOptions = useCallback(async (fieldConfig, depValue) => {
        if (!fieldConfig.fetchOptions) return;
        try {
            const options = await fieldConfig.fetchOptions(depValue);
            setFieldOptions((prev) => ({ ...prev, [fieldConfig.id]: options }));
        } catch (err) {
            console.error(`Error loading options for "${fieldConfig.id}":`, err);
        }
    }, []);

    useEffect(() => {
        FORM_CONFIG.forEach((field) => {
            if (field.fetchOptions && !field.dependsOn) {
                loadOptions(field, undefined);
            }
        });

        return () => {
            dispatch(setTests(formDataRef.current));
        };
    }, [dispatch, loadOptions]);

    const handleChange = useCallback(
        (fieldId, newValue) => {
            const fieldConfig = FORM_CONFIG.find((f) => f.id === fieldId);
            if (!fieldConfig) return;

            setFormData((prev) => {
                const next = { ...prev, [fieldConfig.storeKey]: newValue };

                (fieldConfig.onChangeSideEffects ?? []).forEach((sideId) => {
                    const sideField = FORM_CONFIG.find((f) => f.id === sideId);
                    if (sideField) next[sideField.storeKey] = sideField.defaultValue;
                });

                return next;
            });

            (fieldConfig.triggerFetch ?? []).forEach((depFieldId) => {
                const depField = FORM_CONFIG.find((f) => f.id === depFieldId);
                if (depField) loadOptions(depField, newValue);
            });
        },
        [loadOptions]
    );

    const createTest = async () => {
        setLoading(true);
        try {

            const response = await apiClient.post('/tests', formData);
            console.log('Test created:', response);
            if (response?.data?.status === "success") {
                navigate(`/test-questions/${response?.data?.data?.id}`);
                // TODO: Navigate to test details or show success message
            }
        } catch (err) {
            console.error('Error creating test:', err);
        } finally {
            setLoading(false);
        }
    };

    const mainFields = FORM_CONFIG.filter((f) => f.section === 'main');
    const markingFields = FORM_CONFIG.filter((f) => f.section === 'marking');

    return (
        <div className="min-h-screen bg-white p-6 text-sm">
            <div className="mb-6 flex items-center gap-3 text-gray-500">
                <span>Test Creation</span>
                <span>/</span>
                <span>Create Test</span>
                <span>/</span>
                <span className="text-gray-800">{TABS.find((t) => t.value === activeTab)?.label}</span>
            </div>

            <div className="mb-4 inline-flex rounded-xl border p-0.5">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => {
                            setActiveTab(tab.value)
                            setFormData(prevState => ({ ...prevState, type: tab.value }))
                        }}
                        className={
                            activeTab === tab.value
                                ? 'rounded-lg bg-indigo-50 px-4 py-2 text-indigo-600'
                                : 'px-4 py-2 text-gray-500'
                        }
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                {mainFields.map((field) => (
                    <div key={field.id} className={field.span}>
                        <label className="mb-3 block">{field.label}</label>
                        <FormField
                            config={field}
                            value={formData[field.storeKey]}
                            options={fieldOptions[field.id]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h3 className="mb-8 text-2xl">Marking Scheme:</h3>
                <div className="grid grid-cols-5 gap-10">
                    {markingFields.map((field) => (
                        <div key={field.id}>
                            <label className="mb-3 block">{field.label}</label>
                            <FormField
                                config={field}
                                value={formData[field.storeKey]}
                                options={fieldOptions[field.id]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-16 flex justify-end gap-6">
                <button className="rounded-xl bg-gray-100 py-[7px] px-[18px] text-indigo-600">
                    Cancel
                </button>
                <button
                    className="rounded-xl bg-indigo-500 py-[7px] px-[18px] text-white"
                    onClick={createTest}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TestCreation;