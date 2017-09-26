
// see https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Methods.md
export default (a) => {
    if (window && ('__REDUX_DEVTOOLS_EXTENSION__' in window)) {
        const rde = window['__REDUX_DEVTOOLS_EXTENSION__'];
        a(rde);
    }
}