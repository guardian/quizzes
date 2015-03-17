import React from 'react';
import find from 'lodash-node/modern/collection/find';
import map from 'lodash-node/modern/collection/map';
import classnames from 'classnames';

export class Answer extends React.Component {
    render() {
        return <div className="quiz__answer" onClick={this.props.handleAnswer}>
          <input type="checkbox" />{this.props.answer.answer}
        </div>
    }
}

export class Question extends React.Component {
    constructor() {
        this.state = {isAnswered: false};
    }
    handleAnswer(answer) {
        this.setState({isAnswered: answer});
    }
    render() {
        var question = this.props.question,
            answers = question.multiChoiceAnswers,
            correctAnswer = find(answers, function(a) {return a.correct}),
            answer = this.state.isAnswered,
            isCorrect,
            answersShown;

        console.log(correctAnswer);

        if (answer) {
            isCorrect = answer.correct;
            answersShown = <div className={isCorrect ? 'correct' : 'inCorrect'}>
                <div>{isCorrect ? 'Correct' : 'Wrong'} : {answer.answer}</div>
                {isCorrect ? '' : <div>The right answer is: {correctAnswer.answer}</div>}
            </div>;
        } else {
            answersShown = map(
                answers,
                (answer, i) => <Answer answer={answer} handleAnswer={this.handleAnswer.bind(this, answer)} key={i} />
            )
        }

        return <div className={classnames({isAnswered: this.state.isAnswered})}>
            <h4>{question.question}</h4>
            <div>{answersShown}</div>
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
                    (question, i) => <Question question={question} key={i} />
                )
            }
        </div>
    }
}
