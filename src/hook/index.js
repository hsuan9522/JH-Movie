import useLoading from './useLoading'
import useError from './useError'

export {
    useLoading,
    useError
}


// 覺得 loading, error 的狀態應該是共用的，所以暫時不用 hook 的方式，而是用 store 的方式統一管理
/** hook 在 <script setup> 的用法
 * import { useLoading, useError } from '@/hook'
 * const { isLoading, startLoading, finishLoading } = useLoading()
 * const { isError, setError, unsetError } = useError()
 */
