const Kefir = require('kefir')
const values = require('lodash/values')
const keys = require('lodash/keys')

class ThreadsStore {
    constructor() {
        const self = this
        this._emitter = null
        this._threadsData = {}

        this._stream = Kefir.stream(emitter => {
            self._emitter = emitter
            return () => null
        })

        this._stream.onAny(event => {})
    }
    
    getThreadData(threadId) {
        return this._threadsData[threadId]
    }
    
    hasThreadData(threadId) {
        return !!this._threadsData[threadId]
    }
    
    initThreadsData() {
        values(this._threadsData).forEach(threadData => {
            threadData.isEmailThing = false
        })
    }
    
    initThreadData(threadId) {
        this._threadsData[threadId] = {
            isEmailThing: false
        }
    }
    
    markAsThing(threadIds) {
        threadIds.forEach(threadId => {
            const threadData = this._threadsData[threadId] || {}
            threadData.isEmailThing = true
            if (!this._threadsData[threadId]) {
                this._threadsData[threadId] = threadData
            }
        })

        keys(this._threadsData).forEach(threadId => {
            const threadData = this._threadsData[threadId]
            this._emitter.emit({threadId, isEmailThing: threadData.isEmailThing})
        })
    }
    
    getStream() {
        return this._stream
    }
}

module.exports = ThreadsStore