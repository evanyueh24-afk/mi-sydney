// UI chrome strings only (nav labels, buttons, headers). Full *content*
// translation (spot descriptions etc.) is Phase 2 per spec §5.

export type Lang = "en" | "zh";

export const dictionary = {
  // brand
  "brand.tagline": { en: "Sydney Discovery", zh: "悉尼探索" },

  // bottom nav
  "nav.discover": { en: "Discover", zh: "发现" },
  "nav.nearby": { en: "Nearby", zh: "附近" },
  "nav.search": { en: "Search", zh: "搜索" },
  "nav.saved": { en: "Saved", zh: "收藏" },
  "nav.profile": { en: "Profile", zh: "我的" },

  // categories
  "cat.all": { en: "All", zh: "全部" },
  "cat.food": { en: "Food", zh: "美食" },
  "cat.attractions": { en: "Attractions", zh: "景点" },
  "cat.recreation": { en: "Recreation", zh: "玩乐" },
  "cat.shopping": { en: "Shopping", zh: "购物" },
  "cat.services": { en: "Services", zh: "服务" },

  // discover
  "discover.trending": { en: "Trending now", zh: "热门" },
  "discover.collections": { en: "Editorial collections", zh: "精选合集" },
  "discover.seeAll": { en: "See all", zh: "查看全部" },

  // search / filters
  "search.placeholder": { en: "Search spots, areas, tags…", zh: "搜索地点、区域、标签…" },
  "search.filters": { en: "Filters", zh: "筛选" },
  "search.category": { en: "Category", zh: "分类" },
  "search.price": { en: "Price", zh: "价格" },
  "search.minRating": { en: "Min rating", zh: "最低评分" },
  "search.openNow": { en: "Open now", zh: "营业中" },
  "search.apply": { en: "Apply", zh: "应用" },
  "search.clear": { en: "Clear", zh: "清除" },
  "search.results": { en: "results", zh: "个结果" },
  "search.noResults": { en: "No spots match your filters.", zh: "没有符合条件的地点。" },
  "search.any": { en: "Any", zh: "不限" },

  // browse
  "browse.title": { en: "Browse all categories", zh: "分类浏览" },

  // nearby
  "nearby.title": { en: "Nearby", zh: "附近" },
  "nearby.subtitle": { en: "Sorted by distance from you", zh: "按距离排序" },
  "nearby.enable": { en: "Enable location", zh: "开启定位" },
  "nearby.locating": { en: "Finding your location…", zh: "正在定位…" },
  "nearby.denied": {
    en: "Location access was denied. Enable it in your browser to sort by distance.",
    zh: "定位被拒绝。请在浏览器中开启定位以按距离排序。",
  },
  "nearby.away": { en: "away", zh: "距离" },

  // spot detail
  "spot.reviews": { en: "Reviews", zh: "点评" },
  "spot.writeReview": { en: "Write a review", zh: "写点评" },
  "spot.noReviews": { en: "No reviews yet — be the first to share your take.", zh: "还没有点评——来做第一个吧。" },
  "spot.hours": { en: "Hours", zh: "营业时间" },
  "spot.open": { en: "Open", zh: "营业中" },
  "spot.closed": { en: "Closed", zh: "已打烊" },
  "spot.website": { en: "Website", zh: "网站" },
  "spot.call": { en: "Call", zh: "电话" },
  "spot.directions": { en: "Directions", zh: "导航" },

  // review modal
  "review.title": { en: "Write a review", zh: "写点评" },
  "review.yourRating": { en: "Your rating", zh: "你的评分" },
  "review.text": { en: "Review", zh: "点评内容" },
  "review.textPlaceholder": { en: "What was it like?", zh: "体验如何？" },
  "review.photo": { en: "Add a photo (optional)", zh: "添加照片（可选）" },
  "review.submit": { en: "Post review", zh: "发布点评" },
  "review.cancel": { en: "Cancel", zh: "取消" },
  "review.posted": { en: "Review posted", zh: "点评已发布" },
  "review.needStars": { en: "Pick a star rating first", zh: "请先选择星级" },
  "review.needText": { en: "Write a few words first", zh: "请先写几句" },
  "review.signInFirst": { en: "Sign in to post a review", zh: "登录后才能发布点评" },

  // favorites
  "fav.saved": { en: "Saved", zh: "已收藏" },
  "fav.removed": { en: "Removed from saved", zh: "已取消收藏" },
  "saved.title": { en: "Your saved spots", zh: "我的收藏" },
  "saved.empty": {
    en: "No saved spots yet. Tap the ♡ on any spot to save it here.",
    zh: "还没有收藏。点击任意地点的 ♡ 即可收藏。",
  },
  "saved.signInFirst": { en: "Sign in to save spots.", zh: "登录后即可收藏地点。" },

  // profile
  "profile.member": { en: "觅 Mì member", zh: "觅 Mì 会员" },
  "profile.saved": { en: "Saved", zh: "收藏" },
  "profile.reviews": { en: "Reviews", zh: "点评" },
  "profile.displayName": { en: "Display name", zh: "昵称" },
  "profile.save": { en: "Save changes", zh: "保存" },
  "profile.saved_toast": { en: "Profile updated", zh: "资料已更新" },
  "profile.language": { en: "Language", zh: "语言" },
  "profile.signOut": { en: "Sign out", zh: "退出登录" },
  "profile.myReviews": { en: "My reviews", zh: "我的点评" },

  // auth
  "auth.signIn": { en: "Sign in", zh: "登录" },
  "auth.signUp": { en: "Sign up", zh: "注册" },
  "auth.email": { en: "Email", zh: "邮箱" },
  "auth.password": { en: "Password", zh: "密码" },
  "auth.displayName": { en: "Display name", zh: "昵称" },
  "auth.continueGoogle": { en: "Continue with Google", zh: "使用 Google 登录" },
  "auth.or": { en: "or", zh: "或" },
  "auth.needAccount": { en: "Need an account? Sign up", zh: "还没有账号？注册" },
  "auth.haveAccount": { en: "Have an account? Sign in", zh: "已有账号？登录" },
  "auth.checkEmail": {
    en: "Check your email to confirm your account.",
    zh: "请查收邮件以确认账号。",
  },
  "auth.welcome": { en: "Find your next spot in Sydney", zh: "发现你的下一个悉尼好去处" },
  "auth.skip": { en: "Browse without signing in", zh: "先随便逛逛" },

  // generic
  "common.free": { en: "Free", zh: "免费" },
  "common.back": { en: "Back", zh: "返回" },
  "common.loading": { en: "Loading…", zh: "加载中…" },
  "common.retry": { en: "Retry", zh: "重试" },
} as const;

export type DictKey = keyof typeof dictionary;

export function translate(key: DictKey, lang: Lang): string {
  const entry = dictionary[key];
  return entry ? entry[lang] : key;
}
