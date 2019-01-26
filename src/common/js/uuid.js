export default function uuid() {
    return (random() + random() + "-" + random() + "-" + random() + random() + random());
}

export function random() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}