/**
 * 搜索建议悬浮窗
 * pops.searchSuggestion
 */
export interface PopsSearchSuggestionDetails<T = any> {
    /**
     * 当前的环境，可以是document，可以是shadowroot，默认是document
     * @default document
     */
    selfDocument?: Document | ShadowRoot | (Document | ShadowRoot)[];
    /**
     * 目标元素，一般是跟随它的位置变化，监听它的focus/click
     */
    target: HTMLElement;
    /**
     * 目标input元素，监听它的focus/click/input事件
     */
    inputTarget?: HTMLInputElement | HTMLTextAreaElement;
    /**
     * 数据
     */
    data: T[] | (() => T[]);
    /**
     * 右边的删除按钮图标
     */
    deleteIcon?: {
        /**
         * 是否启用
         * @default true
         */
        enable?: boolean;
        /**
         * 点击回调
         */
        callback?: (event: MouseEvent | PointerEvent, liElement: HTMLLIElement, data: T) => void;
    };
    /**
     * 自定义的className
     */
    className?: string;
    /**
     * position是否使用absolut
     * @default true
     */
    isAbsolute?: boolean;
    /**
     * 是否启用动画
     * @default true
     */
    isAnimation?: boolean;
    /**
     * 建议框的宽度
     * @default "250px"
     */
    width?: string;
    /**
     * 是否和config.target的宽度同步
     * @default true
     */
    followTargetWidth?: true;
    /**
     * 建议框的最大高度
     * @default "300px"
     */
    maxHeight?: string;
    /**
     * 建议框距离元素的距离
     * @default 0
     */
    topDistance?: number;
    /**
     * 建议框显示的位置，默认是auto(自动判断位置)
     * @default "auto"
     */
    position?: "top" | "bottom" | "auto";
    /**
     * 当位置在上面时（包括auto自动判断在上面时），是否对搜索项进行反转
     * @default true
     */
    positionTopToReverse?: boolean;
    /**
     * 层级，默认10000
     * @default 10000
     */
    zIndex?: number | (() => number);
    /**
     * 搜索中的提示
     *
     * 前提：inputTarget是input/textarea
     *
     * 触发change事件，且没有搜索到数据，则显示此提示
     */
    searchingTip?: string;
    /**
     * 没有搜索结果的提示的html
     *
     * 前提：inputTarget是input/textarea
     *
     * 触发change事件，且没有搜索到数据，则显示此结果项
     */
    toSearhNotResultHTML?: string;
    /**
     * 没有搜索结果是否隐藏提示框
     * @default false
     */
    toHideWithNotResult?: boolean;
    /**
     * 跟随目标的位置
     * @default "target"
     */
    followPosition?: "target" | "input" | "inputCursor";
    /**
     * 获取每一项的html，在显示的时候会调用该函数
     *
     * 它的父元素是一个<li>标签
     */
    getItemHTML: (item: T) => string;
    /**
     * 当config.target触发input时自动调用该函数来获取数据
     * @param inputValue 当前输入框的值
     */
    getData?: (inputValue: string) => Promise<T[]> | T[];
    /**
     * 每一项的点击回调
     * @param event 触发的事件
     * @param liElement 每一项的元素
     * @param data config.data的数据
     */
    itemClickCallBack?: (event: MouseEvent | PointerEvent, liElement: HTMLLIElement, data: T) => void;
    /**
     * 键盘的上下键选择的回调
     * @param event 触发的事件
     * @param liElement 每一项的元素
     * @param data config.data的数据
     */
    selectCallBack?: (event: MouseEvent, liElement: HTMLLIElement, data: T) => void;
    /**
     * （可选）自定义style
     */
    style?: string;
}
/**
 * pops.searchSuggestion的函数返回值
 */
export interface PopsSearchSuggestionResult<T = any> {
    $el: {
        /** 根元素 */
        root: HTMLElement;
        /** ul元素 */
        $hintULContainer: HTMLUListElement;
        /** 动态更新CSS */
        $dynamicCSS: HTMLStyleElement;
    };
    /**
     * 初始化
     */
    init: () => void;
    /**
     * 获取显示出搜索建议框的html
     */
    getSearchSelectElement: () => HTMLElement;
    /**
     * 获取显示出搜索建议框的每一项的html
     */
    getSearchItemLiElement: (data: T, index: number) => HTMLElement;
    /**
     * 获取data-value值
     */
    getItemDataValue: (data: T) => T;
    /**
     * 设置搜索建议框每一项的点击事件
     */
    setSearchItemClickEvent: (liElement: HTMLLIElement) => void;
    /**
     * 监听输入框内容改变
     */
    setInputChangeEvent: (option?: AddEventListenerOptions) => void;
    /**
     * 移除输入框内容改变的监听
     */
    removeInputChangeEvent: (option?: AddEventListenerOptions) => void;
    /**
     * 设置显示搜索建议框的事件
     */
    setShowEvent: (option?: AddEventListenerOptions) => void;
    /**
     * 移除显示搜索建议框的事件
     */
    removeShowEvent: (option?: AddEventListenerOptions) => void;
    /**
     * 设置隐藏搜索建议框的事件
     */
    setHideEvent: (option?: AddEventListenerOptions) => void;
    /**
     * 移除隐藏搜索建议框的事件
     */
    removeHideEvent: (option?: AddEventListenerOptions) => void;
    /**
     * 设置所有监听
     */
    setAllEvent: (option?: AddEventListenerOptions) => void;
    /**
     * 移除所有监听
     */
    removeAllEvent: (option?: AddEventListenerOptions) => void;
    /**
     * 获取删除按钮的html
     */
    getDeleteIconHTML: (size: number, fill: string) => void;
    /**
     * 设置当前正在搜索中的提示
     */
    setPromptsInSearch: () => void;
    /**
     * 移除正在搜索中的提示
     */
    removePromptsInSearch: () => void;
    /**
     * 清空所有的搜索结果
     */
    clearAllSearchItemLi: () => void;
    /**
     * 修改搜索建议框的位置(top、left)
     * 因为目标元素可能是动态隐藏的
     */
    changeHintULElementPosition: () => void;
    /**
     * 修改搜索建议框的width
     * 因为目标元素可能是动态隐藏的
     */
    changeHintULElementWidth: () => void;
    updateDynamicCSS: () => void;
    /**
     * 更新页面显示的搜索结果
     */
    update: (data: T[]) => void;
    /**
     * 清空当前的搜索结果并显示无结果
     */
    clear: () => void;
    /**
     * 隐藏搜索建议框
     */
    hide: () => void;
    /**
     * 显示搜索建议框
     */
    show: () => void;
}
