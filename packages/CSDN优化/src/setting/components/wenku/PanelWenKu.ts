import { CSDNRouter } from "@/router/CSDNRouter"
import { UISwitch } from "@/setting/common-components/ui-switch"

const SettingUIWenKu: PopsPanelContentConfig = {
    id: "panel-wenku",
    title: "资源",
    isDefault() {
        return CSDNRouter.isLink()
    },
    forms: [
        {
            text: "屏蔽",
            type: "forms",
            forms: [
                UISwitch(
                    "【屏蔽】资源推荐",
                    "csdn-wenku-shieldResourceRecommend",
                    false
                ),
                UISwitch(
                    "【屏蔽】右侧用户信息",
                    "csdn-wenku-shieldRightUserInfo",
                    false
                ),
                UISwitch(
                    "【屏蔽】右侧悬浮工具栏",
                    "csdn-wenku-shieldRightToolBar",
                    false
                ),
            ],
        },
    ]
}


export {
    SettingUIWenKu
}