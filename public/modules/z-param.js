const z = {

    defs: null,

    object(def){
        this.defs = def;
    },

    parse(props, options=null) {
        
        for(key in props) 
            if(!(key in this.defs)) throw Error(`Param ${key} isn't allowed into schema`);

        for(key in this.defs) 
            if(!(key in props) && !this.defs[key].endsWith("?")) throw Error(`Param ${key} is required in schema and wasn't informed`);
        
        for(key in props) 
            if(typeof props[key] != this.defs[key] && (
                ( this.defs[key].replace("?", "") == "boolean" && !(/^true|false$/i.test(props[key]) || /^1|0$/i.test(props[key])) ) ||
                ( this.defs[key].replace("?", "") == "number" && !/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/i.test(props[key]) )
            )) 
            throw Error(`Param type ${typeof props[key]} doesn't match valid schema for ${key}. Expected ${this.defs[key]}.`);
        
        if(options) {

            for(key in this.defs) {
                if(this.defs[key] == "boolean")
                    props[key] = options.BOOLEAN_AS == "number" 
                        ? Number(/^true$/i.test(props[key]))
                        : /^1$/i.test(props[key])

                if(this.defs[key] == "boolean?" && props[key])
                    props[key] = options.BOOLEAN_AS == "number" 
                        ? Number(/^true$/i.test(props[key]))
                        : /^1$/i.test(props[key])
            }
        
        }
        
        return props
    }
}

module.exports = z;