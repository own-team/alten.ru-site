import React, { useContext, useEffect, useReducer } from 'react'
import Header from '../../blocks/header/header'
import DataPreloader from '../../blocks/data-preloader/index'
import ProductSelectedSlider from './slider/index'
import { RouteComponentProps } from 'react-router-dom'
import {
    SelectedProductContext,
    SelectedProductContextTypes
} from '../../../contexts/selected-product-context'
import {
    SELECTED_PRODUCT_CATEGORY_ID,
    SELECTED_PRODUCT_ITEM_ID
} from '../../../consts/product-selected-consts'
import {
    asyncDataReducer,
    initialState
} from '../../../utils/async-data-states/reducer'
import {
    ERROR,
    FETCHED,
} from '../../../utils/async-data-states/types'
import { getAsyncData } from '../../../utils/async-get-data'

/**
 * Get category id for async get data method call from the server
 * @param props route component props
 * @param context product pages context
 * @returns category id for request to server
 */
const getCategoryId = (
    props: RouteComponentProps,
    context: SelectedProductContextTypes,
): number => {
    if (props.location.state !== undefined && props.location.state !== null)
        return props.location.state['category_id']

    if (context.state.selectedCategoryId !== 0)
        return Number(context.state.selectedCategoryId)

    if (Number(sessionStorage.getItem(SELECTED_PRODUCT_CATEGORY_ID)) !== 0)
        return Number(sessionStorage.getItem(SELECTED_PRODUCT_CATEGORY_ID))

    const path = props.location.pathname
    return Number(path.slice(path.lastIndexOf('/') + 1, path.length))
}

/**
 * Render dom component for current selected products category
 * @param props route component props
 * @returns render dom component
 */
const ProductsSelected: React.FunctionComponent<RouteComponentProps> = (props) => {
    const context: SelectedProductContextTypes = useContext(SelectedProductContext)
    const [state, dispatch] = useReducer(asyncDataReducer, initialState)

    useEffect(() => {
        getAsyncData({
            api_v: 0,
            url: 'products',
            params: {
                'category': getCategoryId(props, context)
            }
        })
        .then(result => dispatch({ type: FETCHED, payload: { data: result.data } }))
        .catch(error => dispatch({ type: ERROR, payload: { errorString: error } }))
    }, [])

    return (
        <div className="content">
            {!state.loading ?
                <React.Fragment>
                    <Header title='Продукция' subtitle='Продукция нашего предприятия' />
                    <article className='text'>
                        <ProductSelectedSlider items={state.data}/>
                    </article>
                </React.Fragment>
                : <DataPreloader />
            }
        </div>
    )
}

export default ProductsSelected;