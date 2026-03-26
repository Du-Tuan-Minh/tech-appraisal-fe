import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

interface TechnicalSpec {
    key: string;
    value: string;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const TechnicalSpecsEditor = ({ value, onChange, className = "" }: Props) => {
    const [specs, setSpecs] = useState<TechnicalSpec[]>([]);

    useEffect(() => {
        try {
            if (value) {
                const parsed = JSON.parse(value);
                if (JSON.stringify(parsed) !== JSON.stringify(Object.fromEntries(specs.map(s => [s.key, s.value])))) {
                    const specsArray = Object.entries(parsed).map(([key, val]) => ({
                        key,
                        value: String(val)
                    }));
                    setSpecs(specsArray);
                }
            }
        } catch (e) {
        }
    }, [value]);

    // Hàm cập nhật và bắn data ngược lên Parent
    const notifyChange = (newSpecs: TechnicalSpec[]) => {
        setSpecs(newSpecs);
        const jsonObj: Record<string, any> = {};
        newSpecs.forEach(s => {
            if (s.key.trim()) {
                try {
                    // Thử parse xem có phải số hoặc object không, nếu không thì để string
                    jsonObj[s.key.trim()] = JSON.parse(s.value);
                } catch {
                    jsonObj[s.key.trim()] = s.value;
                }
            }
        });
        onChange(JSON.stringify(jsonObj, null, 2));
    };
    const addRow = () => notifyChange([...specs, { key: "", value: "" }]);

    const removeRow = (index: number) => {
        notifyChange(specs.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof TechnicalSpec, val: string) => {
        const newSpecs = [...specs];
        newSpecs[index] = { ...newSpecs[index], [field]: val };
        notifyChange(newSpecs);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-primary-400 uppercase tracking-widest">
                    Thông số kỹ thuật ({specs.length})
                </h4>
                <Button variant="outline" size="sm" onClick={addRow} type="button">
                    + Thêm hàng
                </Button>
            </div>

            <Card className="bg-dark-950/50 border-dark-700">
                <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
                    {specs.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-sm italic">Chưa có dữ liệu thông số.</p>
                            <Button variant="ghost" size="sm" onClick={addRow} className="mt-2 text-primary-500">
                                Tạo hàng đầu tiên
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex gap-3 items-start animate-fadeIn">
                                    <Input
                                        placeholder="Tên (Key)..."
                                        value={spec.key}
                                        onChange={(v) => updateRow(index, "key", v)}
                                        className="flex-1"
                                    />
                                    <Input
                                        placeholder="Giá trị (Value)..."
                                        value={spec.value}
                                        onChange={(v) => updateRow(index, "value", v)}
                                        className="flex-1"
                                    />
                                    <Button
                                        variant="ghost"
                                        className="text-red-500 hover:bg-red-500/10 mt-1"
                                        onClick={() => removeRow(index)}
                                        type="button"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <details className="cursor-pointer group">
                <summary className="text-[10px] text-gray-500 uppercase font-bold hover:text-primary-400 transition-colors">
                    Xem cấu trúc JSON thực tế
                </summary>
                <pre className="mt-2 p-3 bg-black/40 rounded text-[10px] font-mono text-accent-green border border-dark-800 overflow-x-auto">
                    {value || "{}"}
                </pre>
            </details>
        </div>
    );
};

export default TechnicalSpecsEditor;