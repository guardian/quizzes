import React from 'react';
import {countWhere} from './utils';
import find from 'lodash-node/modern/collection/find';
import any from 'lodash-node/modern/collection/any';
import map from 'lodash-node/modern/collection/map';
import merge from 'lodash-node/modern/object/merge';
import classnames from 'classnames';

const tick = <svg className="quiz__answer-icon-svg" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill="#fff" d="M23.895 3.215L10.643 16.467 5.235 11.06 1.7 14.594l5.407 5.407 3.182 3.183.353.353L27.43 6.75z"/></svg>;

const cross = <svg className="quiz__answer-icon-svg" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill="#fff" d="M24.247 7.633l-3.535-3.535-6.626 6.626L7.46 4.098 3.925 7.633l6.626 6.626-6.624 6.624L7.46 24.42l6.626-6.626 6.626 6.626 3.535-3.535-6.626-6.626z"/></svg>;

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

        if (isChosen) {
            let symbol = correct ? tick : cross;
            icon = <span className={'quiz__answer-icon'}>{symbol}</span>;
        }

        return <div 
            data-link-name={"answer " + (this.props.index + 1)}
            className={classnames(classesNames)}            
            onClick={answered ? null : this.props.chooseAnswer}>
            {icon}
            {this.props.answer.answer}
            {answered && (correct || isChosen) ? <div className="quiz__answer__more">{more}</div> : ''}
        </div>
    }
}

function isAnswered(question) {
    return any(question.multiChoiceAnswers, (a) => a.isChosen);
}

function isCorrect(question) {
    return any(question.multiChoiceAnswers, (a) => a.isChosen && a.correct);
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

        return <div data-link-name={"question " + (this.props.index + 1)} className={classnames({isAnswered: this.isAnswered()})}>
            <h4 className="quiz__question-header">
                <span className="quiz__question-number">{this.props.index + 1}.</span>
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
        return <div className="quiz__end-message">
            <div className="quiz__score-message">You got <span className="quiz__score">{this.props.score}/{this.props.length}</span></div>

            <div className="quiz__bucket-message">{this.props.message}</div>
        </div>
    }
}

export class Share extends React.Component {
    render() {
        let message = this.props.message.replace(/_/, this.props.score).replace(/_/, this.props.length);

        let ourUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        let twitterCampaign = '?CMP=share_result_tw';
        let dataLinkName = 'social results';
        let twitterHref = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(message) + '&url=' + encodeURIComponent(ourUrl + twitterCampaign)

        return <div className="quiz__share">
            <div>Challenge a friend</div>
            <a className="social__action social-icon-wrapper" data-link-name={dataLinkName} href={twitterHref} target="_blank" title="Twitter">
                <span className="rounded-icon social-icon social-icon--twitter">
                    <i className="i-share-twitter--white i"></i>
                </span>
            </a>

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

        return message ? message : "Well done!";
    }

    render() {
        let endMessage;
        let shareButtons;

        if (this.isFinished()) {
            endMessage = <EndMessage score={this.score()}
                                     message={this.endMessage().title}
                                     length={this.length()}
                                     key="end_message" />
            shareButtons = <Share score={this.score()}
                                     message={this.endMessage().share}
                                     length={this.length()}
                                     key="share" />

        }
        
        return <div data-link-name="quiz" className="quiz">
            {
                map(
                    this.state.questions,
                    (question, i) => <Question question={question} chooseAnswer={this.chooseAnswer.bind(this)} index={i} key={i} />
                )
            }
            {
                endMessage
            }
            {
                shareButtons
            }
        </div>
    }
}
