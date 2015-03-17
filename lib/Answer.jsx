import React from 'react';

export class Answer extends React.Component {
    handleAnswer() {
        console.log(answer);
    }
    
    render() {
        return <div class="quiz-answer">
                <li onClick={this.handleAnswer}>{this.props.answer.answer}</li>
            </div>
    }

}
