import React from 'react';
import {countWhere} from './utils';
import find from 'lodash-node/modern/collection/find';
import any from 'lodash-node/modern/collection/any';
import map from 'lodash-node/modern/collection/map';
import merge from 'lodash-node/modern/object/merge';
import startsWith from 'lodash-node/modern/string/startsWith';
import classnames from 'classnames';

export class ShareTwitter extends React.Component {

    render() {
        let campaign = '?CMP=share_result_tw'

        let href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.props.message) + '&url=' + encodeURIComponent(this.props.url + campaign);

        return shareAbstract("twitter", campaign, this.props.question, href, this.props.source);
    }
}

function shareAbstract(site, campaign, question, href, source) {
    let classNames = {
            'quiz__social__action': true,
            'quiz__social--normal': !question && !source,
            'quiz__social--major': !question && source && startsWith(source, campaign),
            'quiz__social--minor': !question && source && !startsWith(source, campaign),
            'quiz__social--question': question
        },
        cssClass = question ? "question" : "results";

    return <a className={classnames(classNames)} data-link-name={"social " + (question ? "question " + question : "results") + " : "+site} href={href} target="_blank" title={site}>
        <span className={"quiz__share__outline quiz__share-"+site+"__outline quiz__share__outline__"+cssClass}>
            <i className={"quiz__share-"+site+"__svg quiz__share__svg quiz__share__svg__"+cssClass}></i>
        </span>
    </a>
}

export class ShareFacebook extends React.Component {

    render() {

        const campaign = '?CMP=share_result_fb';

        let href = 'https://www.facebook.com/dialog/feed?app_id=180444840287&link=' + encodeURIComponent(this.props.url + campaign) + '&redirect_uri=' + encodeURIComponent(this.props.url) + '&name=' + encodeURIComponent(this.props.message);
        // picture, description, caption
        // display=popup

        return shareAbstract("facebook", campaign, this.props.question, href, this.props.source);
    }
}

export class Share extends React.Component {
    render() {
        const message = this.props.message.replace(/_/, this.props.score).replace(/_/, this.props.length),
              question = this.props.question;

        let ourUrl = 'http://www.theguardian.com' + window.location.pathname;

        let source = window.location.search;

        let twitter = <ShareTwitter url={ourUrl}
            message={message}
            source={source}
            key="shareTwitter"
            question={question} />

        let gap = null;
        if (!question) {
            gap = <div className="quiz__social__gap" />;
        }

        let facebook = <ShareFacebook url={ourUrl}
            message={message}
            source={source}
            key="shareFacebook"
            question={question} />

        let share = source && startsWith(source, '?CMP=share_result_tw') ? [twitter, gap ,facebook] : [facebook, gap, twitter];

        let block;
        if (question) {
            block = <div className="quiz__share__question">{share}</div>;
        } else {
            block = <div className="quiz__share">
                <div className="quiz__share__cta">Challenge your friends</div>
                {share}
            </div>
        }

        return block;
    }
}
