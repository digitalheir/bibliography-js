/**
 * Nested strings should be immune from transformations such as toLowerCase
 */
 export interface NestedString {
    data: ComplexString;
}

export type ComplexString = (string | NestedString)[]

export function capitalizeFirstChar(str: ComplexString): ComplexString {
    if (str.length <= 0) return str; 
    const lowercased = lowercase(str);

    const first = lowercased[0];
    if (isString(first)) {
        return ([
            first.charAt(0).toUpperCase(),
            first.substring(1)
        ] as ComplexString).concat(
            lowercased.slice(1)
        )
    } else {
        return lowercased;
    }
}

export function lowercase(str: ComplexString): ComplexString {
   return str.map(s => { if (isString(s)) return s.toLowerCase(); else return s; });
}

function isString(s: any): s is string {
    return typeof s === "string";
}

export function nestedStringToString(str: NestedString | string): string {
    if (isString(str)) { return str; }
    else { return complexStringToString(str.data);}
}

export function complexStringToString(str: ComplexString): string {
    return str.map(nestedStringToString).join("");
}
