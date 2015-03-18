import reqwest from 'reqwest';
import React from 'react';
import {Quiz} from './components.jsx!';
import qwery from 'qwery';
import {quizSpec} from './quizSpec';
import './style.css!';
import './social.css!';

console.log("I got executed at least.");

export function boot(el, context, config, mediator) {
    console.log("Hi cantlin", el);
    React.render(React.createElement(Quiz, quizSpec), el);
}

/** Horrible thing to get it working as an AMD module */
if (window._interactive_element) {
    boot(window._interactive_element);
}
