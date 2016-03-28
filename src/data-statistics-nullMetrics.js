/**
 * simple class that stores null/notNull in internal nullObject and handles the updates
 * nullObject is always accessible
 */
export default class NullMetrics {
    /**
     * initialization with options
     * @param options
     * options:
     * elements: array of elements, any array that has appropriate number of elements
     * considerEmpty: whether empty string should be considered null
     */
    constructor(options = {elements: [], considerEmpty: true}) {
        this.nullObject = this._createNullObject(options.elements || []);
        if(typeof options.considerEmpty !== "undefined") {
            this.considerEmpty = options.considerEmpty;
        } else {
            this.considerEmpty = true;
        }
    }

    _createNullObject(elements) {
        return elements.map(element =>{
            return {nullCount: {null:0,nonNull:0}};
        });
    };

    /**
     * public method that should be called when you are "adding" new line of data (new data element)
     * @param fields object
     */
    checkNulls(fields) {
        if(fields.length == this.nullObject.length) {
            this.nullObject = this.nullObject.map((nobj,index)=>{
                if (fields[index].value == null || (this.considerEmpty && fields[index].value == "")) {
                    return {nullCount: {null: nobj.nullCount.null + 1, nonNull: nobj.nullCount.nonNull}};
                } else {
                    return {nullCount: {null: nobj.nullCount.null, nonNull: nobj.nullCount.nonNull  + 1}};
                }
            });
        } else {
            console.error("NullMetrics: checked object does not have the same length as initialized Metrics, ignoring");
        }
    }

}