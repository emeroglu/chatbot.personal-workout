$js.compile("Agent", [], function($self) {

    $self.fields = {

        name: "",
        intents: {},
        entities: {}

    };

    $self.virtuals = {

        provide_name: function() { return ""; },

        provide_intents: function() { return {}; },

        provide_entity: function() { return ""; },
        provide_entities: function() { return {}; }

    };

    $self.on_post_build = function() {

        $self.name = $self.provide_name();
        $self.intents = $self.provide_intents();
        $self.entities[$self.provide_entity()] = $self.provide_entities();

    };

    $self.schema = {

        interpret: function($text, $context) {

            return $interpreter.run($text, $self.intents, $self.entities, $context);

        },

        respond: function($intent) {

        }

    };

});