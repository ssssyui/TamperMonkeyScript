import { UISwitch } from "../common-components/ui-switch";

export const MPanelShareChallengeConfig: PopsPanelContentConfig = {
	id: "m-panel-config-share-challenge",
	title: "话题",
	headerTitle: "/share/challenge<br />话题",
	forms: [
		{
			text: "覆盖点击事件",
			type: "forms",
			forms: [
				UISwitch(
					"顶部区域",
					"m-dy-share-challenge-coverTopJump",
					true,
					void 0,
					"阻止跳转至下载页面"
				),
				UISwitch(
					"视频卡片",
					"m-dy-share-challenge-coverVideoCard",
					true,
					void 0,
					"正确跳转视频页面"
				),
			],
		},
	],
};
