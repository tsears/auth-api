export default function(...args) {
    // fake a promise chain without the async baggage...
    return {
        then: function(fn) {
            fn(null, args);

            return {
                catch: (fn) => { fn({message: 'Fake Error'}) },
            }
        },

    }
}
