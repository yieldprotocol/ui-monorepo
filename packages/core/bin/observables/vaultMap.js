"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVaults = exports.vaultMapø = exports.vaultMap$ = void 0;
const tslib_1 = require("tslib");
const date_fns_1 = require("date-fns");
const ethers_1 = require("ethers");
const ui_math_1 = require("@yield-protocol/ui-math");
const rxjs_1 = require("rxjs");
const buildVaultMap_1 = require("../initProtocol/buildVaultMap");
const types_1 = require("../types");
const constants_1 = require("../utils/constants");
const appUtils_1 = require("../utils/appUtils");
const connection_1 = require("./connection");
const yieldProtocol_1 = require("./yieldProtocol");
const messages_1 = require("./messages");
const yieldUtils_1 = require("../utils/yieldUtils");
/** @internal */
exports.vaultMap$ = new rxjs_1.BehaviorSubject(new Map([]));
exports.vaultMapø = exports.vaultMap$.pipe((0, rxjs_1.share)());
/* Update vaults function */
const updateVaults = (vaultList) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const list = vaultList !== undefined ? vaultList : Array.from(exports.vaultMap$.value.values());
    /* if there are some vaults: */
    if (list.length) {
        yield Promise.all(
        // TODO: maybe get them together?
        list.map((_vault) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const vaultUpdate = yield _updateVault(_vault, connection_1.account$.value, yieldProtocol_1.yieldProtocol$.value);
            exports.vaultMap$.next(new Map(exports.vaultMap$.value.set(_vault.id, vaultUpdate))); // note: new Map to enforce ref update
        })));
    }
    else {
        /* if the list is empty, return an empty vaultMap */
        exports.vaultMap$.next(new Map([]));
    }
});
exports.updateVaults = updateVaults;
/**
 *  Observe yieldProtocolø and accountø changes TOGETHER >  Initiate OR Empty VAULT Map
 * */
(0, rxjs_1.combineLatest)([connection_1.accountø, yieldProtocol_1.yieldProtocolø])
    // only emit if account is defined and yp.cauldron adress exists - indicating protocol has mostly loaded
    .pipe((0, rxjs_1.filter)(([a, yp]) => a !== undefined && yp.cauldron.address !== ''), (0, rxjs_1.withLatestFrom)(connection_1.chainIdø))
    .subscribe(([[_account, _protocol], _chainId]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (_account !== undefined) {
        console.log('Getting vaults for: ', _account);
        const vaultMap = yield (0, buildVaultMap_1.buildVaultMap)(_protocol, _account, _chainId);
        yield (0, exports.updateVaults)(Array.from(vaultMap.values()));
        console.log('Vaults loading complete.');
        (0, messages_1.sendMsg)({ message: 'Vaults Loaded', type: types_1.MessageType.INTERNAL });
    }
    else {
        /* if account changes and is undefined > EMPTY the vaultMap */
        exports.vaultMap$.next(new Map([]));
    }
}));
const _updateVault = (vault, account, yieldProtocol) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { seriesRootMap, cauldron, witch, oracleMap, assetRootMap } = yieldProtocol;
    const RateOracle = oracleMap.get('RateOracle');
    /* Get dynamic vault data */
    const [{ ink, art }, { owner, seriesId, ilkId }, // update balance and series (series - because a vault can have been rolled to another series) */
    liquidations, // get the list of liquidations on this vault
    ] = yield Promise.all([
        cauldron.balances(vault.id),
        cauldron.vaults(vault.id),
        witch.queryFilter(witch.filters.Auctioned((0, ui_math_1.bytesToBytes32)(vault.id, 12), null), 'earliest', 'latest'),
    ]);
    /* Check for liquidation event date */
    const liquidationDate = liquidations.length ? liquidations[0].args.start.toNumber() : undefined;
    /* check if the series is mature - Note: calc'd from yieldProtocol.seriesMap instead of relying on seriesMap$ observations */
    const series = seriesRootMap.get(seriesId);
    const seriesIsMature = series.maturity - Math.round(new Date().getTime() / 1000) <= 0;
    /* Note: get base and ilk roots from  yieldProtocol.rootMaps - instead of assetMap$ reliance */
    const base = assetRootMap.get(vault.baseId);
    const ilk = assetRootMap.get(ilkId);
    let accruedArt = art;
    let rateAtMaturity = ethers_1.BigNumber.from('1');
    let rate = ethers_1.BigNumber.from('1');
    if (seriesIsMature) {
        rateAtMaturity = yield cauldron.ratesAtMaturity(seriesId);
        [rate] = yield RateOracle.peek((0, ui_math_1.bytesToBytes32)(vault.baseId, 6), '0x5241544500000000000000000000000000000000000000000000000000000000', // bytes for 'RATE'
        '0');
        [accruedArt] = rateAtMaturity.gt(constants_1.ZERO_BN)
            ? (0, ui_math_1.calcAccruedDebt)(rate, rateAtMaturity, art)
            : (0, ui_math_1.calcAccruedDebt)(rate, rate, art);
    }
    const ink_ = ilk && (0, appUtils_1.truncateValue)(ethers_1.ethers.utils.formatUnits(ink, ilk.decimals), ilk.digitFormat);
    const art_ = base && (0, appUtils_1.truncateValue)(ethers_1.ethers.utils.formatUnits(art, vault.baseDecimals), base.digitFormat);
    const accruedArt_ = base && (0, appUtils_1.truncateValue)(ethers_1.ethers.utils.formatUnits(accruedArt, vault.baseDecimals), base.digitFormat);
    return Object.assign(Object.assign({}, vault), { owner, isActive: owner === account, // refreshed in case owner has been updated
        seriesId,
        ilkId, ink: (0, yieldUtils_1.bnToW3Number)(ink, vault.ilkDecimals), art: (0, yieldUtils_1.bnToW3Number)(art, vault.baseDecimals), accruedArt: (0, yieldUtils_1.bnToW3Number)(accruedArt, vault.baseDecimals), underLiquidation: witch.address === owner, hasBeenLiquidated: !!liquidationDate, // TODO redundant ??
        liquidationDate, liquidationDate_: liquidationDate ? (0, date_fns_1.format)(new Date(liquidationDate * 1000), 'dd MMMM yyyy') : undefined, rateAtMaturity: (0, yieldUtils_1.bnToW3Number)(rateAtMaturity, 18, 2), rate: (0, yieldUtils_1.bnToW3Number)(rate, 18, 2) });
});
//# sourceMappingURL=vaultMap.js.map