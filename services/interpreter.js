$js.compile("$interpreter", [], function($self, $var) {

    $var.init = function() {

        $var.interpretation = {};

        $var.interpretation.score = 0;
        $var.interpretation.sentence = $var.text;
        $var.interpretation.interpreted = "";
        $var.interpretation.intent = "";
        $var.interpretation.phrase = "";
        $var.interpretation.context = {};

        $var.interpretation.analysis = {};

    };

    $var.try_matching_intents = function() {

        $var.interpretation.analysis.intents = {};

        for (var key in $var.intents) {
            $var.try_matching_intent(key, $var.intents[key]);
        }

        $var.find_winning_intent();

    };

    $var.try_matching_intent = function($key, $intent) {

        $var.intent = {};

        $var.intent.score = 0;
        $var.intent.phrase = "";
        $var.intent.sentence = $var.text;
        $var.intent.interpreted = "";
        $var.intent.phrases = {};

        $var.interpretation.analysis.intents[$key] = $var.intent;

        for (var key in $intent.phrases) {
            $var.try_matching_phrase(key, $intent.phrases[key], $intent);
        }

        $var.find_winning_phrase();

        $var.include_context($intent);

    };

    $var.try_matching_phrase = function($key, $phrase, $intent) {

        $var.phrase = {};

        $var.phrase.score = 0;
        $var.phrase.schema = $phrase;
        $var.phrase.sentence = $var.text;
        $var.phrase.interpreted = $var.text;
        $var.phrase.steps = [];

        $var.intent.phrases[$key] = $var.phrase;

        var elements = $phrase.split(" ");

        $var.sentence = $var.text;

        for (var index in elements) {
            $var.try_matching_element(elements[index], $intent);
        }

    };

    $var.try_matching_element = function($element, $intent) {

        var parts = $element.split(":");

        if (parts[0][0] == "@") {

            var frag = parts[0].replace("@","");
            var weight = parseFloat((parseInt(parts[1]) * 0.01).toFixed(2));

            var fragment = $intent.fragments[frag];

            $var.try_matching_fragment(frag, fragment, weight);

        } else if (parts[0][0] == "$") {

            var ntt = parts[0].replace("$","");
            var weight = parseFloat((parseInt(parts[1]) * 0.01).toFixed(2));
    
            var entity = $var.entities[ntt];

            $var.try_matching_entity(ntt, entity, weight);

        }

    };

    $var.try_matching_fragment = function($frag, $fragment, $weight) {

        var text, stop;

        for (var i in $fragment) {
            for (var j in $fragment[i].texts) {
    
                text = $fragment[i].texts[j];

                if ($var.phrase_is_in_sentence(text)) {
    
                    var score = parseFloat(parseFloat($weight * $fragment[i].weight).toFixed(2));
    
                    $var.sentence = $var.sentence.split(text)[1].trim();

                    $var.phrase.interpreted = $var.phrase.interpreted.replace(text, "@" + $frag);
                    $var.phrase.score += score;
    
                    $var.phrase.steps.push({
                        type: "fragment",
                        name: "@" + $frag,
                        weight: $fragment[i].weight,
                        location: $var.text.replace(text, "@" + $frag),
                        text: text,
                        score: score
                    });
    
                    stop = true;
    
                    break;
    
                }
    
            }
    
            if (stop) break;
    
        }

    };

    $var.try_matching_entity = function($ntt, $entity, $weight) {

        var text, stop;

        for (var key in $entity) {
            for (var i in $entity[key]) {
                for (var j in $entity[key][i].texts) {
    
                    text = $entity[key][i].texts[j];
    
                    if ($var.phrase_is_in_sentence(text)) {

                        var score = parseFloat(parseFloat($weight * $entity[key][i].weight).toFixed(2));
    
                        $var.sentence = $var.sentence.split(text)[1].trim();

                        $var.phrase.interpreted = $var.phrase.interpreted.replace(text, "$" + $ntt);
                        $var.phrase.score += score;
    
                        $var.phrase.steps.push({
                            type: "entity",
                            name: "$" + $ntt,
                            key: key,
                            weight: $entity[key][i].weight,
                            text: text,
                            location: $var.text.replace(text, "$" + $ntt),
                            score: score
                        });
    
                        stop = true;
    
                        break;
    
                    }
    
                }
    
                if (stop) break;
    
            }
    
            if (stop) break;
    
        }

    };

    $var.phrase_is_in_sentence = function($phrase) {

        var mashed_sentences = $utils.ordered_combinator($var.sentence);

        for (var index in mashed_sentences) {
            if (mashed_sentences[index] == $phrase) return true;
        }

        return false;

    };

    $var.find_winning_intent = function() {

        var max = 0;
        var intent;

        for (var key in $var.interpretation.analysis.intents) {

            intent = $var.interpretation.analysis.intents[key];

            if (max < intent.score) {

                max = intent.score;

                $var.interpretation.intent = key;
                $var.interpretation.interpreted = intent.interpreted;
                $var.interpretation.phrase = intent.phrase;
                $var.interpretation.score = intent.score;

            }

        }

    };

    $var.find_winning_phrase = function() {

        var max = 0;
        var phrase;

        for (var key in $var.intent.phrases) {

            phrase = $var.intent.phrases[key];

            if (max < phrase.score) {

                max = phrase.score;

                $var.intent.phrase = key;
                $var.intent.interpreted = phrase.interpreted;
                $var.intent.score = phrase.score;

            }

        }

    };

    $var.include_context = function($intent) {

        for (var key in $var.context) {
            for (var key_2 in $intent.contexts) {
    
                if (key == key_2) {

                    $var.intent.score = parseFloat(parseFloat($var.intent.score * $intent.contexts[key_2].weight).toFixed(2));
    
                }
    
            }
        }
    
    };

    $var.apply_context = function() {

        if ($var.interpretation.score == 0) return;

        var _intent = $var.interpretation.intent;
        var _phrase = $var.interpretation.phrase;

        var context = $var.intents[_intent].context;
        var phrase = $var.interpretation.analysis.intents[_intent].phrases[_phrase];

        var value, lifetime;

        for (var key in context) {

            value = context[key].value;
            lifetime = context[key].lifetime;
    
            if (value[0] == "$") {
    
                for (var index in phrase.steps) {
    
                    if (phrase.steps[index].name == value) {
    
                        $var.interpretation.context[key] = {
                            value: phrase.steps[index].key,
                            lifetime: lifetime
                        };
    
                        break;
    
                    }
    
                }
    
            } else {
    
                $var.interpretation.context[key] = {
                    value: value,
                    lifetime: lifetime
                };
    
            }
    
        }

    };

    $self.schema = {

        run: function($text, $intents, $entities, $context) {
            
            $var.text = $text;
            $var.sentence = $text;
            $var.intents = $intents;
            $var.entities = $entities;
            $var.context = $context;

            $var.init();

            $var.try_matching_intents();

            $var.apply_context();

            return $var.interpretation;

        }

    };

});