function init() {

    globalize();
    
    require_services();
    init_services();

    require_objects();

    init_convo();
    init_agents();

    serve();

}

function globalize() {

    global.$global = global;

}

function require_services() {

    require('./services/js.js');
    require('./services/agents.js');
    require('./services/convos.js');
    require('./services/interpreter.js');
    require('./services/utils.js');

}

function init_services() {
    
    $global.$agents = new $agents();
    $global.$convos = new $convos();
    $global.$interpreter = new $interpreter();
    $global.$utils = new $utils();

}

function require_objects() {

    require('./abstract/Intent.js');
    require('./abstract/intents/menu/ExistenceIntent.js');

    require('./abstract/Agent.js');
    require('./abstract/agents/MenuAgent.js');

    require('./abstract/Convo.js');
    require('./abstract/ConvoItem.js');

}

function init_convo() {

    $global.$convo = new Convo();

}

function init_agents() {
    
    $agents.menu = new MenuAgent();

}

function serve() {

    require('./services/server.js');

}

init();