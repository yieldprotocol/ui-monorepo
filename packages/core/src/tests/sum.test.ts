// @ts-nocheck
import { store } from '@yield-protocol/ui-redux';
// const { yieldProtocol } = latest store .subscribe()


beforeAll(async ()=> {
 //  console.log( store)

}) 


test('protocol loads', () => {

  const state = store.getState()
  console.log(state);
  expect(3).toBe(3);
});

