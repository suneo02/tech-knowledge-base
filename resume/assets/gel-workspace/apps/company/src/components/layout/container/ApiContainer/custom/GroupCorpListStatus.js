export const handleUniApi = (list, api, total) => {
	try {
		const percent = (num, total) =>
			num ? `${(((num || 0) / total) * 100).toFixed(2)}%` : '--';
		if (!api.includes('groupCompanyAgg')) {
			return list;
		}
		const loop = (loopData) => {
			if (!Array.isArray(loopData)) {
				return [];
			}
			let totalComputed;
			if (total) {
				totalComputed = total;
			} else {
				totalComputed = loopData.reduce(
					(cur, pre) => cur + (Number(pre?.doc_count) || 0),
					0
				);
			}
			return loopData.map((res) => ({
				...res,
				percent: percent(res.doc_count, totalComputed),
				...(res.children ? { children: loop(res.children) } : {}),
			}));
		};
		return loop(list);
	} catch (e) {
		console.error(e);
		return list;
	}
};
