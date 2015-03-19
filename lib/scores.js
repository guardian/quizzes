import reqwest from 'reqwest';

export function saveResults(results) {
    return reqwest({
        url: '/quizzes/results',
        contentType: 'application/json',
        method: 'post',
        data: JSON.stringify(results)
    });
}

export function getResults(path) {
    return reqwest({
        method: 'get',
        url: `/quizzes/results/${path}.json`
    });
}
