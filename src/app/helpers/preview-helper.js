const {chain} = require('lodash/core')
const orderBy = require('lodash/orderBy')

const isAfter = require('date-fns/is_after')
const isBefore = require('date-fns/is_before')
const addWeeks = require('date-fns/add_weeks')
const isToday = require('date-fns/is_today')
const isYesterday = require('date-fns/is_yesterday')

const {PreviewDateGroups} = require('../constants')

function groupByDate(aggregatedPreviews, buildNotificationFund) {
    const sortedPreviews = orderBy(aggregatedPreviews, 'createdAt', 'desc')

    return {
        [PreviewDateGroups.TODAY]: getTodayItems(sortedPreviews, buildNotificationFund),
        [PreviewDateGroups.YESTERDAY]: getYesterdayItems(sortedPreviews, buildNotificationFund),
        [PreviewDateGroups.LAST_WEEK]: getLastWeekItems(sortedPreviews, buildNotificationFund),
        [PreviewDateGroups.OLDER]: getRestOfItems(sortedPreviews, buildNotificationFund)
    }
}

function getTodayItems(previews, buildPreviewItemFunc) {
    return chain(previews)
        .filter(preview => isToday(preview.createdAt))
        .map(buildPreviewItemFunc)
        .value()
}

function getYesterdayItems(previews, buildPreviewItemFunc) {
    return chain(previews)
        .filter(preview => isYesterday(preview.createdAt))
        .map(buildPreviewItemFunc)
        .value()
}

function getLastWeekItems(previews, buildPreviewItemFunc) {
    return chain(previews)
        .filter(preview =>
        isAfter(preview.createdAt, addWeeks(new Date(), -1)) && !isToday(preview.createdAt) && !isYesterday(preview.createdAt))
        .map(buildPreviewItemFunc)
        .value()
}

function getRestOfItems(previews, buildPreviewItemFunc) {
    return chain(previews)
        .filter(preview => isBefore(preview.createdAt, addWeeks(new Date(), -1)))
        .map(buildPreviewItemFunc)
        .value()
}

module.exports = {
    groupByDate
}