$global.$js = function() {

    this.current = "";

    this.schemas = {};
    this.compile = function(name, imports, delegate) {
        
        $js.schemas[name] = { imports: imports, delegate: delegate };

        var ctor = "function() { if ($js.current == '') $js.current = '" + name + "'; this.__key__ = '" + name + "'; if (this.__name__ == undefined) this.__name__ = '" + name + "'; $js.instantiate(this); };";

        if (name.indexOf(".") != -1) {
          
            if ($global["$" + name.split(".")[0]] == undefined)
                $global["$" + name.split(".")[0]] = {};

            eval("$global['$" + name.split(".")[0] + "']['" + name.split(".")[1] + "'] = " + ctor);

        } else {

            eval("$global['" + name + "'] = " + ctor);

        }

    };

    this.instantiate = function(instance) {

        var key = instance.__key__;
        var schema = $js.schemas[key];

        for (var j = 0; j < schema.imports.length; j++) {
            $js.import(instance, eval(schema.imports[j]));
        }

        schema.delegate(instance, {});

        if (key == $js.current && instance.on_build != null) {
            instance.on_build();
            delete instance.on_post_build;
        }

        $js.build(instance);
        $js.printer(instance);
        $js.reorder(instance);

        if (key == $js.current) {

            $js.current = "";

            if (instance.on_post_build != null) {
                instance.on_post_build();
                delete instance.on_post_build;
            }

        }

        delete instance.__key__;

    };

    this.import = function (instance, proto) {

        proto.call(instance);

        if (instance.__protos__ == undefined)
            instance.__protos__ = [];

        instance.__protos__.push(proto.name);

    };

    this.build = function(instance) {

        if (instance.__virtuals__ == undefined) {
            instance.__virtuals__ = {};            
        }

        if (instance.__extensions__ == undefined) {
            instance.__extensions__ = {};            
        }


        for (var key in instance.fields) {
            instance[key] = instance.fields[key];
        }

        for (var key in instance.delegates) {
            instance[key] = instance.delegates[key];
        }

        for (var key in instance.virtuals) {

            if (!(key in instance.__virtuals__))
                instance.__virtuals__[key] = [];

            instance.__virtuals__[key].push(instance.virtuals[key]);
            instance[key] = instance.virtuals[key];

        }
        
        for (var key in instance.extensions) {

            instance.__extensions__[key] = instance.extensions[key];
            instance[key] = function () {

                var key = new Error().stack.match(new RegExp("as " + "(.*)" + "]"))[1];

                if (key in instance.__virtuals__) {

                    for (var i = 0; i < instance.__virtuals__[key].length; i++) {
                        instance.__virtuals__[key][i]();
                    }

                }

                instance.__extensions__[key]();

            };

        }                          

        for (var key in instance.overrides) {
            instance[key] = instance.overrides[key];
        }  

        for (var key in instance.schema) {
            instance[key] = instance.schema[key];
        } 

        delete instance.fields;
        delete instance.delegates;
        delete instance.virtuals;
        delete instance.extensions;        
        delete instance.overrides;
        delete instance.schema;

    };

    this.printer = function(instance) {

        if (instance.print == undefined)
            instance.print = function() {

                console.log(JSON.stringify(instance, function(key, value) {

                    if (key == "print")
                        return;

                    if (key == "printf")
                        return;

                    if (key[0] == "_")
                        return;

                    if (typeof value === 'function')
                    return;

                    return value;
                    
                }, 2).replace(/\\"/g,"'"));

            };

        instance.printf = function() {

            console.log(JSON.stringify(instance, function(key, value) {

                if (key == "print")
                    return;

                if (key == "printf")
                    return;

                if (key[0] == "_")
                    return;

                if (typeof value === 'function')
                  return value.toString();

                return value;
                
              }, 2).replace(/\\"/g,"'").replace(/\\n\\n/g, "\n"));

        };

        instance.__print__ = function() {

            console.log(JSON.stringify(instance, function(key, value) {
                
                if (key == "print")
                    return;

                if (key == "printf")
                    return;
                
                if (key == "__print__")
                    return;

                if (key == "__protos__")
                    return JSON.stringify(value, null, 0);

                if (key == "__virtuals__")
                    return JSON.stringify(value, function(k,v) {
                            if (typeof v === 'function')
                                return v.name; 
                            return v;
                        }, 0);

                if (typeof value === 'function')
                  return value.name;

                return value;
                
              }, 2).replace(/\\"/g,"'"));

        };

    };

    this.reorder = function(instance) {

        var sys = [], schema = [];

        for (var key in instance) {
            if (key[0] == "_")
                sys.push({ key: key, value: instance[key] });
            else
                schema.push({ key: key, value: instance[key] });
            delete instance[key];
        }

        sys.sort(function(a, b) {
            if (a.key < b.key) return -1;
            if (b.key < a.key) return 1;
            return 0;
        });

        schema.sort(function(a, b) {
            if (a.key < b.key) return -1;
            if (b.key < a.key) return 1;
            return 0;
        });

        for (var i in schema) {
            instance[schema[i].key] = schema[i].value;
        }

        for (var i in sys) {
            instance[sys[i].key] = sys[i].value;
        }

    };

};

$global.$js = new $js();