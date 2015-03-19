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
            window._interactive_element = el;
            addJS("http://interactive.guim.co.uk/2015/mar/poets-houses-quiz/app.js");
        }
    };
});
