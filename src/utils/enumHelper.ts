export const getEnumMapValue = <
    TEnum extends Record<string, string | number>,
    TMap extends Record<string, any>
>(
    map: TMap,
    enumObj: TEnum,
    value: number | string | null | undefined
): TMap[keyof TMap] | undefined => {
    if (value === null || value === undefined || value === "") return undefined;

    if (value in enumObj && typeof enumObj[value as any] === "number") {
        const numericValue = enumObj[value as any];
        return map[numericValue as keyof TMap];
    }

    const rawKeyOrValue = enumObj[value as keyof TEnum];
    if (rawKeyOrValue === undefined) return undefined;

    const finalKey = typeof rawKeyOrValue === "number" ? String(value) : rawKeyOrValue;
    return map[finalKey as keyof TMap];
};