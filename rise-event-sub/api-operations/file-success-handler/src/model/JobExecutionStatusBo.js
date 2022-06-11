

class JobExecutionStatusBo {

    /**
     * 
     * @param {*} partitionkey 
     * @param {*} sortKey 
     * @param {*} correlationId 
     * @param {*} error 
     * @param {*} updationTime 
     * @param {*} creationTime 
     * @param {*} expirationTime 
     */
    constructor(partitionkey, sortKey, correlationId, error, params) {
        this.partitionkey = partitionkey;
        this.sortKey = sortKey; 
        this.correlationId = correlationId;
        this.error = error;
        this.updationTime = params.updationTime;
        this.creationTime = params.creationTime;
        this.expirationTime = params.expirationTime;
    }

    /**
     * @description This method return create item object
     */
    toCreateItem() {
        return {
            partitionkey: this.partitionkey,
            sortKey: this.sortKey,
            correlationId: this.correlationId,            
            processCount: 0,
            error: this.error,
            updationTime: this.updationTime,
            creationTime: this.creationTime,
            expirationTime: this.expirationTime
        };
    }
}

module.exports = JobExecutionStatusBo;