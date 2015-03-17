import React from 'react';
import map from 'lodash-node/modern/collection/map';

export class Answer extends React.Component {
    handleAnswer() {
        console.log(answer);
    }
    
    render() {
        return <div className="quiz-answer">
                <li onClick={this.handleAnswer}>{this.props.answer.answer}</li>
            </div>
    }

}

export class Question extends React.Component {
    render() {
        return <div className="quiz-question">
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
