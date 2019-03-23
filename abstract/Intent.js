$js.compile("Intent", [], function($self) {

    $self.fields = {

        contexts: {},
        phrases: {},
        fragments: {},
        context: {}

    };

    $self.virtuals = {

        provide_context: function() { return {}; },

        provide_phrases: function() { return {}; },

        provide_fragments: function() { return {}; },

        on_context: function() { return {}; },

        on_interpreted: function() { }

    };

    $self.on_post_build = function() {

        $self.contexts = $self.provide_context();
        $self.phrases = $self.provide_phrases();
        $self.fragments = $self.provide_fragments();
        $self.context = $self.on_context();

    };

});