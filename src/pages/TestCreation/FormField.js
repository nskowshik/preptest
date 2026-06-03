import { Select } from '../../ui';

const FormField = ({ config, value, options, onChange }) => {
    const baseInput =
        'h-14 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-indigo-300';

    switch (config.type) {
        case 'text':
        case 'number':
            return (
                <input
                    type={config.type}
                    value={value ?? ''}
                    onChange={(e) => onChange(config.id, e.target.value)}
                    placeholder={config.placeholder ?? ''}
                    className={baseInput}
                />
            );

        case 'select':
            return (
                <Select
                    label={config.label}
                    value={value ?? ''}
                    options={options ?? []}
                    onChange={(e) => onChange(config.id, e.target.value)}
                />
            );

        case 'multi-select':
            return (
                <Select
                    label={config.label}
                    value={value ?? []}
                    options={options ?? []}
                    onChange={(e) =>
                        onChange(config.id, Array.from(e.target.value).filter(Boolean))
                    }
                    enableMultiple
                />
            );

        case 'radio':
            return (
                <div className="flex h-14 items-center gap-8">
                    {(config.options ?? []).map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-center gap-3">
                            <input
                                className="h-5 w-5"
                                type="radio"
                                checked={value === opt.value}
                                onChange={() => onChange(config.id, opt.value)}
                            />
                            <span className="capitalize">{opt.label}</span>
                        </label>
                    ))}
                </div>
            );

        default:
            return null;
    }
};

export default FormField;