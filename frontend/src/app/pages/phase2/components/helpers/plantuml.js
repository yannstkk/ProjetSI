
const PLANTUML_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

function append3bytes(b1, b2, b3) {
    const c1 = b1 >> 2;
    const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
    const c4 = b3 & 0x3f;
    return (
        PLANTUML_CHARS[c1] +
        PLANTUML_CHARS[c2] +
        PLANTUML_CHARS[c3] +
        PLANTUML_CHARS[c4]
    );
}

function encode64(data) {
    let r = "";
    for (let i = 0; i < data.length; i += 3) {
        if (i + 2 === data.length) {
            r += append3bytes(data[i], data[i + 1], 0);
            r = r.slice(0, -1);
        } else if (i + 1 === data.length) {
            r += append3bytes(data[i], 0, 0);
            r = r.slice(0, -2);
        } else {
            r += append3bytes(data[i], data[i + 1], data[i + 2]);
        }
    }
    return r;
}

function deflateRaw(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i) & 0xff);
    }

    const result = [];
    const BLOCK_SIZE = 32768;
    let offset = 0;

    while (offset < bytes.length) {
        const blockEnd = Math.min(offset + BLOCK_SIZE, bytes.length);
        const isLast = blockEnd === bytes.length ? 1 : 0;
        const blockLen = blockEnd - offset;
        const nLen = (~blockLen) & 0xffff;

        result.push(isLast);
        result.push(blockLen & 0xff);
        result.push((blockLen >> 8) & 0xff);
        result.push(nLen & 0xff);
        result.push((nLen >> 8) & 0xff);

        for (let i = offset; i < blockEnd; i++) {
            result.push(bytes[i]);
        }
        offset = blockEnd;
    }

    return result;
}

export function encodePlantUML(text) {
    const utf8 = unescape(encodeURIComponent(text));
    const compressed = deflateRaw(utf8);
    return encode64(compressed);
}

export function buildPlantUMLUrl(code) {
    const encoded = encodePlantUML(code);
    return `https://www.plantuml.com/plantuml/svg/${encoded}`;
}