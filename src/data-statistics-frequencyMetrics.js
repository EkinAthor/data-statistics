/**
 * computes frequencies of the values in the data elements
 * If enabled, keeps the ebject with top 10 frequencies always available
 *
 * it also computes distinct counts (unique/duplicate/distinct/nonUnique)
 */
export default class FrequencyMetrics {
    /**
     * initialize frequency object
     * @param options
     * elements: array of the same size as data object
     * computeTmp: keep top n frequencies ready and accessible
     * tmpElements: max no of elements in tmp array
     */
    constructor(options = {elements:[], computeTmp: true, tmpElements: 10}) {
        const elems = options.elements || [];
        //frequencyObject that stores frequencies (index is the index of the element in elements)
        this.freqObject = this._createFreqObject(elems);
        //each field has its own frequency map and tmp freqyency map. Initialized with min value.
        this.fields = elems.map(element=> {
            return {freqMap: new Map(), freqTmp: new Map(), tmpMinVal: {key:null, value:0}};
        });
        this.maxTmp = options.tmpElements || 10;
        this.distinctCount = elems.map(elem=> {return {nonUnique: 0, unique: 0,duplicate: 0, distinct: 0};});
        if(typeof options.computeTmp !== "undefined") {
            this.computeTmp = options.computeTmp;
        } else {
            this.computeTmp = true;
        }
    }

    _createFreqObject(elements) {
        return elements.map(elem=>{
            return {freq: []};
        });
    }

    /**
     * add new "record" or attribute set to check
     * @param elements array of data elements
     */
    updateFrequencies(elements) {
        if(elements.length == this.freqObject.length) {
            for(var i=0;i<this.freqObject.length;i++) {
                this._updateFreq(elements[i],i);
            }
        } else {
            console.error("FrequencyMetrics: checked object does not have the same length as initialized Metrics, ignoring");
        }
    }

    /**
     * update single value for single field .. compute frequency
     * @param field
     * @param index
     * @private
     */
    _updateFreq(field, index) {
        var map = this.fields[index].freqMap;
        var tmp = this.fields[index].freqTmp;
        var tmpMinVal = this.fields[index].tmpMinVal;
        var val = map.get(field.value);
        //check if the value is already in the list, if yes, update count, if not, add
        if(typeof val !== 'undefined') {
            map.set(field.value, val+1);
            val = val+1;
        } else {
            map.set(field.value, 1);
            val = 1;
        }
        //the tmp list (top n values)
        if(this.computeTmp) {
            var tmpVl = tmp.get(field.value);
            //check if the value exists in the list
            if(typeof tmpVl !== 'undefined') {
                //add one to the value from the list
                tmp.set(field.value, val);
                //if the value was minimum in the list, check if it is more than any other value after update
                if(field.value == tmpMinVal.key) {
                    var min = tmpMinVal.value;
                    var minKey = field.value;
                    //check if any value from the list has lower frequency
                    for( let key of tmp.keys()) {
                        if(tmp.get(key) < min) {
                            min = tmp.get(key);
                            minKey = key;
                        }
                    }
                    //if lower frequency found, set is as minimum for this field
                    tmpMinVal = {key: minKey, value: min};
                }
            } else {
                //value was not found in the list
                //add new value to the list if size of tempList is under max acceptable
                //set this value as minimum automatically
                if(tmp.size < this.maxTmp) {
                    tmp.set(field.value, val);
                    if(tmp.size == 1) {
                        tmpMinVal = {key: field.value, value: val};
                    }
                //if value is not in the list and list is "full"
                } else {
                    //check if frequency is higher than the minimum in the list. If yes, delete minimum and add the new value as the minimum
                    if(val >= tmpMinVal.value) {
                        if(tmpMinVal.key != null) {
                            tmp.delete(tmpMinVal.key);
                        }
                        tmp.set(field.value, val);
                        tmpMinVal = {key: field.value, value: val};
                    }
                }
            }
        }
        //check unique/distinct/nonunique counts
        if(val == 1) {
            //this.distinctCount = {nonUnique: 0, unique: 0,duplicate: 0, distinct: 0};
            this.distinctCount[index].distinct++;
            this.distinctCount[index].unique++;
        } else {
            if(val == 2) {
                this.distinctCount[index].nonUnique++;
                this.distinctCount[index].unique--;
            }
            this.distinctCount[index].duplicate++;

        }
        //update metrics of the object
        this.fields[index].freqMap=map;
        this.fields[index].freqTmp=tmp;
        this.fields[index].tmpMinVal=tmpMinVal;
    }

    getFreqTopObject() {
        return this.fields.map(field=> {
            return {
                freq: Array.from(field.freqTmp).map(elem=> {
                    return {label: elem[0], value: elem[1]};
                })
            }
        });
    }

    getFreqObject() {
        return this.fields.map(field=> {
            return {
                freq: Array.from(field.freqMap).map(elem=> {
                    return {label: elem[0], value: elem[1]};
                })
            }
        });
    }

    getDistinctOpbject() {
        return this.distinctCount;
    }


}