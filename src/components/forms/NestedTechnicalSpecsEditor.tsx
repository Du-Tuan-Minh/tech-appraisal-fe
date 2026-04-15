import { useState, useEffect, useCallback, useRef } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import FormField from "../ui/FormField";

interface SubItem {
    id: string;
    key: string;
    value: string;
}

interface Topic {
    id: string;
    title: string;
    subItems: SubItem[];
}

interface Props {
    value: string;
    onChange?: (value: string) => void;
    onSelectPath?: (path: string) => void;
    className?: string;
    readOnly?: boolean;
}

const NestedTechnicalSpecsEditor = ({ value, onChange, onSelectPath, className = "", readOnly = false }: Props) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const isInternalUpdate = useRef(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }
        try {
            const parsed = value ? JSON.parse(value) : {};
            const topicsArray: Topic[] = Object.entries(parsed).map(([title, data]) => ({
                id: crypto.randomUUID(),
                title,
                subItems: typeof data === 'object' && data !== null
                    ? Object.entries(data).map(([k, v]) => ({
                        id: crypto.randomUUID(),
                        key: k,
                        value: typeof v === 'object' ? JSON.stringify(v) : String(v)
                    }))
                    : []
            }));
            setTopics(topicsArray);
        } catch (e) {
            console.error("Lỗi parse JSON đầu vào:", e);
        }
    }, [value]);

    const syncToParent = useCallback((newTopics: Topic[]) => {
        if (readOnly || !onChange) return;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            const jsonObj: Record<string, any> = {};
            newTopics.forEach(t => {
                const cleanTitle = t.title.trim();
                if (!cleanTitle) return;

                jsonObj[cleanTitle] = {};
                t.subItems.forEach(s => {
                    const cleanKey = s.key.trim();
                    if (!cleanKey) return;

                    const val = s.value.trim();
                    if ((val.startsWith('{') || val.startsWith('['))) {
                        try {
                            jsonObj[cleanTitle][cleanKey] = JSON.parse(val);
                        } catch {
                            jsonObj[cleanTitle][cleanKey] = s.value;
                        }
                    } else {
                        jsonObj[cleanTitle][cleanKey] = s.value;
                    }
                });
            });

            isInternalUpdate.current = true;
            onChange(JSON.stringify(jsonObj, null, 2));
        }, 500);
    }, [onChange, readOnly]);

    const handleUpdate = (updater: (old: Topic[]) => Topic[]) => {
        if (readOnly) return;
        const next = updater(topics);
        setTopics(next);
        syncToParent(next);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-between items-center">
                <FormField label={`Thông số kỹ thuật (${topics.length})`} />
                <Button variant="outline" size="sm" onClick={() => handleUpdate(prev => [...prev, { id: crypto.randomUUID(), title: "", subItems: [] }])} type="button">
                    + Thêm chủ đề
                </Button>
            </div>

            <Card className="bg-dark-950/50 p-4 border-dark-700 max-h-[600px] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                    {topics.map((topic, tIdx) => (
                        <div key={topic.id} className="group relative border border-dark-700 rounded-lg p-4 bg-dark-800/40 hover:border-primary-500/30 transition-all">
                            <div className="flex gap-3 mb-4">
                                <Input
                                    placeholder="Tên chủ đề"
                                    value={topic.title}
                                    onChange={(v) => handleUpdate(prev => prev.map((t, i) => i === tIdx ? { ...t, title: v } : t))}
                                    className="font-bold text-primary-400 border-none bg-transparent focus:bg-dark-900"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500"
                                    onClick={() => handleUpdate(prev => prev.filter((_, i) => i !== tIdx))}
                                >✕</Button>
                            </div>

                            <div className="pl-6 space-y-3 border-l-2 border-dark-700">
                                {topic.subItems.map((sub, sIdx) => (
                                    <div key={sub.id} className="group/item flex gap-2 items-center">
                                        <Input
                                            placeholder="Key"
                                            value={sub.key}
                                            onChange={(v) => handleUpdate(prev => {
                                                const next = [...prev];
                                                next[tIdx].subItems[sIdx].key = v;
                                                return next;
                                            })}
                                            className="text-sm h-8"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => onSelectPath?.(`${topic.title} > ${sub.key}`)}
                                            className="px-2 text-primary-500 hover:scale-125 transition-transform opacity-0 group-hover/item:opacity-100"
                                            title="Trích xuất vị trí này"
                                        >
                                            📍
                                        </button>

                                        <Input
                                            placeholder="Value"
                                            value={sub.value}
                                            onChange={(v) => handleUpdate(prev => {
                                                const next = [...prev];
                                                next[tIdx].subItems[sIdx].value = v;
                                                return next;
                                            })}
                                            className="text-sm h-8"
                                        />

                                        <button
                                            type="button"
                                            className="text-gray-600 hover:text-red-500 px-1"
                                            onClick={() => handleUpdate(prev => {
                                                const next = [...prev];
                                                next[tIdx].subItems = next[tIdx].subItems.filter((_, i) => i !== sIdx);
                                                return next;
                                            })}
                                        >✕</button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleUpdate(prev => {
                                        const next = [...prev];
                                        next[tIdx].subItems.push({ id: crypto.randomUUID(), key: "", value: "" });
                                        return next;
                                    })}
                                    className="text-[10px] text-primary-500 hover:underline uppercase font-bold"
                                >
                                    + Thêm dòng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <details className="group mt-4">
                <summary className="text-[10px] text-gray-600 cursor-pointer uppercase font-bold hover:text-primary-500 transition-colors">
                    View Raw Specifications JSON
                </summary>
                <pre className="mt-2 p-3 bg-black/60 rounded border border-dark-800 text-[10px] text-green-500 overflow-x-auto font-mono custom-scrollbar">
                    {value || "{}"}
                </pre>
            </details>
        </div>
    );
};

export default NestedTechnicalSpecsEditor;