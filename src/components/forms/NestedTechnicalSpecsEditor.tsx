import { useState, useEffect, useCallback } from "react";
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
    onChange: (value: string) => void;
    className?: string;
}

const NestedTechnicalSpecsEditor = ({ value, onChange, className = "" }: Props) => {
    const [topics, setTopics] = useState<Topic[]>([]);

    useEffect(() => {
        try {
            if (value) {
                const parsed = JSON.parse(value);
                const topicsArray: Topic[] = Object.entries(parsed).map(([topicTitle, topicData]) => ({
                    id: crypto.randomUUID(), // Sử dụng chuẩn mới thay vì Math.random
                    title: topicTitle,
                    subItems: typeof topicData === 'object' && topicData !== null
                        ? Object.entries(topicData).map(([key, val]) => ({
                            id: crypto.randomUUID(),
                            key,
                            value: String(val)
                        }))
                        : []
                }));
                setTopics(topicsArray);
            }
        } catch (e) {
        }
    }, [value]);

    const notifyChange = useCallback((newTopics: Topic[]) => {
        setTopics(newTopics);
        const jsonObj: Record<string, Record<string, any>> = {};

        newTopics.forEach(topic => {
            jsonObj[topic.title] = {};
            topic.subItems.forEach(subItem => {
                if (subItem.key.trim()) {
                    try {
                        jsonObj[topic.title][subItem.key.trim()] = JSON.parse(subItem.value);
                    } catch {
                        jsonObj[topic.title][subItem.key.trim()] = subItem.value;
                    }
                }
            });
        });

        onChange(JSON.stringify(jsonObj, null, 2));
    }, [onChange]);

    const addTopic = () => {
        const newTopic: Topic = { id: crypto.randomUUID(), title: "", subItems: [] };
        notifyChange([...topics, newTopic]);
    };

    const updateTopic = (index: number, title: string) => {
        const newTopics = topics.map((t, i) => i === index ? { ...t, title } : t);
        notifyChange(newTopics);
    };

    const addSubItem = (topicIndex: number) => {
        const newTopics = [...topics];
        newTopics[topicIndex].subItems.push({ id: crypto.randomUUID(), key: "", value: "" });
        notifyChange(newTopics);
    };

    const updateSubItem = (tIdx: number, sIdx: number, field: keyof SubItem, val: string) => {
        const newTopics = [...topics];
        newTopics[tIdx].subItems[sIdx] = { ...newTopics[tIdx].subItems[sIdx], [field]: val };
        notifyChange(newTopics);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-between items-end">
                <FormField label={`Thông số kỹ thuật (${topics.length} chủ đề)`} required />
                <Button variant="outline" size="sm" onClick={addTopic} type="button">
                    + Thêm chủ đề
                </Button>
            </div>

            <Card className="bg-dark-950/50 p-4 border-dark-700">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar space-y-6">
                    {topics.length === 0 ? (
                        <div className="text-center py-10 opacity-50 italic text-sm">
                            Chưa có dữ liệu thông số.
                        </div>
                    ) : (
                        topics.map((topic, tIdx) => (
                            <div key={topic.id} className="group relative border border-dark-700 rounded-lg p-4 bg-dark-800/40 hover:border-primary-900/50 transition-colors">
                                <div className="flex gap-3 mb-4">
                                    <Input
                                        placeholder="Tên chủ đề (ví dụ: Vi xử lý, RAM...)"
                                        value={topic.title}
                                        onChange={(v) => updateTopic(tIdx, v)}
                                        className="font-bold text-primary-400"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => notifyChange(topics.filter((_, i) => i !== tIdx))}
                                        className="text-red-500 hover:bg-red-500/10"
                                    >✕</Button>
                                </div>

                                <div className="pl-6 space-y-3 border-l border-dark-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Chi tiết cấu hình</span>
                                        <Button variant="ghost" size="sm" onClick={() => addSubItem(tIdx)} className="h-7 text-xs text-primary-500">
                                            + Thêm dòng
                                        </Button>
                                    </div>

                                    {topic.subItems.map((sub, sIdx) => (
                                        <div key={sub.id} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                                            <Input
                                                placeholder="Khóa (Key)"
                                                value={sub.key}
                                                onChange={(v) => updateSubItem(tIdx, sIdx, "key", v)}
                                                className="text-sm"
                                            />
                                            <Input
                                                placeholder="Giá trị (Value)"
                                                value={sub.value}
                                                onChange={(v) => updateSubItem(tIdx, sIdx, "value", v)}
                                                className="text-sm"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const newTopics = [...topics];
                                                    newTopics[tIdx].subItems.splice(sIdx, 1);
                                                    notifyChange(newTopics);
                                                }}
                                                className="text-gray-600 hover:text-red-400"
                                            >✕</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <details className="group">
                <summary className="text-[10px] text-gray-600 cursor-pointer uppercase font-bold hover:text-primary-500">
                    Raw JSON Output
                </summary>
                <pre className="mt-2 p-3 bg-black/60 rounded border border-dark-800 text-[10px] text-green-500 overflow-x-auto font-mono">
                    {value || "{}"}
                </pre>
            </details>
        </div>
    );
};

export default NestedTechnicalSpecsEditor;