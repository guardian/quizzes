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
