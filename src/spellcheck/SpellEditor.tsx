import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
    initializeSpellChecker,
    checkWord,
    suggestWord
} from "./spellChecker";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function SpellEditor({
    value,
    onChange
}: Props) {

    const [invalidWords, setInvalidWords] = useState<
        { word: string; suggestions: string[] }[]
    >([]);
    const [spellCheckReady, setSpellCheckReady] = useState(false);
    const [spellCheckStatus, setSpellCheckStatus] = useState<"loading" | "ready" | "failed">("loading");
    const [spellCheckError, setSpellCheckError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function init() {
            try {
                await initializeSpellChecker();
                if (mounted) {
                    setSpellCheckReady(true);
                    setSpellCheckStatus("ready");
                    setSpellCheckError(null);
                    console.log("Spell checker is ready");
                }
            } catch (error: any) {
                const message = error?.message || String(error);
                console.error("Spell checker initialization failed:", error);
                if (mounted) {
                    setSpellCheckStatus("failed");
                    setSpellCheckError(message);
                }
            }
        }

        init();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!spellCheckReady) {
            setInvalidWords([]);
            return;
        }

        const words = value.match(/\p{L}+/gu) ?? [];

        const wrongWords = words
            .filter(word => !checkWord(word))
            .map(word => ({
                word,
                suggestions: suggestWord(word).slice(0, 5)
            }));

        setInvalidWords(wrongWords);
    }, [spellCheckReady, value]);

    const editor = useEditor({
        extensions: [StarterKit],

        content: value,

        editorProps: {
            attributes: {
                spellcheck: "false"
            }
        },

        onUpdate: ({ editor }) => {
            const text = editor.getText();
            console.log("SpellEditor onUpdate", { spellCheckStatus, text });
            onChange(text);
        }
    });

    return (
        <div className="space-y-3">

            {spellCheckStatus === "loading" && (
                <div className="text-xs text-gray-400">
                    Đang tải kiểm tra chính tả...
                </div>
            )}

            {spellCheckStatus === "failed" && (
                <div className="space-y-1 text-xs text-red-400">
                    <div>Không khởi tạo được kiểm tra chính tả.</div>
                    <div>Chi tiết: {spellCheckError || "Không xác định."}</div>
                </div>
            )}

            <div className="border border-dark-700 rounded-lg">
                <EditorContent
                    editor={editor}
                    className="min-h-[120px] p-3"
                />
            </div>

            {invalidWords.length > 0 && (
                <div className="border border-red-500 rounded-lg p-3 text-sm">

                    <div className="font-semibold mb-2">
                        Từ có thể sai:
                    </div>

                    {invalidWords.map((item, index) => (
                        <div
                            key={`${item.word}-${index}`}
                            className="mb-2"
                        >
                            <span className="text-red-500 font-medium">
                                {item.word}
                            </span>

                            {item.suggestions.length > 0 && (
                                <span className="ml-2 text-gray-400">
                                    → {item.suggestions.join(", ")}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
