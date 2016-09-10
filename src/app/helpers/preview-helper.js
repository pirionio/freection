import {chain} from 'lodash/core'
import orderBy from 'lodash/orderBy'
import isAfter from 'date-fns/is_after'
import isBefore from 'date-fns/is_before'
import addWeeks from 'date-fns/add_weeks'
import isToday from 'date-fns/is_today'
import isYesterday from 'date-fns/is_yesterday'

import {PreviewDateGroups} from '../constants'

export function groupByDate(aggregatedPreviews, buildNotificationFund) {
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