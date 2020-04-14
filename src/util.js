

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