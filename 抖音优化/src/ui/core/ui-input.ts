import { PopsPanel } from "..";

/**
 * 获取输入框配置
 * @param text 文字
 * @param description 描述
 * @param placeholder 提示
 * @param key 键
 * @param defaultValue 默认值
 * @param callback 输入回调
 * @returns {PopsPanelInputDetails}
 */
const UIInput = function (
    text: string,
    description: string | undefined,
    placeholder: string | undefined = "",
    key: string,
    defaultValue: string,
    callback?: ((event: InputEvent, value: string) => boolean) | undefined,
): PopsPanelInputDetails {
    return {
        text: text,
        type: "input",
        attributes: {
            "data-key": key,
            "data-default-value": defaultValue,
        },
        description: description,
        getValue() {
            let localValue = PopsPanel.getValue(key, defaultValue);
            return localValue;
        },
        callback(event: InputEvent, value: string) {
            if (typeof callback === "function") {
                if (callback(event, value)) {
                    return;
                }
            }
            PopsPanel.setValue(key, value);
        },
        placeholder: placeholder,
    };
}
export {
    UIInput
}