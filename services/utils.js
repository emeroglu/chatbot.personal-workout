$js.compile("$utils", [], function($self) {

    $self.schema = {

        looper: function($max, $f) {

            var loop = "";
            var i = [], s = [];
        
            var m = $max;
            var span = $max.length;
        
            for (let k = 0; k < span; k++) {
                i.push(0);
            }
        
            for (let k = 0; k < span; k++) {
                loop += "for(i[" + k + "]=0;i[" + k + "]<m[" + k + "];i[" + k + "]++){";
            }
        
            loop += "$f(i);";
        
            for (let k = 0; k < span; k++) {
                loop += "}";
            }
        
            eval(loop);

        },

        ordered_combinator: function($text) {

            var words = $text.split(" ");

            var combinations = [];
            var s;

            for (var i = 0; i <= 3; i++) {
                for (var j = i; j <= 3; j++) {

                    s = "";

                    for (var k = i; k <= j; k++) {
                        s += words[k] + " ";
                    }

                    s = s.substring(0, s.length - 1).trim();

                    combinations.push(s);

                }
            }

            return combinations;

        }

    };

});