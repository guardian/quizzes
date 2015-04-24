import reqwest from 'reqwest';
import React from 'react';
import {Quiz} from './components.jsx!';
import qwery from 'qwery';
import quizSpec from './quizSpec.json!';
import './style.css!';
import './social.css!';

export function boot(el, context, config, mediator) {
    React.render(React.createElement(Quiz, quizSpec), el);
    if (mediator) {
        mediator.emit('ui:images:upgradePictures');
    }
}

/** Horrible thing to get it working as an AMD module */
if (window._interactive_quiz_params) {
    let {el, context, config, mediator} = window._interactive_quiz_params;
    boot(el, context, config, mediator);
}
