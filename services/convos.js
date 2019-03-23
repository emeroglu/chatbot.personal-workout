$js.compile("$convos", [], function($self) {

    $self.fields = {

        index: -1,
        items: []

    };

    $self.schema = {

        new: function() {

            var convo = new Convo();

            $self.index++;

            convo.id = $self.index;

            $self.items.push(convo);

            return convo;

        },

        find: function($id) {

            for (var i in $self.items) {
                if ($self.items[i].id == $id) return $self.items[i];
            }

        }

    };

});