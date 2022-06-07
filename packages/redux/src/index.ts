import { createSlice, configureStore } from '@reduxjs/toolkit'
import { filter, combineLatest, map } from "rxjs";
import {
  yieldObservables,
//   yieldFunctions,
//   yieldConstants,
//   viewObservables,
//   viewFunctions,
} from "@yield-protocol/ui-core";
import { IMessage } from '@yield-protocol/ui-core/bin/types';

const { yieldProtocolø, selectedø, messagesø } = yieldObservables;

const yieldProtocolSlice = createSlice({
  name: 'yieldProtocol',
  initialState: 1,
  reducers: {
    updateProtocol: (state: any, action:any) =>  {
        // console.log('STATE UPDATE: ', state, action.payload);
        console.log ('ehererererererer')
        return  { ...state, ...action.payload} ;
    },
  }
});

export const { updateProtocol } = yieldProtocolSlice.actions
export const store = configureStore({
  reducer: yieldProtocolSlice.reducer
});

combineLatest([ messagesø, yieldProtocolø ] ).pipe(
).subscribe(([msg, yp]) => { 
    if  (msg?.id === 'protocolLoaded' ) { console.log( '>>>>>>> protocol Loaded ');   };
    if  (msg?.id === 'protocolLoaded' ) updateProtocol( { yp } );
});