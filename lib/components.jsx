import React from 'react';
import {countWhere} from './utils';

import chunk from 'lodash-node/modern/array/chunk';
import slice from 'lodash-node/modern/array/slice';
import zip from 'lodash-node/modern/array/zip';
import find from 'lodash-node/modern/collection/find';
import any from 'lodash-node/modern/collection/any';
import map from 'lodash-node/modern/collection/map';
import sum from 'lodash-node/modern/collection/sum';
import merge from 'lodash-node/modern/object/merge';
import startsWith from 'lodash-node/modern/string/startsWith';

import classnames from 'classnames';
import {cross, tick} from './svgs.jsx!';
import {saveResults, getResults} from './scores';
import {Share} from './social.jsx!'

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
            {correct, more, isChosen} = this.props.answer,
              classesNames = merge({
                  'quiz__answer': true,
                  'quiz__answer--list': this.props.type === 'list',
                  'quiz__answer--pairs': this.props.type === 'pairs'
              }, answered ? {
                  'quiz__answer--answered': true,
                  'quiz__answer--correct': correct,
                  'quiz__answer--correct-chosen': correct && isChosen,
                  'quiz__answer--incorrect-chosen': isChosen && !correct,    
                  'quiz__answer--incorrect': !correct
              } : null),
              pctRight = this.props.pctRight,
              questionNo = this.props.questionNo;

        let icon,
            aggregate,
            renderedMore = null,
            share = null;

        if (answered) {
            if (isChosen || correct) {
                let symbol = correct ? tick(isChosen ? null : '#43B347') : cross();
                icon = <span className={'quiz__answer-icon'}>{symbol}</span>;
                if (more) {
                    renderedMore = <div className="quiz__answer__more" dangerouslySetInnerHTML={{__html: more}} />;
                }
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

        return <button
            data-link-name={"answer " + (this.props.index + 1)}
            className={classnames(classesNames)}            
            onClick={answered ? null : this.props.chooseAnswer}>
            {share}
            {icon}
            {this.props.answer.imageUrl ? <div className="quiz__answer__image"><img class="quiz__answer__img" src={genSrc(this.props.answer.imageUrl, 160)} /></div> : null}
            {this.props.answer.answer}
            {aggregate}
            {renderedMore}
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
              defaultColumns = this.props.defaultColumns;

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
                        <div>
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
                                            type={this.props.type}
                                            />
                                )
                            }
                        </div>
                )
            }</div>
        </div>
    }
}

export class EndMessage extends React.Component {
    render() {
        const histogram = this.props.histogram,
              score = this.props.score;

        let shareButtons =
            <Share score={score}
                message={this.props.message.share}
                length={this.props.length}
                key="share" />

        let comparison = null;
        if (histogram) {
            let beat = Math.round((sum(slice(histogram, 0, score + 1)) * 100) / sum(histogram));
            comparison = <div><div>How did you do?</div>
                <div>I beat <span className="quiz__end-message__beat">{beat}%</span> of others.</div>
                </div>
        }

        return <div className="quiz__end-message">
            <div className="quiz__score-message">You got <span className="quiz__score">{score}/{this.props.length}</span></div>

            <div className="quiz__bucket-message">{this.props.message.title}</div>

            {comparison}

            {shareButtons}
        </div>
    }
}

export class Quiz extends React.Component {
    constructor(props) {
        var quiz = this;
        this.state = {
            questions: props.questions
        };
        this.defaultColumns = props.defaultColumns ? props.defaultColumns : 1;
        this.quizId = 'football-quiz-1';
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
            timeTaken: 0
        };
    }

    render() {
        let endMessage;

        if (this.isFinished()) {
            endMessage = <EndMessage score={this.score()}
                                     message={this.endMessage()}
                                     length={this.length()}
                                     key="end_message"
                                     histogram={this.aggregate ? this.aggregate.scoreHistogram : undefined} />
        }

        let html = <div data-link-name="quiz" className="quiz">
            {
                map(
                    zip(this.state.questions, this.aggregate ? this.aggregate.results : []),
                    (question, i) => <Question
                        question={question[0]}
                        aggregate={question[1]}
                        chooseAnswer={this.chooseAnswer.bind(this)}
                        index={i}
                        key={i}
                        type={this.props.type}
                        defaultColumns={this.defaultColumns}
                        />
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
