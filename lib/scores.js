import reqwest from 'reqwest';

export function saveResults(results) {
    return reqwest({
        url: 'http://localhost:9000/quiz/update',
        contentType: 'application/json',
        method: 'post',
        data: JSON.stringify(results)
    });
}

export function getResults(path) {
    return reqwest({
        method: 'get',
        url: `http://localhost:9000/quiz/results/${path}`
    });
}
