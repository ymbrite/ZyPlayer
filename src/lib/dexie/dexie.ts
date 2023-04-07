import Dexie from 'dexie'
import { sites, iptv, setting, channelList, analyze, history, analyzeHistory } from './initData'

interface DexieDatabase extends Dexie {
  setting: Dexie.Table<Setting, number>;
  star: Dexie.Table<Star, number>;
  sites: Dexie.Table<Site, number>;
  history: Dexie.Table<History, number>;
  iptv: Dexie.Table<Iptv, number>;
  channelList: Dexie.Table<ChannelList, number>;
  analyze: Dexie.Table<Analyze, number>;
  analyzeHistory: Dexie.Table<AnalyzeHistory, number>;
}

const db = new Dexie('zy') as DexieDatabase

db.version(4).stores({
  setting: 'id, theme, externalPlayer, rootClassFilter, r18ClassFilter, defaultHot, defaultSearch, defaultCheckModel, defaultChangeModel, defaultIptvEpg, iptvSkipIpv6, iptvThumbnail, restoreWindowPositionAndSize, pauseWhenMinimize, defaultSite, defaultIptv, defaultAnalyze, analyzeSupport, softSolution, skipStartEnd, agreementMask, recordShortcut, selfBoot, hardwareAcceleration, doh',
  star: '++id, [siteKey+videoId], siteKey, videoId, videoImage, videoName, videoType, videoUpdate',
  sites: '++id, key, name, api, download, jiexiUrl, type, isActive, group',
  history: '++id, [siteKey+videoId], date, siteKey, siteSource, duration, playType, playEnd, videoId, videoImage, videoName, videoIndex, watchTime',
  iptv: '++id, name, url, epg, isActive',
  channelList: '++id, name, logo, url, group',
  analyze: '++id, name, url, isActive',
  analyzeHistory: '++id, [analyzeId+videoUrl], date, analyzeId, videoUrl, videoName',
})

// 开发和稳定版同一版本号会有不同的数据库
// 参考https://github.com/dfahlander/Dexie.js/releases/tag/v3.0.0-alpha.3  upgrade可以改变主键和表名了
// https://dexie.org/docs/Version/Version.stores()
// https://dexie.org/docs/Version/Version.upgrade()
// https://ahuigo.github.io/b/ria/js-indexedDB#/  比较旧，适当参考

db.version(15).stores({
  star: '++id, [siteKey+videoId], siteKey, videoId, videoImage, videoName, videoType, videoUpdate', 
}).upgrade(trans => {
  trans.star.toCollection().modify(star => {
    star.videoUpdate = false
  })
})

db.on('populate', () => {
  db.setting.bulkAdd(setting)
  db.sites.bulkAdd(sites)
  db.iptv.bulkAdd(iptv)
  db.channelList.bulkAdd(channelList)
  db.analyze.bulkAdd(analyze)
  db.history.bulkAdd(history)
  db.analyzeHistory.bulkAdd(analyzeHistory)
})

db.open()

export default db
