$js.compile("ConvoItem", [], function($self) {

    $self.fields = {

        index: 0,
        input: "",
        agents: [],
        context: {},
        interpretation: {},
        response: {}

    };

    $self.schema = {

        stringify: function($style) {

            if ($style == "plain") {

                return JSON.stringify($self, function(key,value) {
                
                        if (key[0] == "_")
                            return;

                        if (key == "agents") {
                            return JSON.stringify(value);
                        }

                        if (key == "analysis")
                            return;

                        return value;

                }, 2).replace(/\\"/g,"'");

            } else if ($style == "explicit") {
            
                return JSON.stringify($self, function(key,value) {
                
                        if (key[0] == "_")
                            return;

                        if (key == "agents")
                            return JSON.stringify(value);

                        return value;

                }, 2).replace(/\\"/g,"'");

            }

        }

    };

});