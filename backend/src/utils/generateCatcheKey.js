export const generateCatchKey = (path, query) => {
    const baseUrl = path.replace(/^\+|\/+$/g, '').replace(/\//g, ':');
    let params, sortedParams;
    if (query) {
        params = query;
        sortedParams = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join('&');
    }
    return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl

}