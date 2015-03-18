import React from 'react';
import {countWhere} from './utils';
import find from 'lodash-node/modern/collection/find';
import any from 'lodash-node/modern/collection/any';
import map from 'lodash-node/modern/collection/map';
import merge from 'lodash-node/modern/object/merge';
import startsWith from 'lodash-node/modern/string/startsWith';
import classnames from 'classnames';
import {cross, tick} from './svgs.jsx!';

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

export class ShareTwitter extends React.Component {

    render() {
        let campaign = '?CMP=share_result_tw'

        let href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.props.message) + '&url=' + encodeURIComponent(this.props.url + campaign);

        let classNames = {
            'quiz__social__action': true,
            'quiz__social__action--nth': true,
            'quiz__social--normal': !this.props.source,
            'quiz__social--major': this.props.source && startsWith(this.props.source, campaign),
            'quiz__social--minor': this.props.source && !startsWith(this.props.source, campaign)
        };

        return <a className={classnames(classNames)} data-link-name="social results" href={href} target="_blank" title="Twitter">
        <span className="quiz__share__outline quiz__share-twitter__outline">
        <i className="quiz__share-twitter__svg quiz__share__svg"></i>
        </span>
        </a>
    }
}

export class ShareFacebook extends React.Component {

    render() {
        
        let campaign = '?CMP=share_result_fb'

        let href = 'https://www.facebook.com/dialog/feed?app_id=180444840287&link=' + encodeURIComponent(this.props.url + campaign) + '&redirect_uri=' + encodeURIComponent(this.props.url) + '&name=' + encodeURIComponent(this.props.message);
        // picture, description, caption
        // display=popup

        let classNames = {
            'quiz__social__action': true,
            'quiz__social__action--nth': true,
            'quiz__social--normal': !this.props.source,
            'quiz__social--major': this.props.source && startsWith(this.props.source, campaign),
            'quiz__social--minor': this.props.source && !startsWith(this.props.source, campaign)
        };

        return <a className={classnames(classNames)} data-link-name="social results" href={href} target="_blank" title="Facebook">
        <span className="quiz__share__outline quiz__share-facebook__outline">
        <i className="quiz__share-facebook__svg quiz__share__svg"></i>
        </span>
        </a>
    }
}

export class Share extends React.Component {
    render() {
        let message = this.props.message.replace(/_/, this.props.score).replace(/_/, this.props.length);

        let ourUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;

        let source = window.location.search

        let twitter = <ShareTwitter url={ourUrl}
                        message={message}
                        source={source}
                        key="shareTwitter" />

        let facebook = <ShareFacebook url={ourUrl}
                        message={message}
                        source={source}
                        key="shareFacebook" />

        let share = source && startsWith(source, '?CMP=share_result_tw') ? [twitter,facebook] : [facebook, twitter];

        return <div className="quiz__share">
            <div className="quiz__share__cta">Challenge your friends</div>
        {share}

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

        if (this.isFinished()) {
            endMessage = <EndMessage score={this.score()}
                                     message={this.endMessage()}
                                     length={this.length()}
                                     key="end_message" />

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
        </div>
    }
}
