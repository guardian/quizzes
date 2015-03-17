import React from 'react';
import find from 'lodash-node/modern/collection/find';
import map from 'lodash-node/modern/collection/map';
import classnames from 'classnames';

export class Answer extends React.Component {
    render() {
        return <div data-link-name={"answer " + this.props.index} className="quiz__answer" onClick={this.props.chooseAnswer}>
          <input type="checkbox" />{this.props.answer.answer}
        </div>
    }
}

export class Question extends React.Component {
    isAnswered() {
        return !!find(this.props.multiChoiceAnswers, (a) => a.isChosen);
    }

    render() {
        var question = this.props.question,
            answers = question.multiChoiceAnswers,
            chosenAnswer = this.isAnswered(),
            isCorrect,
            answersShown;

        if (chosenAnswer) {
            isCorrect = chosenAnswer.correct;
            answersShown = <div className={isCorrect ? 'correct' : 'inCorrect'}>
                <div>{isCorrect ? 'Correct' : 'Wrong'} : {chosenAnswer.answer}</div>
                {isCorrect ? '' : <div>The right answer is: {correctAnswer.answer}</div>}
            </div>;
        } else {
            answersShown = map(
                answers,
                (answer, i) => <Answer answer={answer} isAnswered={this.isAnswered()} chooseAnswer={this.props.chooseAnswer.bind(null, answer)} index={i} key={i} />
            )
        }

        return <div data-link-name={"question " + this.props.index} className={classnames({isAnswered: this.isAnswered()})}>
            <h4>{question.question}</h4>
            <div>{answersShown}</div>
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
        return <div data-link-name="quiz">
            <h2>{this.props.header.titleText}</h2>
            <p>{this.props.header.trailText}</p>
            {
                map(
                    this.state.questions,
                    (question, i) => <Question question={question} chooseAnswer={this.chooseAnswer.bind(this)} index={i} key={i} />
                )
            }
        </div>
    }
}
