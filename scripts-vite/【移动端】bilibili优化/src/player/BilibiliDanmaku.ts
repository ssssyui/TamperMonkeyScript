import { PopsPanel } from "@/setting/setting";
import { addStyle, log, utils } from "@/env";
import { BilibiliDanmakuFilter } from "./BilibiliDanmakuFilter";
import { BilibiliPlayer } from "./BilibiliPlayer";

/** 弹幕库 */
export const BilibiliDanmaku = {
	/** 弹幕字体 */
	fontFamily: [
		{
			text: "黑体",
			value: "SimHei, 'Microsoft JhengHei'",
		},
		{
			text: "宋体",
			value: "SimSun",
		},
		{
			text: "新宋体",
			value: "NSimSun",
		},
		{
			text: "仿宋",
			value: "FangSong",
		},
		{
			text: "微软雅黑",
			value: "'Microsoft YaHei'",
		},
		{
			text: "微软雅黑 Light",
			value: "'Microsoft Yahei UI Light'",
		},
		{
			text: "Noto Sans DemiLight",
			value: "'Noto Sans CJK SC DemiLight'",
		},
		{
			text: "'Noto Sans CJK SC Regular'",
			value: "'Noto Sans CJK SC Regular'",
		},
	],
	/** 初始化 */
	init() {
		BilibiliDanmakuFilter.init();

		let opacity = PopsPanel.getValue<number>("bili-danmaku-opacity");
		let area = PopsPanel.getValue<number>("bili-danmaku-area");
		let fontSize = PopsPanel.getValue<number>("bili-danmaku-fontSize");
		let duration = PopsPanel.getValue<number>("bili-danmaku-duration");
		let bold = PopsPanel.getValue<boolean>("bili-danmaku-bold");
		let fullScreenSync = PopsPanel.getValue<boolean>(
			"bili-danmaku-fullScreenSync"
		);
		let speedSync = PopsPanel.getValue<boolean>("bili-danmaku-speedSync");
		let fontFamily = PopsPanel.getValue<string>("bili-danmaku-fontFamily");

		PopsPanel.execMenuOnce(
			"bili-danmaku-container-top",
			(value) => {
				return this.setContainerTop(value);
			},
			void 0,
			void 0,
			() => true
		);

		this.setOpacity(opacity);
		this.setArea(area);
		this.setFontSize(fontSize);
		this.setDuration(duration);
		this.setBold(bold);
		this.setFullScreenSync(fullScreenSync);
		this.setSpeedSync(speedSync);
		this.setFontFamily(fontFamily);
	},
	async DanmakuCoreConfig() {
		let playerPromise = await BilibiliPlayer.$player.playerPromise();
		await utils.waitPropertyByInterval(
			async () => {
				playerPromise = await BilibiliPlayer.$player.playerPromise();
				return playerPromise;
			},
			() => {
				return (
					typeof playerPromise?.danmaku?.danmakuCore?.config === "object" &&
					playerPromise?.danmaku?.danmakuCore?.config != null
				);
			},
			250,
			10000
		);
		return playerPromise.danmaku.danmakuCore.config;
	},
	/**
	 * 设置弹幕容器距离顶部的距离
	 * @param topPx
	 */
	setContainerTop(topPx: string | number) {
		let containerTopPx = parseInt(topPx.toString());
		if (isNaN(containerTopPx)) {
			return;
		}
		log.success(`设置弹幕容器距离顶部的距离: ${topPx}`);
		return addStyle(/*css*/ `
		.mplayer-danmaku-container{
			top: ${containerTopPx}px !important;
		}
		`);
	},
	/**
	 * 设置 不透明度
	 * @param value
	 */
	setOpacity(value: number) {
		this.DanmakuCoreConfig().then((config) => {
			if ("opacity" in config) {
				config.opacity = value;
				log.success(`设置-弹幕不透明度: ${value}`);
			} else {
				log.error("设置-弹幕不透明度失败, 不存在 opacity 属性");
			}
		});
	},
	/**
	 * 设置 显示区域
	 * @param value
	 */
	setArea(value: number) {
		let areaMapping = {
			25: "1/4屏",
			50: "半屏",
			75: "3/4屏",
			100: "全屏",
		} as {
			[key: string]: string;
		};
		this.DanmakuCoreConfig().then((config) => {
			if ("danmakuArea" in config) {
				config.danmakuArea = value;
				log.success(`设置-显示区域: ${value} => ${areaMapping[value]}`);
			} else {
				log.error("设置-显示区域失败, 不存在 danmakuArea 属性");
			}
		});
	},
	/**
	 * 设置 字体大小
	 * @param value
	 */
	setFontSize(value: number) {
		this.DanmakuCoreConfig().then((config) => {
			if ("fontSize" in config) {
				config.fontSize = value;
				log.success(`设置-字体大小: ${value}`);
			} else {
				log.error("设置-字体大小失败, 不存在 fontSize 属性");
			}
		});
	},
	/**
	 * 设置 持续时间（弹幕速度）
	 * @param value
	 */
	setDuration(value: number) {
		this.DanmakuCoreConfig().then((config) => {
			if ("duration" in config) {
				config.duration = value;
				log.success(`设置-持续时间（弹幕速度）: ${value}`);
			} else {
				log.error("设置-持续时间（弹幕速度）失败, 不存在 duration 属性");
			}
		});
	},
	/**
	 * 设置 粗体
	 * @param value
	 */
	setBold(value: boolean) {
		this.DanmakuCoreConfig().then((config) => {
			if ("bold" in config) {
				config.bold = value;
				log.success(`设置-粗体: ${value}`);
			} else {
				log.error("设置-粗体失败, 不存在 bold 属性");
			}
		});
	},
	/**
	 * 弹幕随屏幕缩放
	 * @param value
	 */
	setFullScreenSync(value: boolean) {
		this.DanmakuCoreConfig().then((config) => {
			if ("fullScreenSync" in config) {
				config.fullScreenSync = value;
				log.success(`设置-弹幕随屏幕缩放: ${value}`);
			} else {
				log.error("设置-弹幕随屏幕缩放失败, 不存在 fullScreenSync 属性");
			}
		});
	},
	/**
	 * 弹幕字体
	 * @param value
	 */
	setFontFamily(value: string) {
		this.DanmakuCoreConfig().then((config) => {
			if ("fontFamily" in config) {
				config.fontFamily = value;
				log.success(`设置-弹幕字体: ${value}`);
			} else {
				log.error("设置-弹幕字体失败, 不存在 fontFamily 属性");
			}
		});
	},
	/**
	 * 弹幕速度同步播放倍数
	 * @param value
	 */
	setSpeedSync(value: boolean) {
		this.DanmakuCoreConfig().then(async (config) => {
			let playerPromise = await BilibiliPlayer.$player.playerPromise();
			await utils.waitPropertyByInterval(
				async () => {
					playerPromise = await BilibiliPlayer.$player.playerPromise();
					return playerPromise;
				},
				() => {
					return (
						typeof playerPromise.video === "object" &&
						playerPromise.video != null &&
						playerPromise.video instanceof HTMLVideoElement
					);
				},
				250,
				10000
			);
			let videoSpeed = playerPromise.video.playbackRate;
			if ("videoSpeed" in config) {
				config.videoSpeed = videoSpeed;
				log.success(`设置-当前视频播放倍速: ${videoSpeed}`);
			} else {
				log.error("设置-弹幕速度同步播放倍数失败, 不存在 videoSpeed 属性");
			}
			if ("speedSync" in config) {
				config.speedSync = value;
				log.success(`设置-弹幕速度同步播放倍数: ${value}`);
			} else {
				log.error("设置-弹幕速度同步播放倍数失败, 不存在 speedSync 属性");
			}
		});
	},
};
