// extract.js
// タグ・日付などのテキスト抽出関連

/**
 * テキストから日付らしきパターンを抽出
 * @param {string} text
 * @returns {string|null}
 */
export function extractDate(text) {
    // 例: 2021-01-23, 01/23/2021, 2021年1月23日 形式
    const m = text.match(/(\d{4}[\/\-年]\d{1,2}[\/\-月]\d{1,2}(日)?)/);
    return m ? m[0] : null;
}

/**
 * テキストからタグ候補(#tag 形式)を抽出
 * @param {string} text
 * @returns {string[]}
 */
export function extractTags(text) {
    const matches = [...text.matchAll(/#([a-zA-Z0-9_\-ぁ-んァ-ヶー一-龠]+)/g)];
    return matches.map(m => m[1]);
}