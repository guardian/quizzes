import React from 'react';
import find from 'lodash-node/modern/collection/find';
import map from 'lodash-node/modern/collection/map';
import classnames from 'classnames';

export class Answer extends React.Component {
    render() {
        return <div 
            className={classnames({
                'quiz__answer': true,
                'quiz__answer--correct': this.props.isAnswered() && this.props.answer.correct,
                'quiz__answer--incorrect': this.props.isAnswered() && this.props.answer.isChosen && !this.props.answer.correct
            })}            
            onClick={this.props.isAnswered() ? null : this.props.chooseAnswer}>
          <input type="checkbox" /> {this.props.answer.answer}
        </div>
    }
}

export class Question extends React.Component {
    isAnswered() {
        return !!find(this.props.question.multiChoiceAnswers, (a) => a.isChosen);
    }

    render() {
        var question = this.props.question,
            answers = question.multiChoiceAnswers;

        return <div className={classnames({isAnswered: this.isAnswered()})}>
            <h4>{question.question}</h4>
            <div>{
                map(
                    answers,
                    (answer, i) => <Answer answer={answer} isAnswered={this.isAnswered.bind(this)} chooseAnswer={this.props.chooseAnswer.bind(null, answer)} key={i} />
                )                
            }</div>
        </div>
    }
}

export class Quiz extends React.Component {
    constructor(props) {
        this.state = {
            questions: props.questions
        };
    }

    chooseAnswer(answer) {
        answer.isChosen = true;
        this.forceUpdate();
    }

    render() {
        return <div>
            <h2>{this.props.header.titleText}</h2>
            <p>{this.props.header.trailText}</p>
            {
                map(
                    this.state.questions,
                    (question, i) => <Question question={question} chooseAnswer={this.chooseAnswer.bind(this)} key={i} />
                )
            }
        </div>
    }
}
