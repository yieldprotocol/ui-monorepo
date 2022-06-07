import React from "react";
import { Observable } from "rxjs";
declare const YieldContext: React.Context<any>;
export declare const useObservable: (observable: Observable<any>, showError?: boolean) => undefined[] | undefined;
declare const YieldProvider: ({ props, children }: any) => JSX.Element;
export { YieldContext, YieldProvider };
