$js.compile("Convo", [], function($self, $var) {

    $self.fields = {

        id: 0,
        index: -1,
        items: []

    };

    $self.schema = {

        add: function($item) {

            $self.index++;

            $item.index = $self.index;

            $self.items.push($item);

        },

        at: function($index) {
            return $self.items[$index];
        },

        last: function() {
            return $self.items[$self.index];
        },

        process: function($text) {

            var last_item = $self.last();

            var item = new ConvoItem();
            item.input = $text;
            item.agents = $self.last().agents;

            $var.copy_context(item, last_item);
            $var.apply_context(item, last_item);

            $var.find_winning_interpretation(item);

            $self.add(item);

        },

        stringify: function() {

            return JSON.stringify($self, function(key, value) {

                if (key[0] == "_")
                    return;

                if (key == "agents")
                    return JSON.stringify(value);

                if (key == "analysis")
                    return;

                return value;

            }, 2).replace(/\\"/g,"'");

        }

    };

    $var.find_winning_interpretation = function($item) {

        var interpretation;
        var max = 0;

        for (var i in $item.agents) {
            
            interpretation = $agents[$item.agents[i]].interpret($item.input, $item.context);

            if (max < interpretation.score) {
                
                max = interpretation.score;

                $item.interpretation = interpretation;

            }

        }

    };

    $var.copy_context = function($item, $last_item) {

        var context;

        for (var key in $last_item.context) {

            context = $last_item.context[key];

            context.lifetime--;

            if (context.lifetime != 0) {
                $item.context[key] = context;
            }

        }

    };

    $var.apply_context = function($item, $last_item) {

        for (var key in $last_item.interpretation.context) {
            $item.context[key] = $last_item.interpretation.context[key];
        }

    };

});