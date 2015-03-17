import React from 'react'
import {Question} from './Question.jsx!';
import map from 'lodash-node/modern/collection/map';

export class Quiz extends React.Component {
    render() {
        return <div>
            <h2>{this.props.header.titleText}</h2>
            <p>{this.props.header.trailText}</p>
            {
                map(
                    this.props.questions,
                    (question) => <Question question={question} />
                )
            }
        </div>
    }
}
