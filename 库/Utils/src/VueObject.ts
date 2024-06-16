import type { AnyObject } from "./Utils";

export declare interface Vue2Object extends AnyObject {
	$attrs: AnyObject;
	$children: Vue2Object[];
	$createElement: (...args: any[]) => any;
	$el: HTMLElement;
	$listeners: AnyObject;
	$options: AnyObject;
	$parent: Vue2Object;
	$refs: AnyObject;
	$root: Vue2Object;
	$scopedSlots: AnyObject;
	$slots: AnyObject;
	$store: AnyObject;
	$vnode: AnyObject;

	_data: AnyObject;
	_directInactive: boolean;
	_events: AnyObject;
	_hasHookEvent: boolean;
	_isBeingDestroyed: boolean;
	_isDestroyed: boolean;
	_isMounted: boolean;
	_isVue: boolean;

	$data: AnyObject;
	$isServer: boolean;
	$props: AnyObject;
	$route: AnyObject & {
		fullPath: string;
		hash: string;
		matched: AnyObject[];
		meta: AnyObject;
		name: string;
		params: AnyObject;
		path: string;
		query: AnyObject;
	};
	$router: AnyObject & {
		afterHooks: Function[];
		app: Vue2Object;
		apps: Vue2Object[];
		beforeHooks: Function[];
		fallback: boolean;
		history: AnyObject & {
			base: string;
			current: AnyObject;
			listeners: AnyObject[];
			router: Vue2Object["$router"];
			/**
			 *
			 * @param delta 访问的距离。如果 delta < 0 则后退相应数量的记录，如果 > 0 则前进。
			 * @param triggerListeners 是否应该触发连接到该历史的监听器
			 * @returns
			 */
			go: (delta: number, triggerListeners?: boolean) => void;
			/**
			 *
			 * @param to 要设置的地址
			 * @param data 可选的 HistoryState 以关联该导航记录
			 * @returns
			 */
			push: (to: string, data?: AnyObject) => void;
			/**
			 *
			 * @param to 要设置的地址
			 * @param data 可选的 HistoryState 以关联该导航记录
			 * @returns
			 */
			replace: (to: string, data?: AnyObject) => void;
		};
		matcher: AnyObject & {
			addRoute: (...args: any[]) => any;
			addRoutes: (...args: any[]) => any;
			getRoutes: () => any;
			match: (...args: any[]) => any;
		};
		mode: string;
		resolveHooks: ((...args: any[]) => any)[];
		currentRoute: AnyObject;
		beforeEach: (
			callback:
				| ((
						/** 即将要进入的目标 路由对象 */
						to: Vue2Object["$route"],
						/** 当前导航正要离开的路由 */
						from: Vue2Object["$route"],
						/**
						 *
						 * + next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
						 * + next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
						 * + next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。
						 * + next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。
						 */
						next: Function
				  ) => void)
				/** 移除上一个添加的监听 */
				| (() => void)
		) => void;

		afterEach: (
			callback:
				| ((
						/** 即将要进入的目标 路由对象 */
						to: Vue2Object["$route"],
						/** 当前导航正要离开的路由 */
						from: Vue2Object["$route"]
				  ) => void)
				/** 移除上一个添加的监听 */
				| (() => void)
		) => void;
	};
	$ssrContext: AnyObject;

	$watch: (
		key: string | string[] | (() => any),
		handler: (this: any, newVal: any, oldVal: any) => void,
		options?: {
			immediate?: boolean;
			deep?: boolean;
		}
	) => void;
}
