const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');

const fileCache = {};
const defaultLocale = 'en';

/**
 * @param {string} locale Locale code (ex. 'en-US', 'fr')
 * @param {string} string Name of the string to get
 * @param {object} args Args to substitute insinde the string
 * ex. { myNumber: 100, myString: 'hello' }
 * NOTE: You can directly pass a value without specifying the name and it will
 * try to substitute it everywhere applicable. For exemple, with the object
 * containing a value for "myNumber" above, you could simply pass 100.
 * @returns {Promise<string>} the string with all values substituted
 */
module.exports = async function getString(locale, string, args) {
    const strings = await getLocaleFile(locale);

    /** @type {string} */
    let stringToReturn =
        strings[string] ??
        (await getLocaleFile(defaultLocale))[string] ??
        `(fixme) Placeholder for ${locale}:${string}`;

    if (!args) return stringToReturn;

    const keys = Object.keys(args);
    // strings will return keys like an array
    if (!keys.length || typeof args === 'string') {
        return stringToReturn.replace(/{{.*?}}/g, args);
    }

    keys.forEach((key) => {
        stringToReturn = stringToReturn.replace(
            new RegExp(`{{${key}}}`, 'g'),
            args[key],
        );
    });

    return stringToReturn;
};

/**
 * @param {string} locale Locale code (ex. 'en-US', 'fr')
 * @returns {Promise<any>} Contents of the file from the specified locale,
 * or english if the specified locale wasn't found
 */
async function getLocaleFile(locale) {
    if (fileCache[locale]) return fileCache[locale];

    let filePath = path.join(__dirname, `${locale}.json`);
    try {
        await promisify(fs.stat)(filePath);
    } catch {
        // use english by default
        if (fileCache[defaultLocale]) return fileCache[defaultLocale];
        filePath = path.join(__dirname, `${defaultLocale}.json`);
    }
    return promisify(fs.readFile)(filePath)
        .then((buffer) => JSON.parse(buffer.toString()))
        .then((json) => (fileCache[locale] = json))
        .catch(console.error);
}
