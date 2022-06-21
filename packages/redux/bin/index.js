"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.updateProtocol = exports.yieldProtocolSlice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
exports.yieldProtocolSlice = (0, toolkit_1.createSlice)({
    name: 'yieldProtocol',
    initialState: 1,
    reducers: {
        updateProtocol: (state, action) => {
            // console.log('STATE UPDATE: ', state, action.payload);
            return Object.assign(Object.assign({}, state), action.payload);
        },
    }
});
exports.updateProtocol = exports.yieldProtocolSlice.actions.updateProtocol;
exports.store = (0, toolkit_1.configureStore)({
    reducer: exports.yieldProtocolSlice.reducer
});
// combineLatest( [ yieldObservables.messagesø , yieldObservables.yieldProtocolø ] ).pipe(
// ).subscribe(( [ msg, protocol] : [IMessage,IYieldProtocol] ) => { 
//     if  (msg.has('protocolLoaded') ) { console.log( '>>>>>>> protocol Loaded ');   };
//     if  (msg.has('protocolLoaded') ) updateProtocol('somethign');
// });
// combineLatest([ messagesø, yieldProtocolø ] ).pipe(
//   ).subscribe(([msg, yp]) => { 
//       if  (msg.has('protocolLoaded') ) { console.log( '>>>>>>> protocol Loaded ');   };
//       if  (msg.has('protocolLoaded') ) updateProtocol( { yp } );
//   });
//   combineLatest([ messagesø, yieldProtocolø ] ).pipe(
//     ).subscribe(([msg, yp]) => { 
//         if  (msg.has('protocolLoaded') ) { console.log( '>>>>>>> protocol Loaded ');   };
//         if  (msg.has('protocolLoaded') ) updateProtocol( { yp } );
//     });
//# sourceMappingURL=index.js.map