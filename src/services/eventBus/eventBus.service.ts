export const on = (event: string, callback: (...args: any[]) => void) => {
	document.addEventListener(event, (e: any) =>
		callback(e.detail?.data, e.detail.resolve, e.detail.reject)
	)
}
export const dispatch = (event: string, data?: any) => {
	document.dispatchEvent(new CustomEvent(event, { detail: { data } }))
}
export const asyncDispatch = (event: string, data?: any) => {
	return new Promise((resolve, reject) => {
		document.dispatchEvent(
			new CustomEvent(event, { detail: { data, resolve, reject } })
		)
	})
}
export const remove = (event: string, callback: (...args: any[]) => void) => {
	document.removeEventListener(event, callback)
}
