# Yield Protocol UI-CORE 

The core package provides all the core [observables](https://rxjs.dev/guide/observable) and user functions: 

### [Core Observables](https://silver-engine-e5b67cb1.pages.github.io/modules/observable.html)
Streams of *mission critical* protocol data.

_Note: Every dApp implemetation should subscribe to these observables._

### [View Observables](https://silver-engine-e5b67cb1.pages.github.io/modules/viewObservables.html)
View observables are **support** observables (data streams). They provide informational insight into the protocol. For example, they are used for estimations of potential transactions, user input validation and any potential protocol limitations/errors. They are mostly used for display and purposes, and user input validations.

_Note: View Observables are not critical to protocol functioning and can be subscribed/unsubscribed to at any point within a dApp._

### [User Actions ](https://silver-engine-e5b67cb1.pages.github.io/modules/actions.html)
Actions are the callable protocol functions available to the end user (eg. Borrow, lend, addLiquidity etc)

### [Types](https://silver-engine-e5b67cb1.pages.github.io/modules/types.html)
All the yield Protocol types are also exposed for easier implementation/reference. 
