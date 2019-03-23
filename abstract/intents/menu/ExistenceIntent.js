$js.compile("MenuAgent.ExistenceIntent", [Intent], function($self) {

    $self.overrides = {

        provide_context: function() { return { menu: { value: "beef:sucuk", weight: 1.1 } }; },

        provide_phrases: function() {

            return {
                existence_1: "@frag_1:30 $menu:40 @frag_2:30",
                existence_2: "@frag_1:45 $menu:55",
                existence_3: "@frag_3:20 @frag_4:20 $menu:40 @frag_2:20",
                existence_4: "@frag_3:30 $menu:40 @frag_2:30"
            };

        },

        provide_fragments: function() {

            return {
                frag_1: [
                    { texts: ["do you have", "dont you have", "do not you have", "don't you have"], weight: 1 },
                    { texts: ["you have"], weight: 0.9 }
                ],
                frag_2: [
                    { texts: ["in your menu", "in the menu"], weight: 1  },
                    { texts: ["in menu"], weight: 0.9  }
                ],
                frag_3: [
                    { texts: ["is there", "are there"], weight: 1  }
                ],
                frag_4: [
                    { texts: ["any", "some"], weight: 1  }
                ]
            };

        },

        on_context: function() { return { menu: { value: "$menu", lifetime: 3 } }; }

    };

});