import React from 'react';
import {Answer} from './Answer.jsx!';
import map from 'lodash-node/modern/collection/map';

export class Question extends React.Component {
    render() {
        return <div class="quiz-question">
            <h4>{this.props.question.question}</h4>
            <ol>{
                map(
                    this.props.question.multiChoiceAnswers,
                    (answer) => <Answer answer={answer} />
                )
            }</ol>
        </div>
    }
}
