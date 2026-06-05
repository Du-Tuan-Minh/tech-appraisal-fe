import { mountBuffer, unmount } from "emscripten-wasm-loader";
import { wrapHunspellInterface } from "hunspell-asm/dist/esm/wrapHunspellInterface.js";
import browserRuntime from "hunspell-asm/dist/esm/lib/browser/hunspell.js";

const basePath = import.meta.env.BASE_URL ?? "/";
const dictionaryPath = (name: string) => `${basePath}dictionaries/${name}`;

let englishChecker: any = null;
let vietnameseChecker: any = null;
let initialized = false;

function createHunspellFactory(asmModule: any) {
    const { cwrap, FS, _free, allocateUTF8, _malloc, getValue, UTF8ToString } = asmModule;
    const hunspellInterface = wrapHunspellInterface(cwrap);
    const memPathId = `/hunspell-${Math.random().toString(36).slice(2, 12)}`;
    FS.mkdir(memPathId);

    const usingParamPtr = (...args: any[]) => {
        const params = [...args];
        const fn = params.pop();
        const paramsPtr = params.map((param) => allocateUTF8(param.normalize()));
        const ret = fn(...paramsPtr);
        paramsPtr.forEach(paramPtr => _free(paramPtr));
        return ret;
    };

    return {
        mountBuffer: mountBuffer(FS, memPathId),
        unmount: unmount(FS, memPathId),
        create: (affPath: string, dictPath: string) => {
            const affPathPtr = allocateUTF8(affPath);
            const dictPathPtr = allocateUTF8(dictPath);
            const hunspellPtr = hunspellInterface.create(affPathPtr, dictPathPtr);
            return {
                dispose: () => {
                    hunspellInterface.destroy(hunspellPtr);
                    _free(affPathPtr);
                    _free(dictPathPtr);
                },
                spell: (word: string) => !!usingParamPtr(word, (wordPtr: any) => hunspellInterface.spell(hunspellPtr, wordPtr)),
                suggest: (word: string) => {
                    const suggestionListPtr = _malloc(4);
                    const suggestionCount = usingParamPtr(word, (wordPtr: any) => hunspellInterface.suggest(hunspellPtr, suggestionListPtr, wordPtr));
                    const suggestionListValuePtr = getValue(suggestionListPtr, '*');
                    const ret = suggestionCount > 0
                        ? Array.from(Array(suggestionCount).keys()).map(idx => UTF8ToString(getValue(suggestionListValuePtr + idx * 4, '*')))
                        : [];
                    hunspellInterface.free_list(hunspellPtr, suggestionListPtr, suggestionCount);
                    _free(suggestionListPtr);
                    return ret;
                },
                addDictionary: (dictPath: string) => usingParamPtr(dictPath, (dictPathPtr: any) => hunspellInterface.add_dic(hunspellPtr, dictPathPtr)) === 1 ? false : true,
                addWord: (word: string) => usingParamPtr(word, (wordPtr: any) => hunspellInterface.add(hunspellPtr, wordPtr)),
                addWordWithAffix: (word: string, affix: string) => usingParamPtr(word, affix, (wordPtr: any, affixPtr: any) => hunspellInterface.add_with_affix(hunspellPtr, wordPtr, affixPtr)),
                removeWord: (word: string) => usingParamPtr(word, (wordPtr: any) => hunspellInterface.remove(hunspellPtr, wordPtr))
            };
        }
    };
}

export async function initializeSpellChecker() {
    if (initialized) return;

    const moduleOptions: any = {};
    const browserRuntimeFactory =
        typeof browserRuntime === "function"
            ? browserRuntime
            : browserRuntime?.default && typeof browserRuntime.default === "function"
                ? browserRuntime.default
                : null;

    if (!browserRuntimeFactory) {
        throw new Error("Hunspell browser runtime is not a callable function.");
    }

    const asmModule = browserRuntimeFactory(moduleOptions);

    await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error("Hunspell runtime initialization timeout")), 10000);
        moduleOptions.onRuntimeInitialized = () => {
            window.clearTimeout(timeout);
            resolve();
        };
        moduleOptions.onAbort = (error: any) => {
            window.clearTimeout(timeout);
            reject(error);
        };
    });

    const factory = createHunspellFactory(asmModule);

    const [enAff, enDic] = await Promise.all([
        fetch(dictionaryPath("en_US.aff")).then(r => {
            if (!r.ok) {
                throw new Error(`Failed to load dictionary: ${dictionaryPath("en_US.aff")} (${r.status})`);
            }
            return r.arrayBuffer();
        }),
        fetch(dictionaryPath("en_US.dic")).then(r => {
            if (!r.ok) {
                throw new Error(`Failed to load dictionary: ${dictionaryPath("en_US.dic")} (${r.status})`);
            }
            return r.arrayBuffer();
        })
    ]);

    englishChecker = factory.create(
        factory.mountBuffer(new Uint8Array(enAff), "en_US.aff"),
        factory.mountBuffer(new Uint8Array(enDic), "en_US.dic")
    );

    const [viAff, viDic] = await Promise.all([
        fetch(dictionaryPath("vi_VN.aff")).then(r => {
            if (!r.ok) {
                throw new Error(`Failed to load dictionary: ${dictionaryPath("vi_VN.aff")} (${r.status})`);
            }
            return r.arrayBuffer();
        }),
        fetch(dictionaryPath("vi_VN.dic")).then(r => {
            if (!r.ok) {
                throw new Error(`Failed to load dictionary: ${dictionaryPath("vi_VN.dic")} (${r.status})`);
            }
            return r.arrayBuffer();
        })
    ]);

    vietnameseChecker = factory.create(
        factory.mountBuffer(new Uint8Array(viAff), "vi_VN.aff"),
        factory.mountBuffer(new Uint8Array(viDic), "vi_VN.dic")
    );

    initialized = true;
    console.log("English checker:", englishChecker);
    console.log("Vietnamese checker:", vietnameseChecker);
}

export function checkWord(word: string): boolean {
    if (!initialized) return true;

    const value = word.trim().toLowerCase();

    if (!value) return true;

    return (
        englishChecker.spell(value) ||
        vietnameseChecker.spell(value)
    );
}

export function suggestWord(word: string): string[] {
    if (!initialized) return [];

    const value = word.trim().toLowerCase();

    return [
        ...englishChecker.suggest(value),
        ...vietnameseChecker.suggest(value)
    ];
}
