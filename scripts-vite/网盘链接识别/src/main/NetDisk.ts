import { NetDiskGlobalData } from "./data/NetDiskGlobalData";
import { log, utils } from "@/env";
import Qmsg from "qmsg";
import { UtilsDictionary } from "@whitesev/utils/dist/types/src/Dictionary";
import { NetDiskUI } from "./ui/NetDiskUI";
import { NetDiskRuleUtils } from "./rule/NetDiskRuleUtils";
import { NetDiskRuleConfig, type NetDiskRuleSetting } from "./rule/NetDiskRule";

export const NetDisk = {
	$flag: {},
	/**
	 * 链接字典，识别规则->识别到的访问码|分享码|下标
	 */
	linkDict: new utils.Dictionary<
		string,
		UtilsDictionary<string, NetDiskDictData>
	>(),
	/**
	 * （临时）链接字典
	 */
	tempLinkDict: new utils.Dictionary<
		string,
		UtilsDictionary<string, NetiDiskHandleObject>
	>(),
	/**
	 * 用于存储已匹配到的网盘规则名
	 * 只有单独的名
	 */
	matchLink: new Set<string>(),
	/**
	 * 是否成功匹配到链接
	 */
	hasMatchLink: false,
	/**
	 * 剪贴板内容
	 */
	clipboardText: "",
	/**
	 * 使用该正则判断提取到的shareCode是否正确
	 */
	shareCodeNotMatchRegexpList: [
		/(vipstyle|notexist|ajax|file|download|ptqrshow|xy-privacy|comp|web|undefined|1125|unproved|console|account|favicon|setc)/g,
	],
	/**
	 * 使用该正则判断提取到的accessCode是否正确
	 */
	accessCodeNotMatchRegexpList: [/^(font)/gi],
	/**
	 * 当没有accessCode时，使用该正则去除不需要的字符串
	 */
	noAccessCodeRegExp:
		/( |提取码:|\n密码：{#accessCode#}|{#accessCode#}|{#encodeURI-accessCode#}|{#encodeURIComponent-accessCode#}|{#decodeURI-accessCode#}|{#encodeURIComponent-accessCode#}|\?pwd=|&pwd=)/gi,
	/** 各个网盘规则的匹配规则 */
	matchRule: {} as NetDiskMatchRule,
	/** 各个网盘规则的设置项 */
	ruleSetting: {} as {
		[key: string]: NetDiskRuleSetting;
	},
	/** 各个网盘规则 */
	rule: [] as NetDiskRuleConfig[],
	/**
	 * 初始化
	 */
	init() {
		this.initLinkDict();
	},
	/**
	 * 初始化字典
	 */
	initLinkDict() {
		Object.keys(this.matchRule).forEach((netDiskName) => {
			this.linkDict.set(netDiskName, new utils.Dictionary());
			this.tempLinkDict.set(netDiskName, new utils.Dictionary());
		});
	},
	/**
	 * 处理链接，将匹配到的链接转为参数和密码存入字典中
	 * @param netDiskName 网盘名称
	 * @param netDiskIndex 网盘名称的索引下标
	 * @param matchText 正在进行匹配的文本
	 */
	handleLink(netDiskName: string, netDiskIndex: number, matchText: string) {
		let shareCode = this.handleShareCode(netDiskName, netDiskIndex, matchText);
		if (utils.isNull(shareCode)) {
			return;
		}
		let accessCode = this.handleAccessCode(
			netDiskName,
			netDiskIndex,
			matchText
		);
		accessCode = this.handleAccessCodeByUserRule(
			netDiskName,
			accessCode,
			matchText
		);
		return {
			shareCode: shareCode,
			accessCode: accessCode,
		};
	},
	/**
	 * 对传入的url进行处理，返回shareCode
	 * @param netDiskName 网盘名称
	 * @param netDiskIndex 网盘名称索引下标
	 * @param matchText 正在进行匹配的文本
	 */
	handleShareCode(
		netDiskName: string,
		netDiskIndex: number,
		matchText: string
	) {
		/* 当前执行的规则 */
		let netDiskMatchRegular = NetDisk.matchRule[netDiskName][netDiskIndex];
		let shareCodeMatch = matchText
			.match(netDiskMatchRegular.shareCode)
			?.filter((item) => utils.isNotNull(item));
		if (utils.isNull(shareCodeMatch)) {
			log.error([
				`匹配shareCode为空`,
				{
					匹配的文本: matchText,
					规则: netDiskMatchRegular,
					正在使用的规则: netDiskMatchRegular.shareCode,
					网盘名称: netDiskName,
					网盘名称索引下标: netDiskIndex,
				},
			]);
			return;
		}
		/* 匹配到的网盘链接，取第一个值就行 */
		let shareCode = shareCodeMatch[0];
		if (netDiskMatchRegular.shareCodeNeedRemoveStr) {
			/* 删除ShareCode前面不需要的字符串 */
			shareCode = shareCode.replace(
				netDiskMatchRegular.shareCodeNeedRemoveStr,
				""
			);
		}
		let shareCodeNotMatch = netDiskMatchRegular.shareCodeNotMatch;
		if (shareCodeNotMatch != void 0 && shareCode.match(shareCodeNotMatch)) {
			log.error(`不可能的shareCode => ${shareCode}`);
			return;
		}
		for (const shareCodeNotMatchRegexp of NetDisk.shareCodeNotMatchRegexpList) {
			if (shareCode.match(shareCodeNotMatchRegexp)) {
				log.error(`不可能的shareCode => ${shareCode}`);
				return;
			}
		}
		/* %E7%BD%91%E7%9B%98 => 网盘 */
		shareCode = decodeURI(shareCode);
		if (
			NetDiskGlobalData.aboutShareCode.excludeIdenticalSharedCodes.value &&
			utils.isSameChars(
				shareCode,
				NetDiskGlobalData.aboutShareCode.excludeIdenticalSharedCodesCoefficient
					.value
			)
		) {
			/* 排除掉由相同字符组成的分享码 */
			return;
		}
		/* 排除掉以http|https结尾的分享码 */
		if (shareCode.endsWith("http") || shareCode.endsWith("https")) {
			return;
		}
		return shareCode;
	},
	/**
	 * 对传入的url进行处理，返回accessCode
	 * @param netDiskName 网盘名称
	 * @param netDiskIndex 网盘名称索引下标
	 * @param matchText 正在进行匹配的文本
	 * @returns "xxxx" || ""
	 */
	handleAccessCode(
		netDiskName: string,
		netDiskIndex: number,
		matchText: string
	): string {
		/* 当前执行正则匹配的规则 */
		let netDiskMatchRegular = this.matchRule[netDiskName][netDiskIndex];
		let accessCode = "";
		if (!netDiskMatchRegular.checkAccessCode) {
			/* 不存在匹配提取码的正则 */
			return "";
		}
		let accessCodeMatch = matchText.match(netDiskMatchRegular.checkAccessCode);
		if (accessCodeMatch) {
			/* 匹配出带提取码的字符串 */
			let accessCodeMatchValue = accessCodeMatch[accessCodeMatch.length - 1];
			/* 进去提取码匹配，且过滤掉null或undefined或空字符串 */
			let accessCodeMatchArray = accessCodeMatchValue
				.match(netDiskMatchRegular.accessCode)
				?.filter((item) => utils.isNotNull(item));
			if (utils.isNull(accessCodeMatchArray)) {
				return "";
			}
			if (accessCodeMatchArray.length) {
				/* 取第一个值 */
				/**
				 * 例如，匹配到的字符串是密码：oanm   大于150m
				 * 如果是最后一个，那么会匹配到150m
				 */
				accessCode = accessCodeMatchArray[0];
				if (accessCode.startsWith("http")) {
					/* 排除不可能的accessCode */
					accessCode = "";
				}
			}
		}
		if (utils.isNotNull(accessCode)) {
			for (const accessCodeNotMatchRegexp of NetDisk.accessCodeNotMatchRegexpList) {
				if (accessCode.match(accessCodeNotMatchRegexp)) {
					accessCode = "";
					break;
				}
			}
			if (
				netDiskMatchRegular.acceesCodeNotMatch &&
				accessCode.match(netDiskMatchRegular.acceesCodeNotMatch)
			) {
				accessCode = "";
			}
		}
		return accessCode;
	},
	/**
	 * 对accessCode二次处理，使用自定义的访问码规则
	 * @param netDiskName 网盘名称
	 * @param accessCode 访问码
	 * @param matchText 匹配到的文本
	 */
	handleAccessCodeByUserRule(
		netDiskName: string,
		accessCode: string,
		matchText: string
	): string {
		let regularList = NetDiskUI.accessCodeRule.getValue();
		let result = accessCode;
		let currentUrl = window.location.href;
		/* 先遍历本地的自定义的访问码规则 */
		for (
			let regularIndex = 0;
			regularIndex < regularList.length;
			regularIndex++
		) {
			let rule = regularList[regularIndex];
			let urlRegexp = new RegExp(rule.urlRegexp, "i");
			/* 如果网址匹配成功则进行下一步 */
			if (!currentUrl.match(urlRegexp)) {
				continue;
			}
			/* 循环遍历自定义的访问码规则的网盘信息 */
			for (let index = 0; index < rule.netdisk.length; index++) {
				let netDiskRegular = rule.netdisk[index];
				/* 自定义规则的value(也就是网盘的字母名)和参数netDiskName相同，则直接返回设定的值 */
				if (netDiskRegular.value === netDiskName) {
					log.success(`使用自定义规则中的提取码 ${netDiskName} ${result}`);
					return rule.accessCode;
				}
			}
		}
		/* 不存在 */
		return result;
	},
	/**
	 * 获取在弹窗中显示出的链接
	 * @param netDiskName 网盘名称，指NetDisk.regular的内部键名
	 * @param netDiskIndex 网盘名称索引下标
	 * @param shareCode 分享码
	 * @param accessCode 访问码
	 * @param matchText 匹配到的文本
	 */
	handleLinkShow(
		netDiskName: string,
		netDiskIndex: number,
		shareCode: string,
		accessCode: string,
		matchText?: string
	) {
		let netDiskMatchRegular = NetDisk.matchRule[netDiskName][netDiskIndex];
		if (netDiskMatchRegular == void 0) {
			Qmsg.error("BUG: 获取uiLink规则失败");
			log.error([
				"BUG: 分析参数",
				netDiskName,
				netDiskIndex,
				shareCode,
				accessCode,
			]);
			throw new TypeError("获取uiLink规则失败");
		}
		let uiLink = NetDiskRuleUtils.replaceParam(
			netDiskMatchRegular["uiLinkShow"],
			{
				shareCode: shareCode,
			}
		);
		if (accessCode && accessCode != "") {
			uiLink = NetDiskRuleUtils.replaceParam(uiLink, {
				accessCode: accessCode,
			});
		} else {
			uiLink = uiLink.replace(NetDisk.noAccessCodeRegExp, "");
		}
		if (netDiskMatchRegular.paramMatch) {
			/**
			 * 当前字典
			 */
			let currentDict = NetDisk.linkDict.get(netDiskName).get(shareCode);
			matchText = matchText ?? currentDict?.matchText;
			if (utils.isNotNull(matchText)) {
				let paramMatchArray = matchText.match(netDiskMatchRegular.paramMatch);
				let replaceParamData: {
					[key: string]: string;
				} = {};
				if (paramMatchArray) {
					for (let index = 0; index < paramMatchArray.length; index++) {
						// $1,$2,$3....
						replaceParamData[`$${index}`] = paramMatchArray[index];
					}
				}
				uiLink = NetDiskRuleUtils.replaceParam(uiLink, replaceParamData);
			}
		}
		return uiLink;
	},
	/**
	 * 获取已匹配到的链接的存储的对象
	 * @param accessCode 访问码
	 * @param netDiskIndex 下标，默认0
	 * @param isForceAccessCode 是否锁定访问码不允许修改，默认false
	 * @param matchText 匹配到的文本
	 */
	getLinkDickObj(
		accessCode: string,
		netDiskIndex: number = 0,
		isForceAccessCode: boolean = false,
		matchText: string
	) {
		return {
			accessCode: accessCode,
			netDiskIndex: netDiskIndex,
			isForceAccessCode: isForceAccessCode,
			matchText: matchText,
		};
	},
};
