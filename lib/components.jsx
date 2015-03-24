import React from 'react';
import {countWhere} from './utils';
import find from 'lodash-node/modern/collection/find';
import any from 'lodash-node/modern/collection/any';
import map from 'lodash-node/modern/collection/map';
import merge from 'lodash-node/modern/object/merge';
import startsWith from 'lodash-node/modern/string/startsWith';
import classnames from 'classnames';
import {cross, tick} from './svgs.jsx!';
import {saveResults, getResults} from './scores';
import {Share} from './social.jsx!'

export class Answer extends React.Component {
    render() {
        const answered = this.props.isAnswered,
              {correct, more, isChosen} = this.props.answer,
              classesNames = merge({'quiz__answer': true}, answered ? {
                  'quiz__answer--answered': true,
                  'quiz__answer--correct': correct,
                  'quiz__answer--correct-chosen': correct && isChosen,
                  'quiz__answer--incorrect-chosen': isChosen && !correct,    
                  'quiz__answer--incorrect': !correct
              } : null)

        let icon;

        if (answered && (isChosen || correct)) {
            let symbol = correct ? tick(isChosen ? null : '#43B347') : cross();
            icon = <span className={'quiz__answer-icon'}>{symbol}</span>;
        }

        return <button
            data-link-name={"answer " + (this.props.index + 1)}
            className={classnames(classesNames)}            
            onClick={answered ? null : this.props.chooseAnswer}>
            {icon}
            {this.props.answer.answer}
            {answered && more && (correct || isChosen) ? <div className="quiz__answer__more" dangerouslySetInnerHTML={{__html: more}} /> : ''}
        </button>
    }
}

function isAnswered(question) {
    return any(question.multiChoiceAnswers, (a) => a.isChosen);
}

function isCorrect(question) {
    return any(question.multiChoiceAnswers, (a) => a.isChosen && a.correct);
}

function genSrcset(src) {
    const widths = [320, 460, 620],
          srcId = src.replace(/^.*\/\/media.guim.co.uk\//, '');
          templ = '//i.guim.co.uk/media/w-{width}/h--/q-95/' + srcId + ' {width}w';

    return map(widths, function(width) {return templ.replace(/{width}/g, width); }).join(', ');
}

function genSrc620(src) {
    return 'http://i.guim.co.uk/media/w-620/h--/q-95/' + src.replace(/^.*\/\/media.guim.co.uk\//, '');
}

export class Question extends React.Component {
    isAnswered() {
        return isAnswered(this.props.question);
    }

    isCorrect() {
        return isCorrect(this.props.question);
    }

    render() {
        const question = this.props.question,
              answers = question.multiChoiceAnswers;

        return <div data-link-name={"question " + (this.props.index + 1)} className={classnames({'quiz__question': true, isAnswered: this.isAnswered()})}>
            {question.imageUrl ? <img className="quiz__question__img" src={genSrc620(question.imageUrl)} /> : null}
        {question.imageCredit ? <figcaption className="caption caption--main caption--img quiz__image-caption" itemprop="description" dangerouslySetInnerHTML={{__html: question.imageCredit}} /> : null}
            <h4 className="quiz__question-header">
                <span className="quiz__question-number">{this.props.index + 1}</span>
                <span className="quiz__question-text">{question.question}</span>
            </h4>
            <div>{
                map(
                    answers,
                    (answer, i) => <Answer answer={answer} isAnswered={this.isAnswered()} chooseAnswer={this.props.chooseAnswer.bind(null, answer)} index={i} key={i} />
                )                
            }</div>
        </div>
    }
}

export class EndMessage extends React.Component {
    render() {
        let shareButtons = <Share score={this.props.score}
            message={this.props.message.share}
            length={this.props.length}
            key="share" />

        return <div className="quiz__end-message">
            <div className="quiz__score-message">You got <span className="quiz__score">{this.props.score}/{this.props.length}</span></div>

            <div className="quiz__bucket-message">{this.props.message.title}</div>

            {shareButtons}
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

        if (this.isFinished()) {
            saveResults(this.results());
        }
        
        this.forceUpdate();
    }

    length() {
        return this.state.questions.length;
    }

    isFinished() {
        return this.progress() === this.length();
    }

    progress() {
        return countWhere(this.state.questions, isAnswered);
    }

    score() {
        return countWhere(this.state.questions, isCorrect);
    }

    endMessage() {
        const minScore = (g) => g.minScore === undefined ? Number.NEGATIVE_INFINITY : g.minScore,
              maxScore = (g) => g.maxScore === undefined ? Number.POSITIVE_INFINITY : g.maxScore,
              score = this.score(),
              message = find(
                  this.props.resultGroups,
                  (group) => score >= minScore(group) && score <= maxScore(group)
              );

        return message ? message : {
            "title": "Well done",
            "share": "I got _/_ on the Guardian quiz."
        };
    }

    results() {
        let summary = map(this.state.questions, (question) => isCorrect(question) ? 1 : 0);

        return {
            quizId: 'disney-villains',
            results: summary,
            timeTaken: 0
        };
    }

    render() {
        let endMessage;

        if (this.isFinished()) {
            endMessage = <EndMessage score={this.score()}
                                     message={this.endMessage()}
                                     length={this.length()}
                                     key="end_message" />
        }

        let html = <div data-link-name="quiz" className="quiz">
            <img style={{'max-width': '600px', width: '100%'}} src="http://media.guim.co.uk/9bf7b0a1aadf97c0e4c378c87eccf2c7520a61e6/0_0_1186_711/1000.jpg"/>
            {
                map(
                    this.state.questions,
                    (question, i) => <Question question={question} chooseAnswer={this.chooseAnswer.bind(this)} index={i} key={i} />
                )
            }
            {
                endMessage
            }
        </div>;

        document.getElementsByClassName('element-embed')[0].style.display = 'none';

        return html
    }
}
