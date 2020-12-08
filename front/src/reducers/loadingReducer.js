const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const reducer = action => (state, props) => {
    switch (action.type) {
        case INCREMENT:
            return {
                value: state.value + action.amount,
            };
        case DECREMENT:
            return {
                value: state.value - 1,
            };
        default:
            return null;
    }
};