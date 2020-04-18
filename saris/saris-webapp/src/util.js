

export function mergeClassNames(...names) {
    let merged = "";
    names.forEach(name => {
        if (name !== null && typeof name !== "undefined" && name !== "") {
            if (merged.length > 0) {
                merged += " ";
            }
            merged += name;
        }
    });
    return merged;

}

export function orElse (obj, defaultValue) {
    return obj ? obj : defaultValue;
}
export function orElseGet(obj, defaultValueProvider) {
    return obj ? obj : defaultValueProvider();
}
export function firstNonNull(...values) {
    for (const v of values) {
        if (v !== null && typeof v !== "undefined") {
            return v;
        }
    }
    return undefined;
}

export function resolveIndirect(value) {
    while (value !== null && typeof value === "function") {
        value = value();
    }
    return value;
}
export function resolveIndirectToString(value, defaultValue) {
    const resolved = resolveIndirect(value);
    if (resolved === null || typeof resolved === "undefined") {
        return defaultValue;
    }
    return (typeof resolved === "string") ? resolved : ("" + resolved);
}
