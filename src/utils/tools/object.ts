import _ from 'lodash'

declare module 'lodash' {
    interface LoDashStatic {
        deep(v: any, m: any): any;
    }
}

_.mixin({
    deep: function(obj, mapper) {
        return mapper(
            _.mapValues(obj, function(v) {
                if (_.isPlainObject(v)) {
                    return _.deep(v, mapper)
                }

                if (_.isArray(v)) {
                    return _.map(v, val => _.deep(val, mapper))
                }

                return v
            })
        )
    }
})

export function firstLetterToLowerCase(data: Record<string, any>) {
    return _.deep(data, function(x) {
        return _.mapKeys(x, function(val, key) {
            return key.charAt(0).toLowerCase() + key.slice(1)
        })
    })
}
