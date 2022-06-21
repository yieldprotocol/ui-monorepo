"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.updateProtocol = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const rxjs_1 = require("rxjs");
const ui_core_1 = require("@yield-protocol/ui-core");
const { yieldProtocolø, selectedø, messagesø } = ui_core_1.yieldObservables;
const yieldProtocolSlice = (0, toolkit_1.createSlice)({
    name: 'yieldProtocol',
    initialState: 1,
    reducers: {
        updateProtocol: (state, action) => {
            // console.log('STATE UPDATE: ', state, action.payload);
            return Object.assign(Object.assign({}, state), action.payload);
        },
    }
});
exports.updateProtocol = yieldProtocolSlice.actions.updateProtocol;
exports.store = (0, toolkit_1.configureStore)({
    reducer: yieldProtocolSlice.reducer
});
(0, rxjs_1.combineLatest)([messagesø, yieldProtocolø]).pipe().subscribe(([msg, yp]) => {
    if (msg.has('protocolLoaded')) {
        console.log('>>>>>>> protocol Loaded ');
    }
    ;
    if (msg.has('protocolLoaded'))
        (0, exports.updateProtocol)({ yp });
});
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