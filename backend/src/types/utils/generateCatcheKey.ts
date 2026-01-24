export const generateCatchKey = (path = '', query = {}, userId = '') => {
    const baseUrl = path.replace(/^\+|\/+$/g, '').replace(/\//g, ':');
    let params, sortedParams;
    if (query) {
        params = query;
        sortedParams = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join('&');
    }

    let key = sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl;
    if (userId) {
        key += `:userId=${userId}`;
    }
    return key;
}