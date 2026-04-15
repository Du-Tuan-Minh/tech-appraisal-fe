import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

interface TechnicalSpec {
    key: string;
    value: string;
}

interface Props {
    value: Record<string, any>; // ✅ đổi sang object
    onChange: (value: Record<string, any>) => void; // ✅ trả object
    className?: string;
}

const TechnicalSpecsEditor = ({ value, onChange, className = "" }: Props) => {
    const [specs, setSpecs] = useState<TechnicalSpec[]>([]);

    // ✅ sync từ parent → local state
    useEffect(() => {
        if (!value || typeof value !== "object") {
            setSpecs([]);
            return;
        }

        const specsArray = Object.entries(value).map(([key, val]) => ({
            key,
            value: typeof val === "object" ? JSON.stringify(val) : String(val)
        }));

        setSpecs(specsArray);
    }, [value]);

    // ✅ build object từ UI
    const buildJson = (list: TechnicalSpec[]) => {
        const obj: Record<string, any> = {};

        list.forEach(s => {
            if (!s.key.trim()) return;

            try {
                obj[s.key.trim()] = JSON.parse(s.value);
            } catch {
                obj[s.key.trim()] = s.value;
            }
        });

        return obj;
    };

    const notifyChange = (newSpecs: TechnicalSpec[]) => {
        setSpecs(newSpecs);
        onChange(buildJson(newSpecs)); // ✅ trả object
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
                                <div key={index} className="flex gap-3 items-start">
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
                <summary className="text-[10px] text-gray-500 uppercase font-bold hover:text-primary-400">
                    Xem JSON
                </summary>
                <pre className="mt-2 p-3 bg-black/40 rounded text-[10px] font-mono text-green-400 border border-dark-800 overflow-x-auto">
                    {JSON.stringify(value || {}, null, 2)}
                </pre>
            </details>
        </div>
    );
};

export default TechnicalSpecsEditor;