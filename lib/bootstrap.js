import reqwest from 'reqwest';
import React from 'react';
import {Quiz} from './components.jsx!';
import qwery from 'qwery';
import {quizSpec} from './quizSpec';
import './style.css!';

export function boot(el, context, config, mediator) {
    React.render(React.createElement(Quiz, quizSpec), el);
}

window.boot = boot;
