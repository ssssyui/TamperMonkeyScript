import { UISwitch } from "../common-components/ui-switch";

export const MPanelShareMusicConfig: PopsPanelContentConfig = {
	id: "m-panel-config-share-music",
	title: "音乐",
	headerTitle: "/share/music<br />音乐",
	forms: [
		{
			text: "覆盖点击事件",
			type: "forms",
			forms: [
				UISwitch(
					"视频卡片",
					"m-dy-share-music-coverVideoCard",
					true,
					void 0,
					"正确跳转视频页面"
				),
			],
		},
	],
};
