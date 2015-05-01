import React from 'react';
import {countWhere} from './utils';

import chunk from 'lodash-node/modern/array/chunk';
import slice from 'lodash-node/modern/array/slice';
import zip from 'lodash-node/modern/array/zip';
import includes from 'lodash-node/modern/collection/includes';
import find from 'lodash-node/modern/collection/find';
import any from 'lodash-node/modern/collection/any';
import map from 'lodash-node/modern/collection/map';
import reduce from 'lodash-node/modern/collection/reduce';
import filter from 'lodash-node/modern/collection/filter';
import forEach from 'lodash-node/modern/collection/forEach';
import sum from 'lodash-node/modern/collection/sum';
import compact from 'lodash-node/modern/array/compact';
import take from 'lodash-node/modern/array/take';
import merge from 'lodash-node/modern/object/merge';
import last from 'lodash-node/modern/array/last';
import sortBy from 'lodash-node/modern/collection/sortBy';
import pairs from 'lodash-node/modern/object/pairs';
import startsWith from 'lodash-node/modern/string/startsWith';
import random from 'lodash-node/modern/number/random';

import classnames from 'classnames';
import {cross, tick} from './svgs.jsx!';
import {saveResults, getResults} from './scores';
import {Share} from './social.jsx!'

const quizTypes = ['knowledge', 'personality'];

export class Aggregate extends React.Component {
    render() {
        const pctRight = this.props.pctRight,
            correct = this.props.correct;

        let info = null;
        if (typeof pctRight !== 'undefined') {
            let phrase;
            if (pctRight < 50) {
                phrase = <span>{correct ? "Good job!" : "Don't worry."} More people got this question wrong than right!</span>
            } else if (pctRight > 80) {
                phrase = <span>{correct ? "This one's easy" : "Oh dear" } - {pctRight}% of people knew this</span>
            }
            if (phrase) {
                info = <div className="quiz__answer-aggregate">
                    { phrase }
                </div>
            }
        }
        return info;
    }
}

export class Answer extends React.Component {
    render() {
        const answered = this.props.isAnswered,
            {correct, buckets, more, isChosen} = this.props.answer,
            quizType = this.props.quizType,
            classesNames = merge({
                    'quiz__answer': true
                }, 
                answered ? {
                    'quiz__answer--answered': true
                } : null,
                answered && quizType === 'personality' ? {
                    'quiz__answer--chosen': isChosen,
                } : null,
                answered && quizType === 'knowledge' ? {
                    'quiz__answer--correct': correct,
                    'quiz__answer--correct-chosen': correct && isChosen,
                    'quiz__answer--incorrect-chosen': isChosen && !correct,    
                    'quiz__answer--incorrect': !correct
                } : null
            ),
            pctRight = this.props.pctRight,
            questionNo = this.props.questionNo;

        let icon,
            aggregate,
            renderedMore = null,
            share = null;

        if (answered && quizType === 'personality' && isChosen) {
            icon = <span className={'quiz__answer-icon'}>{tick()}</span>;
        }

        if (answered && quizType === 'knowledge') {
            if (isChosen || correct) {
                let symbol = correct ? tick(isChosen ? null : '#43B347') : cross();
                icon = <span className={'quiz__answer-icon'}>{symbol}</span>;
            }
            if (isChosen) {
                aggregate = <Aggregate correct={correct} pctRight={pctRight} />
            }
            if (correct) {
                share = <Share question={questionNo}
                    key="share"
                    message={this.props.answer.share ? this.props.answer.share : this.props.questionText }
                />
            }
        }

        return <a
            data-link-name={"answer " + (this.props.index + 1)}
            className={classnames(classesNames)}
            onClick={answered ? null : this.props.chooseAnswer}>
            {icon}
            {this.props.answer.imageUrl ? <div className="quiz__answer__image"><img class="quiz__answer__img" src={genSrc(this.props.answer.imageUrl, 160)} /></div> : null}
            {this.props.answer.answer ? this.props.answer.answer : null}
            {aggregate}
        </a>
    }
}

function isAnswered(question) {
    return any(question.multiChoiceAnswers, (a) => a.isChosen);
}

function getChosenAnswer(question) {
    return find(question.multiChoiceAnswers, (a) => a.isChosen);
}

function isCorrect(question) {
    return any(question.multiChoiceAnswers, (a) => a.isChosen && a.correct);
}

function more(question) {
    return any(question.multiChoiceAnswers, (a) => a.more);
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

function genSrc(src, width) {
    return 'http://i.guim.co.uk/media/w-' + width + '/h--/q-95/' + src.replace(/^.*\/\/media.guim.co.uk\//, '');
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
              aggWrong = this.props.aggregate ? this.props.aggregate[0] : undefined,
              aggRight = this.props.aggregate ? (this.props.aggregate[1] ? this.props.aggregate[1] : 0) : undefined,
              pctRight = this.props.aggregate ? Math.round((aggRight * 100) / (aggWrong + aggRight)) : undefined,
              answers = question.multiChoiceAnswers,
              defaultColumns = this.props.defaultColumns,
              moreText = question.more;

        return <div data-link-name={"question " + (this.props.index + 1)} className={classnames({'quiz__question': true, isAnswered: this.isAnswered()})}>
            {question.imageUrl ? <img className="quiz__question__img" src={genSrc620(question.imageUrl)} /> : null}
            {question.imageCredit ? <figcaption className="caption caption--main caption--img quiz__image-caption" itemprop="description" dangerouslySetInnerHTML={{__html: question.imageCredit}} /> : null}
            <h4 className="quiz__question-header">
                <span className="quiz__question-number">{this.props.index + 1}</span>
                <span className="quiz__question-text">{question.question}</span>
            </h4>
            <div>{
                map(
                    chunk(answers, defaultColumns),
                    (thisChunk, chunkI) =>
                        <div className="quiz__question__answer-row">
                            {
                                map(thisChunk,
                                    (answer, answerI) =>
                                        <Answer
                                            answer={answer}
                                            isAnswered={this.isAnswered()}
                                            pctRight={pctRight}
                                            chooseAnswer={this.props.chooseAnswer.bind(null, answer)}
                                            index={chunkI * 2 + answerI}
                                            key={chunkI * 2 + answerI}
                                            questionNo={this.props.index + 1}
                                            questionText={question.question}
                                            quizType={this.props.quizType}
                                        />
                                )
                            }
                        </div>
                )
            }</div>
        {
            this.isAnswered() ? (moreText ? <div className="quiz__question__more">{moreText}</div> : null) : null
            }
        </div>
    }
}

export class EndMessage extends React.Component {
    render() {
        const quizType = this.props.quizType,
              histogram = this.props.histogram,
              score = this.props.score,
              personality = this.props.personality;

        if (quizType === 'knowledge') {
            let shareButtons =
                <Share score={score}
                    message={this.props.message.share}
                    length={this.props.length}
                    key="share" />

            let comparison = null;
            if (score > 0 && histogram) {
                let beat = Math.round((sum(slice(histogram, 0, score + 1)) * 100) / sum(histogram));
                comparison = <div><div>How did you do?</div>
                    <div>I beat <span className="quiz__end-message__beat">{isNaN(beat) ? 0 : beat}%</span> of others.</div>
                    </div>
            }

            return <div className="quiz__end-message">
                <div className="quiz__score-message">You got <span className="quiz__score">{score}/{this.props.length}</span></div>

                <div className="quiz__bucket-message">{this.props.message.title}</div>

                {comparison}

                {shareButtons}
            </div>            
        }

        if (quizType === 'personality') {
            return <div className="quiz__end-message">
                <div className="quiz__score-message">
                    {personality.href ?
                        <a href={personality.href} className="quiz__score">{personality.title}</a>
                        : <span className="quiz__score">{personality.title}</span>}
                    {personality.youtubeId ? 
                        <p><iframe width="320" height="180" src={"https://www.youtube.com/embed/" + personality.youtubeId} frameBorder="0"  allowfullscreen></iframe></p>
                        : null}
                </div>
            </div>            
        }
    }
}

export class Quiz extends React.Component {
    constructor(props) {
        var quiz = this;
        this.state = {
            questions: props.questions
        };
        this.defaultColumns = props.defaultColumns ? props.defaultColumns : 1;
        this.quizId = props.quizIdentity;
        this.quizType = props.quizType,
        this.resultBuckets = props.resultBuckets,
        getResults(this.quizId).then(function (resp) {
            quiz.aggregate = JSON.parse(resp);
            quiz.forceUpdate();
        });
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

    personality() {
        const tallies = pairs(reduce(map(this.state.questions, (question) => getChosenAnswer(question)), (acc, answer) => {
                forEach(answer.buckets, (personality) => {
                     acc[personality] = (acc[personality] || 0) + 1;
                })
                return acc; 
            }, {})),
            highScore = last(sortBy(tallies, 1))[1],
            highScorers = map(filter(tallies, (t) => t[1] === highScore), (t) => t[0]),
            highScorer = highScorers[random(0, highScorers.length - 1)];

        return find(this.resultBuckets, {id: highScorer}) || {}; 
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
            quizId: this.quizId,
            results: summary,
            score: this.score(),
            personality: this.personality(),
            timeTaken: 0
        };
    }

    render() {
        let html,
            endMessage;

        if (this.isFinished()) {
            endMessage = <EndMessage
                quizType = {this.quizType}
                score={this.score()}
                personality={this.personality()}
                message={this.endMessage()}
                length={this.length()}
                key="end_message"
                histogram={this.aggregate ? this.aggregate.scoreHistogram : undefined} />
        }

        if (includes(quizTypes, this.quizType)) {
            html = <div data-link-name="quiz" className="quiz">
                {
                    map(
                        zip(this.state.questions, this.aggregate ? take(this.aggregate.results, this.state.questions.length) : []),
                        (question, i) => <Question
                            question={question[0]}
                            aggregate={question[1]}
                            chooseAnswer={this.chooseAnswer.bind(this)}
                            index={i}
                            key={i}
                            quizType={this.quizType}
                            defaultColumns={this.defaultColumns}
                            />
                    )
                }
                {
                    endMessage
                }
            </div>;
        } else {
            html = <div>Unknown or unspecified quizType. Shoud be one of: {quizTypes.join(', ')}.</div>
        }

        document.getElementsByClassName('element-embed')[0].style.display = 'none';

        return html
    }
}
