/* eslint-env mocha */

const {expect} = require('chai')

const immutable = require('./immutable')

describe('Immutable', () => {
    let original, theImmutable

    beforeEach(() => {
        original = {
            someObj: {
                someKey: 'a'
            },
            someArray: [
                {
                    someItemKey: '1'
                },
                {
                    someItemKey: '2'
                },
                {
                    someItemKey: '3'
                }
            ]
        }
        theImmutable = immutable(original)
    })

    describe('touch', () => {
        it('changes an object reference', () => {
            const result = theImmutable.touch('someObj').value()
            result.someObj.someKey = 'b'
            expect(original.someObj === result.someObj).to.be.false
            expect(original.someObj.someKey).to.equal('a')
        })

        it('changes an array reference', () => {
            const result = theImmutable.touch('someArray').value()
            result.someArray.push({someItemKey: '4'})
            expect(original.someArray === result.someArray).to.be.false
            expect(original.someArray.length).to.equal(3)
        })
    })

    describe('arrayMergeItem', () => {
        it('adds a new property to an existing item', () => {
            const result = theImmutable.arrayMergeItem('someArray', {someItemKey: '1'}, {someNewKey: 'newValue'}).value()
            expect(result.someArray[0].someItemKey).to.equal('1')
            expect(result.someArray[0].someNewKey).to.equal('newValue')
            expect(original.someArray[0].someNewKey).to.equal(undefined)
        })

        it('changes a property for an existing item', () => {
            const result = theImmutable.arrayMergeItem('someArray', {someItemKey: '1'}, {someItemKey: 'replacedValue'}).value()
            expect(result.someArray[0].someItemKey).to.equal('replacedValue')
            expect(original.someArray[0].someItemKey).to.equal('1')
        })

        it('does not change anything if the item is not found', () => {
            const result = theImmutable.arrayMergeItem('someArray', {someItemKey: 'notExistingValue'}, {someItemKey: 'replacedValue'}).value()
            expect(result.someArray.length).to.equal(3)
            result.someArray.forEach((item, index) => {
                expect(item).to.equal(original.someArray[index])
            })
        })

        it('matches an item with a function predicate', () => {
            const result = theImmutable.arrayMergeItem('someArray', item => item.someItemKey === '1', {someItemKey: 'replacedValue'}).value()
            expect(result.someArray[0].someItemKey).to.equal('replacedValue')
        })

        it('changes the array reference', () => {
            const result = theImmutable.arrayMergeItem('someArray', {someItemKey: '1'}, {someItemKey: 'replacedValue'}).value()
            expect(result.someArray === original.someArray).to.equal.false
        })

        it('does not change anything if the array does not exist', () => {
            const result = theImmutable.arrayMergeItem('nonExistingArray', {someItemKey: '1'}, {someNewKey: '4'}).value()
            original.someArray.forEach((item, index) => {
                expect(item).to.equal(result.someArray[index])
            })
        })
    })

    describe('arrayPushItem', () => {
        it('adds a new item to the array', () => {
            const result = theImmutable.arrayPushItem('someArray', {someItemKey: '4'}).value()
            expect(result.someArray.length).to.equal(4)
        })

        it('adds a new item to an empty array', () => {
            original.someArray = []
            theImmutable = immutable(original)
            const result = theImmutable.arrayPushItem('someArray', {someItemKey: '4'}).value()
            expect(result.someArray.length).to.equal(1)
            expect(result.someArray[0].someItemKey).to.equal('4')
        })

        it('changes the array reference', () => {
            const result = theImmutable.arrayPushItem('someArray', {someItemKey: '4'}).value()
            expect(result.someArray === original.someArray).to.equal.false
        })

        it('does not change anything if the array does not exist', () => {
            const result = theImmutable.arrayPushItem('nonExistingArray', {someNewKey: '4'}).value()
            original.someArray.forEach((item, index) => {
                expect(item).to.equal(result.someArray[index])
            })
        })
    })

    describe('arraySetItem', () => {
        it('replaces the whole item if it exists in the array', () => {
            const result = theImmutable.arraySetItem('someArray', {someItemKey: '1'}, {someNewKey: 'newValue'}).value()
            expect(result.someArray[0].someItemKey).to.equal(undefined)
            expect(result.someArray[0].someNewKey).to.equal('newValue')
            expect(original.someArray[0].someItemKey).to.equal('1')
            expect(original.someArray[0].someNewKey).to.equal(undefined)
        })

        it('does not change anything if the item is not found', () => {
            const result = theImmutable.arraySetItem('someArray', {someItemKey: 'notExistingValue'}, {someNewKey: 'newValue'}).value()
            expect(result.someArray.length).to.equal(3)
            result.someArray.forEach((item, index) => {
                expect(item).to.equal(original.someArray[index])
            })
        })

        it('matches an item with a function predicate', () => {
            const result = theImmutable.arraySetItem('someArray', item => item.someItemKey === '1', {someNewKey: 'replacedValue'}).value()
            expect(result.someArray[0].someItemKey).to.equal(undefined)
            expect(result.someArray[0].someNewKey).to.equal('replacedValue')
        })

        it('changes the array reference', () => {
            const result = theImmutable.arraySetItem('someArray', {someItemKey: '1'}, {someNewKey: 'newValue'}).value()
            expect(result.someArray === original.someArray).to.equal.false
        })

        it('does not change anything if the array does not exist', () => {
            const result = theImmutable.arraySetItem('nonExistingArray', {someItemKey: '1'}, {someNewKey: 'newValue'}).value()
            original.someArray.forEach((item, index) => {
                expect(item).to.equal(result.someArray[index])
            })
        })
    })

    describe('arraySetOrPushItem', () => {
        it('replaces the whole item if it exists in the array', () => {
            const result = theImmutable.arraySetOrPushItem('someArray', {someItemKey: '1'}, {someNewKey: 'newValue'}).value()
            expect(result.someArray[0].someItemKey).to.equal(undefined)
            expect(result.someArray[0].someNewKey).to.equal('newValue')
            expect(original.someArray[0].someItemKey).to.equal('1')
            expect(original.someArray[0].someNewKey).to.equal(undefined)
        })

        it('adds a new item to the array, if no item is found', () => {
            const result = theImmutable.arraySetOrPushItem('someArray', {someItemKey: 'notExistingValue'}, {someNewKey: 'newValue'}).value()
            expect(result.someArray.length).to.equal(4)
            expect(result.someArray[3].someNewKey).to.equal('newValue')
            original.someArray.forEach((item, index) => {
                expect(item).to.equal(result.someArray[index])
            })
        })

        it('matches an item with a function predicate', () => {
            const result = theImmutable.arraySetOrPushItem('someArray', item => item.someItemKey === '1', {someNewKey: 'newValue'}).value()
            expect(result.someArray[0].someItemKey).to.equal(undefined)
            expect(result.someArray[0].someNewKey).to.equal('newValue')
        })

        it('changes the array reference', () => {
            const result = theImmutable.arraySetOrPushItem('someArray', {someItemKey: '1'}, {someNewKey: 'newValue'}).value()
            expect(result.someArray === original.someArray).to.equal.false
        })

        it('does not change anything if the array does not exist', () => {
            const result = theImmutable.arraySetOrPushItem('nonExistingArray', {someItemKey: '1'}, {someNewKey: 'newValue'}).value()
            original.someArray.forEach((item, index) => {
                expect(item).to.equal(result.someArray[index])
            })
        })
    })

    describe('arraySetAll', () => {
        it('sets new items to all of the array', () => {
            const result = theImmutable.arraySetAll('someArray', {someNewKey: 'newValue'}).value()
            expect(result.someArray.length).to.equal(3)
            result.someArray.forEach(item => {
                expect(item.someNewKey).to.equal('newValue')
                expect(item.someItemKey).to.equal(undefined)
            })
        })

        it('changes the array reference', () => {
            const result = theImmutable.arraySetAll('someArray', {someNewKey: 'newValue'}).value()
            expect(result.someArray === original.someArray).to.equal.false
        })

        it('does not change anything if the array does not exist', () => {
            const result = theImmutable.arraySetAll('nonExistingArray', {someNewKey: 'newValue'}).value()
            original.someArray.forEach((item, index) => {
                expect(item).to.equal(result.someArray[index])
            })
        })
    })

    describe('merge', () => {
        it('changes only part of an existing object', () => {
            const result = theImmutable.merge('someObj', {someNewKey: 'newValue'}).value()
            expect(result.someObj.someKey).to.equal('a')
            expect(result.someObj.someNewKey).to.equal('newValue')
            expect(original.someObj.someNewKey).to.equal(undefined)
        })

        it('does not change anything of path does not exist', () => {
            const result = theImmutable.merge('nonExistingObj', {someNewKey: 'newValue'}).value()
            expect(result.nonExistingObject).to.equal(undefined)

        })
    })
})
