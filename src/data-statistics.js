import NullM from "./data-statistics-nullMetrics";
import FrequencyM from "./data-statistics-frequencyMetrics";
import MaskM from "./data-statistics-masks";
import "babel-polyfill";


export class DataStatistics {
    constructor(options = {elements: [], nullMetrics: { considerEmpty: true}, frequencyMetrics: { computeTmp: true, tmpElements: 10}, maskMetrics: { computeTmp: true, tmpElements: 10}}) {
        const elems = options.elements || [];
        this.nullMetrics = new NullM(Object.assign(options.nullMetrics || {}, {elements: elems}) );
        this.frequencyMetrics = new FrequencyM(Object.assign(options.frequencyMetrics || {}, {elements: elems}));
        this.maskMetrics = new MaskM(Object.assign(options.maskMetrics || {}, {elements: elems}));
        this.count = 0;
    }

    /**
     * add new data row to the statistics. Call this for every data row
     * @param dataObject = [{vlaue: "someting"},{value: "...
     */
    updateStatistics(dataObject) {
        this.count++;
        this.nullMetrics.checkNulls(dataObject);
        this.frequencyMetrics.updateFrequencies(dataObject);
        this.maskMetrics.updateStatistics(dataObject);
    }

    /**
     * Gets an array of frequencies (top n) for the speciffied field (by index)
     * @param index
     * @returns []
     */
    getTopFrequencyObjectForField(index = 0) {
        return  this.frequencyMetrics.getFreqTopObject()[index];
    }

    /**
     * Returns array of fields with their top n frequencies
     * @returns {*}
     */
    getTopFrequencyObject() {
        return this.frequencyMetrics.getFreqTopObject();
    }

    /**
     * Gets an array of frequencies of mask analysis (top n) for the speciffied field (by index)
     * @param index
     * @returns []
     */
    getTopMaskFrequencyObjectForField(index = 0) {
       return this.maskMetrics.getFreqTopObject()[index];
    }

    /**
     * Returns array of fields with their top n frequencies of their masks
     * @returns {*}
     */
    getTopMaskFrequencyObject() {
        return this.maskMetrics.getFreqTopObject();
    }
    /**
     * Returns an ratio of nulls to not nulls for speciffic field
     * @param index
     * @returns {*}
     */
    getNullObjectForField(index = 0) {
        return this.nullMetrics.nullObject[index];
    }

    /**
     * Returns an array with null objects for all the fields
     * @returns {*}
     */
    getNullObject() {
        return this.nullMetrics.nullObject;
    }

    /**
     * Returns full object with all frequencies for the speciffic field
     * @param index
     * @returns {*}
     */
    getFrequencyObjectForField(index = 0) {
        return  this.frequencyMetrics.getFreqObject()[index];
    }

    /**
     * Returns array of all fields with their frequency objects
     * @returns {*}
     */
    getFrequencyObject() {
        return this.frequencyMetrics.getFreqObject();
    }
    /**
     * Returns full object with all mask analysis frequencies for the speciffic field
     * @param index
     * @returns {*}
     */
    getMaskFrequencyObjectForField(index = 0) {
        return  this.maskMetrics.getFreqObject()[index];
    }

    /**
     * Returns full object with all mask frequencies for all the fields
     * @returns {*}
     */
    getMaskFrequencyObject() {
        return this.maskMetrics.getFreqObject();
    }
    /**
     * Returns the object containing distinct/unique/diplicate count for speciffic field
     * @param index
     * @returns {*}
     */
    getDistinctCountsForField(index = 0) {
        return this.frequencyMetrics.getDistinctOpbject()[index];
    }

    /**
     * Returns oth object containing distinct/unique/duplicate count for all fields
     * @returns {*}
     */
    getDistinctCounts() {
        return this.frequencyMetrics.getDistinctOpbject();
    }
    /**
     * Returns the object containing distinct/unique/duplicate count of masks for speciffic field
     * @param index
     * @returns {*}
     */
    getMasksDistinctCountsForField(index = 0) {
        return this.maskMetrics.getDistinctOpbject()[index];
    }

    /**
     * Returns the object containing distinct/unique/duplicate count of masks for all fields
     * @returns {*}
     */
    getMasksDistinctCounts() {
        return this.maskMetrics.getDistinctOpbject();
    }



}

export  class NullMetrics extends NullM {};
export class FrequencyMetrics extends FrequencyM {};
export class MaskMetrics extends MaskM {};