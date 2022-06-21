import { createSlice, configureStore } from '@reduxjs/toolkit'
import { combineLatest } from "rxjs";
import {
  yieldObservables,
//   yieldFunctions,
//   yieldConstants,
//   viewObservables,
//   viewFunctions,
} from "@yield-protocol/ui-core";

export const yieldProtocolSlice = createSlice({
  name: 'yieldProtocol',
  initialState: 1,
  reducers: {
    updateProtocol: (state: any, action:any) =>  {
        // console.log('STATE UPDATE: ', state, action.payload);
        return  { ...state, ...action.payload} ;
    },
  }
});

export const { updateProtocol } = yieldProtocolSlice.actions

export const store = configureStore({
  reducer: yieldProtocolSlice.reducer
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

