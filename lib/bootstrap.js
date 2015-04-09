import reqwest from 'reqwest';
import React from 'react';
import {Quiz} from './personalityComponents.jsx!';
import qwery from 'qwery';
import {personalityQuizSpec} from './personalityQuizSpec';
import './style.css!';
import './social.css!';

export function boot(el, context, config, mediator) {
    React.render(React.createElement(Quiz, personalityQuizSpec), el);
    if (mediator) {
        mediator.emit('ui:images:upgradePictures');
    }
}

/** Horrible thing to get it working as an AMD module */
if (window._interactive_quiz_params) {
    let {el, context, config, mediator} = window._interactive_quiz_params;
    boot(el, context, config, mediator);
}
