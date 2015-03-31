'use script';
define([], function () {
    function addJS(url) {
        var head = document.head,
            script = document.createElement('script');

        script.setAttribute('src', url);
        script.setAttribute('type', 'text/javascript');

        head.appendChild(script);
    }
    
    return {
        boot: function (el, context, config, mediator) {
            window._interactive_quiz_params = {
                el: el,
                context: context,
                config: config,
                mediator: mediator
            };
            
            addJS("http://interactive.guim.co.uk/2015/mar/football-quiz-1/app.js");
        }
    };
});
