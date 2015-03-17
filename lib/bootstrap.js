import reqwest from 'reqwest';
import React from 'react';
import {Quiz} from './Quiz.jsx!';
import qwery from 'qwery';
import {quizSpec} from './quizSpec';

function main() {
    const placeholder = qwery('.js-quiz-placeholder')[0];
    React.render(React.createElement(Quiz, quizSpec), placeholder);
}

main();

