export function nullIfUndefined<T>(value: T | undefined): T | null {
    if (value === undefined) {
        return null;
    }
    return value;
}