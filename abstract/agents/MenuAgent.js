$js.compile("MenuAgent", [Agent], function($self) {

    $self.overrides = {

        provide_name: function() { return "menu"; },

        provide_intents: function() {

            return {

                existence: new $MenuAgent.ExistenceIntent()

            };

        },

        provide_entity: function() { return "menu" },
        provide_entities: function() {

            return {

                "beef": [
                    { texts: ["beef"], weight: 1 },
                    { texts: ["beefs"], weight: 0.9 }
                ],
                "beef:sucuk": [
                    { texts: ["sucuk"], weight: 1 },
                    { texts: ["sucuks"], weight: 0.9 }
                ]
            
            };

        }

    };

});